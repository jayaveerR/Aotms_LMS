import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:5000/api";

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor_name?: string;
  category?: string;
  thumbnail_url?: string;
  duration_hours?: number;
  total_lessons?: number;
  level?: "Beginner" | "Intermediate" | "Advanced";
  price?: number;
  is_free?: boolean;
  status?: string;
  created_at?: string;
  enrollment_count?: number;
}

export interface Enrollment {
  id: string;
  course_id: string;
  user_id: string;
  enrolled_at: string;
  progress_percent?: number;
  course?: Course;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/data/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load courses");
      const data: Course[] = await res.json();
      // Only show approved/published courses on the public browse page
      setCourses(
        data.filter(
          (c) =>
            !c.status || c.status === "approved" || c.status === "published",
        ),
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/data/course_enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load enrollments");
      const data: Enrollment[] = await res.json();
      setEnrollments(data);
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const enroll = useCallback(
    async (
      courseId: string,
    ): Promise<{ success: boolean; message: string }> => {
      const token = localStorage.getItem("access_token");
      if (!token) return { success: false, message: "Not logged in" };
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user) return { success: false, message: "User not found" };

      setEnrolling(courseId);
      try {
        const res = await fetch(`${API_URL}/data/course_enrollments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_id: courseId,
            user_id: user.id,
            enrolled_at: new Date().toISOString(),
            progress_percent: 0,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Enrollment failed");
        await fetchEnrollments();
        return { success: true, message: "Successfully enrolled!" };
      } catch (err: unknown) {
        return {
          success: false,
          message: err instanceof Error ? err.message : "Enrollment failed",
        };
      } finally {
        setEnrolling(null);
      }
    },
    [fetchEnrollments],
  );

  const isEnrolled = useCallback(
    (courseId: string) => {
      return enrollments.some((e) => e.course_id === courseId);
    },
    [enrollments],
  );

  return {
    enrollments,
    loading,
    enrolling,
    enroll,
    isEnrolled,
    refetch: fetchEnrollments,
  };
}
