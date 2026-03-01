import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

// Types for admin data
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  status: "active" | "suspended" | "pending";
  last_active_at: string | null;
  created_at: string;
  role?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "manager" | "instructor" | "student";
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor_id: string | null;
  instructor_name: string | null;
  status: "pending" | "approved" | "rejected" | "disabled";
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
  risk_level: "low" | "medium" | "high" | "critical";
  details: Record<string, unknown> | null;
  resolved: boolean;
  created_at: string;
}

export interface SystemLog {
  id: string;
  log_type: "info" | "warning" | "error" | "audit" | "system";
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
  totalRevenue: number;
}

const API_URL = "http://localhost:5000/api";

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${url}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("user_role");
      window.location.reload();
      throw new Error("Session expired. Please login again.");
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "API Request Failed");
  }
  return res.json();
};

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
    totalRevenue: 0,
  });

  // Fetch all admin data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch in parallel
      const [
        profilesData,
        rolesData,
        coursesData,
        eventsData,
        logsData,
        enrollmentsData,
      ] = await Promise.all([
        fetchWithAuth("/data/profiles?sort=created_at&order=desc"),
        fetchWithAuth("/data/user_roles"),
        fetchWithAuth("/data/courses?sort=submitted_at&order=desc"),
        fetchWithAuth(
          "/data/security_events?sort=created_at&order=desc&limit=50",
        ),
        fetchWithAuth("/data/system_logs?sort=created_at&order=desc&limit=100"),
        fetchWithAuth("/data/course_enrollments").catch(() => []), // Fallback if table doesn't exist
      ]);

      if (profilesData) setProfiles(profilesData as Profile[]);
      if (rolesData) {
        setUserRoles(rolesData as UserRole[]);
        // Calculate role counts
        const counts: Record<string, number> = {};
        (rolesData as UserRole[]).forEach((r) => {
          counts[r.role] = (counts[r.role] || 0) + 1;
        });
        setStats((prev) => ({ ...prev, roleCounts: counts }));
      }
      if (coursesData) {
        setCourses(coursesData as Course[]);
        const pending = (coursesData as Course[]).filter(
          (c) => c.status === "pending",
        ).length;
        const approved = (coursesData as Course[]).filter(
          (c) => c.status === "approved",
        ).length;
        setStats((prev) => ({
          ...prev,
          pendingCourses: pending,
          activeCourses: approved,
        }));
      }
      if (eventsData) {
        setSecurityEvents(eventsData as SecurityEvent[]);
        const highPriority = (eventsData as SecurityEvent[]).filter(
          (e) => e.risk_level === "high" || e.risk_level === "critical",
        ).length;
        setStats((prev) => ({
          ...prev,
          securityEvents: eventsData?.length || 0,
          highPriorityEvents: highPriority,
        }));
      }
      if (logsData) setSystemLogs(logsData as SystemLog[]);

      // Calculate revenue from enrollments
      if (enrollmentsData) {
        const revenue = (enrollmentsData as Record<string, unknown>[]).reduce(
          (sum, enr) => {
            // Check for price or amount, default to 0 if not found
            const price = (enr.amount as number) || (enr.price as number) || 0;
            return sum + price;
          },
          0,
        );
        setStats((prev) => ({ ...prev, totalRevenue: revenue }));
      }

      // Update total users count
      setStats((prev) => ({ ...prev, totalUsers: profilesData?.length || 0 }));
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Set up polling instead of realtime
  useEffect(() => {
    fetchAllData();
    // Poll every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Admin actions
  const updateUserStatus = async (
    userId: string,
    status: "active" | "suspended",
  ) => {
    try {
      await fetchWithAuth(`/data/profiles/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
      });

      // Log action
      await fetchWithAuth("/rpc/log_admin_action", {
        method: "POST",
        body: JSON.stringify({
          _module: "User",
          _action: `User ${status === "suspended" ? "suspended" : "activated"}`,
          _details: { user_id: userId },
        }),
      });

      toast({
        title: "Success",
        description: `User ${status === "suspended" ? "suspended" : "activated"}`,
      });
      fetchAllData(); // Refresh data
      return true;
    } catch (error: any) {
      console.error("updateUserStatus FAILED:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUserRole = async (
    userId: string,
    newRole: "admin" | "manager" | "instructor" | "student",
  ) => {
    try {
      // Find if user has a role record first. My generic API is simple CRUD.
      // Assuming we can just create/update.
      // The original code was: DELETE then INSERT.
      // For generic API, we can try to find existing role ID (on client side since we have userRoles loaded)
      // or just add a DELETE endpoint logic here.

      // Find existing role ID
      const currentRole = userRoles.find((ur) => ur.user_id === userId);
      if (currentRole) {
        await fetchWithAuth(`/data/user_roles/${currentRole.id}`, {
          method: "DELETE",
        });
      }

      await fetchWithAuth("/data/user_roles", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });

      // Log action
      await fetchWithAuth("/rpc/log_admin_action", {
        method: "POST",
        body: JSON.stringify({
          _module: "Role",
          _action: `Role changed to ${newRole}`,
          _details: { user_id: userId, new_role: newRole },
        }),
      });

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
      fetchAllData();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
      return false;
    }
  };

  const approveCourse = async (courseId: string) => {
    try {
      const { user } = await fetchWithAuth("/user/profile");

      await fetchWithAuth(`/data/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.user?.id || user?.id, // Depends on profile structure
          updated_at: new Date().toISOString(),
        }),
      });

      await fetchWithAuth("/rpc/log_admin_action", {
        method: "POST",
        body: JSON.stringify({
          _module: "Course",
          _action: "Course approved",
          _details: { course_id: courseId },
        }),
      });

      toast({ title: "Success", description: "Course approved successfully" });
      fetchAllData();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve course",
        variant: "destructive",
      });
      return false;
    }
  };

  const rejectCourse = async (courseId: string, reason: string) => {
    try {
      const { user } = await fetchWithAuth("/user/profile");

      await fetchWithAuth(`/data/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify({
          status: "rejected",
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.user?.id || user.id,
          updated_at: new Date().toISOString(),
        }),
      });

      await fetchWithAuth("/rpc/log_admin_action", {
        method: "POST",
        body: JSON.stringify({
          _module: "Course",
          _action: "Course rejected",
          _details: { course_id: courseId, reason },
        }),
      });

      toast({ title: "Success", description: "Course rejected" });
      fetchAllData();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject course",
        variant: "destructive",
      });
      return false;
    }
  };

  const resolveSecurityEvent = async (eventId: string) => {
    try {
      const { user } = await fetchWithAuth("/user/profile");

      await fetchWithAuth(`/data/security_events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: user?.user?.id || user.id,
        }),
      });

      toast({
        title: "Success",
        description: "Security event marked as resolved",
      });
      fetchAllData();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve security event",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get user with their role
  const getUsersWithRoles = (): Profile[] => {
    return profiles.map((profile) => {
      const userRole = userRoles.find((r) => r.user_id === profile.id);
      return {
        ...profile,
        role: userRole?.role || "student",
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
