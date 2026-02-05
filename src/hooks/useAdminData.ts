import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

// Type helper for raw queries (tables not yet in generated types)
const db = supabase as SupabaseClient<any>;

// Types for admin data
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  status: 'active' | 'suspended' | 'pending';
  last_active_at: string | null;
  created_at: string;
  role?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'manager' | 'instructor' | 'student';
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor_id: string | null;
  instructor_name: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'disabled';
  category: string | null;
  thumbnail_url: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
}

export interface SecurityEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  user_email: string | null;
  ip_address: string | null;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, unknown> | null;
  resolved: boolean;
  created_at: string;
}

export interface SystemLog {
  id: string;
  log_type: 'info' | 'warning' | 'error' | 'audit' | 'system';
  module: string;
  action: string;
  user_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  activeCourses: number;
  pendingCourses: number;
  securityEvents: number;
  highPriorityEvents: number;
  roleCounts: Record<string, number>;
}

export function useAdminData() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeCourses: 0,
    pendingCourses: 0,
    securityEvents: 0,
    highPriorityEvents: 0,
    roleCounts: {},
  });

  // Fetch all admin data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch in parallel
      const [profilesRes, rolesRes, coursesRes, eventsRes, logsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('*'),
        supabase.from('courses').select('*').order('submitted_at', { ascending: false }),
        supabase.from('security_events').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('system_logs').select('*').order('created_at', { ascending: false }).limit(100),
      ]);

      if (profilesRes.data) setProfiles(profilesRes.data as Profile[]);
      if (rolesRes.data) {
        setUserRoles(rolesRes.data as UserRole[]);
        // Calculate role counts
        const counts: Record<string, number> = {};
        (rolesRes.data as UserRole[]).forEach((r) => {
          counts[r.role] = (counts[r.role] || 0) + 1;
        });
        setStats((prev) => ({ ...prev, roleCounts: counts }));
      }
      if (coursesRes.data) {
        setCourses(coursesRes.data as Course[]);
        const pending = (coursesRes.data as Course[]).filter((c) => c.status === 'pending').length;
        const approved = (coursesRes.data as Course[]).filter((c) => c.status === 'approved').length;
        setStats((prev) => ({ ...prev, pendingCourses: pending, activeCourses: approved }));
      }
      if (eventsRes.data) {
        setSecurityEvents(eventsRes.data as SecurityEvent[]);
        const highPriority = (eventsRes.data as SecurityEvent[]).filter(
          (e) => e.risk_level === 'high' || e.risk_level === 'critical'
        ).length;
        setStats((prev) => ({
          ...prev,
          securityEvents: eventsRes.data?.length || 0,
          highPriorityEvents: highPriority,
        }));
      }
      if (logsRes.data) setSystemLogs(logsRes.data as SystemLog[]);

      // Update total users count
      setStats((prev) => ({ ...prev, totalUsers: profilesRes.data?.length || 0 }));
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Set up realtime subscriptions
  useEffect(() => {
    fetchAllData();

    // Subscribe to realtime changes
    const channels: RealtimeChannel[] = [];

    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProfiles((prev) => [payload.new as Profile, ...prev]);
          setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
        } else if (payload.eventType === 'UPDATE') {
          setProfiles((prev) => prev.map((p) => (p.id === payload.new.id ? (payload.new as Profile) : p)));
        } else if (payload.eventType === 'DELETE') {
          setProfiles((prev) => prev.filter((p) => p.id !== payload.old.id));
          setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
        }
      })
      .subscribe();
    channels.push(profilesChannel);

    const rolesChannel = supabase
      .channel('roles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setUserRoles((prev) => [...prev, payload.new as UserRole]);
        } else if (payload.eventType === 'UPDATE') {
          setUserRoles((prev) => prev.map((r) => (r.id === payload.new.id ? (payload.new as UserRole) : r)));
        } else if (payload.eventType === 'DELETE') {
          setUserRoles((prev) => prev.filter((r) => r.id !== payload.old.id));
        }
        // Recalculate role counts
        fetchAllData();
      })
      .subscribe();
    channels.push(rolesChannel);

    const coursesChannel = supabase
      .channel('courses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setCourses((prev) => [payload.new as Course, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setCourses((prev) => prev.map((c) => (c.id === payload.new.id ? (payload.new as Course) : c)));
        } else if (payload.eventType === 'DELETE') {
          setCourses((prev) => prev.filter((c) => c.id !== payload.old.id));
        }
        // Update stats
        fetchAllData();
      })
      .subscribe();
    channels.push(coursesChannel);

    const eventsChannel = supabase
      .channel('security-events-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'security_events' }, (payload) => {
        setSecurityEvents((prev) => [payload.new as SecurityEvent, ...prev.slice(0, 49)]);
        setStats((prev) => ({
          ...prev,
          securityEvents: prev.securityEvents + 1,
          highPriorityEvents:
            (payload.new as SecurityEvent).risk_level === 'high' ||
            (payload.new as SecurityEvent).risk_level === 'critical'
              ? prev.highPriorityEvents + 1
              : prev.highPriorityEvents,
        }));
        // Show toast for high priority events
        const event = payload.new as SecurityEvent;
        if (event.risk_level === 'high' || event.risk_level === 'critical') {
          toast({
            title: '⚠️ Security Alert',
            description: `${event.event_type}: ${event.user_email || 'Unknown user'}`,
            variant: 'destructive',
          });
        }
      })
      .subscribe();
    channels.push(eventsChannel);

    const logsChannel = supabase
      .channel('system-logs-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_logs' }, (payload) => {
        setSystemLogs((prev) => [payload.new as SystemLog, ...prev.slice(0, 99)]);
      })
      .subscribe();
    channels.push(logsChannel);

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [fetchAllData, toast]);

  // Admin actions
  const updateUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    const { error } = await supabase.from('profiles').update({ status, updated_at: new Date().toISOString() }).eq('id', userId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update user status', variant: 'destructive' });
      return false;
    }

    // Log the action
    await supabase.rpc('log_admin_action', {
      _module: 'User',
      _action: `User ${status === 'suspended' ? 'suspended' : 'activated'}`,
      _details: { user_id: userId },
    });

    toast({ title: 'Success', description: `User ${status === 'suspended' ? 'suspended' : 'activated'}` });
    return true;
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'manager' | 'instructor' | 'student') => {
    // First delete existing role, then insert new one
    await supabase.from('user_roles').delete().eq('user_id', userId);

    const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: newRole });

    if (error) {
      toast({ title: 'Error', description: 'Failed to update user role', variant: 'destructive' });
      return false;
    }

    // Log the action
    await supabase.rpc('log_admin_action', {
      _module: 'Role',
      _action: `Role changed to ${newRole}`,
      _details: { user_id: userId, new_role: newRole },
    });

    toast({ title: 'Success', description: `User role updated to ${newRole}` });
    return true;
  };

  const approveCourse = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('courses')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to approve course', variant: 'destructive' });
      return false;
    }

    await supabase.rpc('log_admin_action', {
      _module: 'Course',
      _action: 'Course approved',
      _details: { course_id: courseId },
    });

    toast({ title: 'Success', description: 'Course approved successfully' });
    return true;
  };

  const rejectCourse = async (courseId: string, reason: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('courses')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to reject course', variant: 'destructive' });
      return false;
    }

    await supabase.rpc('log_admin_action', {
      _module: 'Course',
      _action: 'Course rejected',
      _details: { course_id: courseId, reason },
    });

    toast({ title: 'Success', description: 'Course rejected' });
    return true;
  };

  const resolveSecurityEvent = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('security_events')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: user?.id,
      })
      .eq('id', eventId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to resolve security event', variant: 'destructive' });
      return false;
    }

    toast({ title: 'Success', description: 'Security event marked as resolved' });
    return true;
  };

  // Get user with their role
  const getUsersWithRoles = (): Profile[] => {
    return profiles.map((profile) => {
      const userRole = userRoles.find((r) => r.user_id === profile.id);
      return {
        ...profile,
        role: userRole?.role || 'student',
      };
    });
  };

  return {
    loading,
    profiles: getUsersWithRoles(),
    courses,
    securityEvents,
    systemLogs,
    stats,
    userRoles,
    refresh: fetchAllData,
    updateUserStatus,
    updateUserRole,
    approveCourse,
    rejectCourse,
    resolveSecurityEvent,
  };
}
