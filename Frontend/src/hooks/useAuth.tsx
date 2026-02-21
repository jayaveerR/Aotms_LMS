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
  // Initialize state from localStorage for instant persistence on refresh
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [session, setSession] = useState<Session | null>(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const savedUser = localStorage.getItem('user');
    return {
      access_token: token,
      user: savedUser ? JSON.parse(savedUser) : null
    } as Session;
  });
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    return localStorage.getItem('user_role') as UserRole | null;
  });

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
      localStorage.removeItem('user');
      localStorage.removeItem('user_role');
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
      // 1. Validate session and get user data
      const profileRes = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!profileRes.ok) {
        if (profileRes.status === 401) {
          throw new Error('Session expired');
        }
        // If it's a server error, we keep the previous local state but finish loading
        console.warn('Backend profile check failed, relying on local storage');
        setLoading(false);
        return;
      }

      const { user: userData } = await profileRes.json();

      // Update local state and storage with fresh data
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setSession({ access_token: token, user: userData } as Session);

      // 2. Fetch/Validate role
      const roleRes = await fetch(`${API_URL}/user/role`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (roleRes.ok) {
        const { role } = await roleRes.json();
        setUserRole(role);
        localStorage.setItem('user_role', role);
      } else if (!userRole) {
        // Only default to student if we don't already have a role from storage
        setUserRole('student');
        localStorage.setItem('user_role', 'student');
      }

    } catch (error: unknown) {
      console.error('Session check failed:', error);
      void signOut(); // Clear invalid session
    } finally {
      setLoading(false);
    }
  }, [signOut, userRole]);

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

      if (data.session) {
        localStorage.setItem('access_token', data.session.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('user_role', 'student');

        setUser(data.user);
        setSession(data.session);
        setUserRole('student');
      }

      return { error: null };
    } catch (error: unknown) {
      if (error instanceof Error) return { error };
      return { error: new Error('Unknown error during signup') };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return { error: new Error(data.error || 'Login failed') };
      }

      if (data.session) {
        localStorage.setItem('access_token', data.session.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(data.user);
        setSession(data.session);

        // Fetch role after login
        const roleRes = await fetch(`${API_URL}/user/role`, {
          headers: { Authorization: `Bearer ${data.session.access_token}` }
        });

        let role: UserRole = 'student';
        if (roleRes.ok) {
          const roleData = await roleRes.json();
          role = roleData.role;
        }

        setUserRole(role);
        localStorage.setItem('user_role', role);
      }

      setLoading(false);
      return { error: null };
    } catch (error: unknown) {
      setLoading(false);
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