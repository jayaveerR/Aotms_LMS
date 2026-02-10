import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { UserRole } from '@/types/auth';

// Simplified types to replace Supabase types
interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface Session {
  access_token: string;
  user: User | null;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
      setSession(null);
      setUserRole(null);
    }
  }, []);

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user profile/data to validate token
      const profileRes = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!profileRes.ok) {
        throw new Error('Session expired');
      }

      const { user: userData } = await profileRes.json();
      setUser(userData);

      // Mock session object since we just have token
      setSession({ access_token: token, user: userData } as Session);

      // Fetch role
      const roleRes = await fetch(`${API_URL}/user/role`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (roleRes.ok) {
        const { role } = await roleRes.json();
        setUserRole(role);
      } else {
        setUserRole('student');
      }

    } catch (error: unknown) {
      console.error('Session check failed:', error);
      void signOut(); // Clear invalid session
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: new Error(data.error || 'Signup failed') };
      }

      // If signup returns a session immediately (depending on email confirmation settings)
      if (data.session) {
        localStorage.setItem('access_token', data.session.access_token);
        setUser(data.user);
        setSession(data.session);
        setUserRole('student'); // Default
      }

      return { error: null };
    } catch (error: unknown) {
      if (error instanceof Error) return { error };
      return { error: new Error('Unknown error during signup') };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: new Error(data.error || 'Login failed') };
      }

      if (data.session) {
        localStorage.setItem('access_token', data.session.access_token);
        setUser(data.user);
        setSession(data.session);

        // Fetch role after login
        const roleRes = await fetch(`${API_URL}/user/role`, {
          headers: { Authorization: `Bearer ${data.session.access_token}` }
        });
        if (roleRes.ok) {
          const { role } = await roleRes.json();
          setUserRole(role);
        } else {
          setUserRole('student');
        }
      }

      return { error: null };
    } catch (error: unknown) {
      if (error instanceof Error) return { error };
      return { error: new Error('Unknown error during signin') };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}