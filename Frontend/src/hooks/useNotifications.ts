import { useState, useEffect, useCallback, useRef } from "react";

const API_URL = "http://localhost:5000/api";
const POLL_INTERVAL_MS = 30_000; // 30 seconds
const STORAGE_KEY = "aotms_read_notifications";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "announcement" | "exam" | "grade" | "course" | "system";
  created_at: string;
  course_id?: string;
  exam_id?: string;
  is_read?: boolean; // managed client-side
}

// Read IDs persisted in localStorage so they survive page refresh
function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/data/announcements?sort=created_at&order=desc&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      // Map backend `announcements` rows to our Notification shape
      const mapped: Notification[] = (Array.isArray(data) ? data : []).map(
        (row: Record<string, unknown>) => ({
          id: String(row.id ?? ""),
          title: String(row.title ?? "Announcement"),
          message: String(row.message ?? row.content ?? row.description ?? ""),
          type: (row.type as Notification["type"]) ?? "announcement",
          created_at: String(row.created_at ?? new Date().toISOString()),
          course_id: row.course_id ? String(row.course_id) : undefined,
          exam_id: row.exam_id ? String(row.exam_id) : undefined,
        }),
      );

      setNotifications(mapped);
    } catch (err) {
      // If backend is unavailable, keep existing list
      console.warn("Notifications fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchNotifications();
    timerRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev).add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      saveReadIds(next);
      return next;
    });
  }, [notifications]);

  const isRead = useCallback((id: string) => readIds.has(id), [readIds]);

  return {
    notifications,
    unreadCount,
    loading,
    open,
    setOpen,
    markAsRead,
    markAllAsRead,
    isRead,
    refetch: fetchNotifications,
  };
}
