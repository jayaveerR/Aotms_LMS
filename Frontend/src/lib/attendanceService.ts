import { UserRole } from "@/types/auth";

export interface AttendanceRecord {
  id: string; // "user_id-YYYY-MM-DD"
  userId: string;
  role: string;
  date: string; // YYYY-MM-DD
  status: "present" | "absent";
  timestamp: string;
}

export interface SuspendedUser {
  userId: string;
  suspendedAt: string;
}

const ATTENDANCE_KEY = "aotms_attendance_records";
const SUSPENDED_KEY = "aotms_suspended_users";
const API_URL = "http://localhost:5000/api";

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Internal Helper for local storage
function getLocalAttendance(): AttendanceRecord[] {
  try {
    const data = localStorage.getItem(ATTENDANCE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalAttendance(records: AttendanceRecord[]) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

function getLocalSuspended(): SuspendedUser[] {
  try {
    const data = localStorage.getItem(SUSPENDED_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalSuspended(users: SuspendedUser[]) {
  localStorage.setItem(SUSPENDED_KEY, JSON.stringify(users));
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getAllAttendance(): Promise<AttendanceRecord[]> {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return getLocalAttendance();

    const res = await fetch(`${API_URL}/data/attendance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Backend fetch failed");

    const data = await res.json();
    const normalized = data.map((r: Record<string, unknown>) => ({
      id: r.id,
      userId: r.user_id,
      role: r.role,
      date: r.date,
      status: r.status,
      timestamp: r.created_at || r.timestamp,
    }));

    // Update local cache
    saveLocalAttendance(normalized);
    return normalized;
  } catch (e) {
    console.warn("Falling back to local attendance data:", e);
    return getLocalAttendance();
  }
}

export async function getSuspendedUsers(): Promise<SuspendedUser[]> {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return getLocalSuspended();

    const res = await fetch(`${API_URL}/data/suspended_users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Backend fetch failed");

    const data = await res.json();
    const normalized = data.map((r: Record<string, unknown>) => ({
      userId: r.user_id,
      suspendedAt: r.suspended_at || r.suspendedAt,
    }));

    // Update local cache
    saveLocalSuspended(normalized);
    return normalized;
  } catch (e) {
    console.warn("Falling back to local suspension data:", e);
    return getLocalSuspended();
  }
}

// 1. Log Daily Attendance on Login
export async function logDailyAttendance(userId: string, role: string) {
  const today = getTodayString();

  // Update Local Cache immediately
  const records = getLocalAttendance();
  const existing = records.find((r) => r.userId === userId && r.date === today);
  if (!existing) {
    records.push({
      id: `${userId}-${today}`,
      userId,
      role,
      date: today,
      status: "present",
      timestamp: new Date().toISOString(),
    });
    saveLocalAttendance(records);
  }

  // Sync to Backend
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      await fetch(`${API_URL}/attendance/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }), // userId taken from token by backend
      });
    }
  } catch (e) {
    console.error("Failed to log attendance to backend:", e);
  }
}

// 2. Mark absent (Manager or system could do this)
export async function markAbsent(userId: string, role: string, date: string) {
  // Update Local Cache
  const records = getLocalAttendance();
  const existingIndex = records.findIndex(
    (r) => r.userId === userId && r.date === date,
  );

  if (existingIndex >= 0) {
    records[existingIndex].status = "absent";
  } else {
    records.push({
      id: `${userId}-${date}`,
      userId,
      role,
      date,
      status: "absent",
      timestamp: new Date().toISOString(),
    });
  }
  saveLocalAttendance(records);

  // Sync to Backend
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      await fetch(`${API_URL}/data/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          date,
          status: "absent",
          role,
        }),
      });
    }
  } catch (e) {
    console.error("Failed to mark absent on backend:", e);
  }

  await checkAbsencesAndSuspend(userId);
}

// 3. Suspend & Reactivate
export async function suspendUser(userId: string) {
  const suspended = getLocalSuspended();
  if (!suspended.find((s) => s.userId === userId)) {
    suspended.push({ userId, suspendedAt: new Date().toISOString() });
    saveLocalSuspended(suspended);

    // Sync to Backend profiles table
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetch(`${API_URL}/data/profiles/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "suspended",
            updated_at: new Date().toISOString(),
          }),
        });
      }
    } catch (e) {
      console.error("Failed to suspend user on backend:", e);
    }

    // Simulate notification
    console.log(
      `[Notification] Student ${userId} has been suspended due to 5 absences. Sent to Manager and Instructor.`,
    );
    alert(
      `System Alert: Student account suspended due to excessive absences. Managers/Instructors have been notified.`,
    );
  }
}

export async function reactivateUser(userId: string) {
  let suspended = getLocalSuspended();
  suspended = suspended.filter((s) => s.userId !== userId);
  saveLocalSuspended(suspended);

  // Sync to Backend profiles table
  try {
    const token = localStorage.getItem("access_token");
    if (token) {
      await fetch(`${API_URL}/data/profiles/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "active",
          updated_at: new Date().toISOString(),
        }),
      });
    }
  } catch (e) {
    console.error("Failed to reactivate user on backend:", e);
  }
}

// Calculate total absences to check if we should throw a warning or suspend
export async function checkAbsencesAndSuspend(userId: string) {
  const records = await getAllAttendance();
  const userRecords = records.filter(
    (r) =>
      (r.userId === userId ||
        (r as unknown as Record<string, unknown>).user_id === userId) &&
      r.status === "absent",
  );
  const missingDays = userRecords.length;

  if (missingDays >= 5) {
    await suspendUser(userId);
  } else if (missingDays > 1) {
    console.log(
      `[Notification] Strict warning for ${userId}: Multiple days absent.`,
    );
  } else if (missingDays === 1) {
    console.log(
      `[Notification] Warning for ${userId}: Missed a class/test today.`,
    );
  }
  return missingDays;
}

export async function isUserSuspended(userId: string): Promise<boolean> {
  // Check Backend First
  try {
    const res = await fetch(`${API_URL}/attendance/check-suspension/${userId}`);
    const data = await res.json();
    return data.suspended;
  } catch (e) {
    // Fallback to LocalStorage
    const suspended = getLocalSuspended();
    return !!suspended.find((s) => s.userId === userId);
  }
}
