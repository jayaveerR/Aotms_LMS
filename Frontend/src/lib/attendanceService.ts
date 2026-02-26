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

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getAllAttendance(): AttendanceRecord[] {
  try {
    const data = localStorage.getItem(ATTENDANCE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveAllAttendance(records: AttendanceRecord[]) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

export function getSuspendedUsers(): SuspendedUser[] {
  try {
    const data = localStorage.getItem(SUSPENDED_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveSuspendedUsers(users: SuspendedUser[]) {
  localStorage.setItem(SUSPENDED_KEY, JSON.stringify(users));
}

// 1. Log Daily Attendance on Login
export function logDailyAttendance(userId: string, role: string) {
  const today = getTodayString();
  const records = getAllAttendance();
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
    saveAllAttendance(records);
  }
}

// 2. Mark absent (Manager or system could do this)
export function markAbsent(userId: string, role: string, date: string) {
  const records = getAllAttendance();
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
  saveAllAttendance(records);
  checkAbsencesAndSuspend(userId);
}

// 3. Suspend & Reactivate
export function suspendUser(userId: string) {
  const suspended = getSuspendedUsers();
  if (!suspended.find((s) => s.userId === userId)) {
    suspended.push({ userId, suspendedAt: new Date().toISOString() });
    saveSuspendedUsers(suspended);

    // Simulate notification
    console.log(
      `[Notification] Student ${userId} has been suspended due to 5 absences. Sent to Manager and Instructor.`,
    );
    alert(
      `System Alert: Student account suspended due to excessive absences. Managers/Instructors have been notified.`,
    );
  }
}

export function reactivateUser(userId: string) {
  let suspended = getSuspendedUsers();
  suspended = suspended.filter((s) => s.userId !== userId);
  saveSuspendedUsers(suspended);
}

// Calculate total absences to check if we should throw a warning or suspend
export function checkAbsencesAndSuspend(userId: string) {
  const records = getAllAttendance();
  const userRecords = records.filter(
    (r) => r.userId === userId && r.status === "absent",
  );
  const missingDays = userRecords.length;

  if (missingDays >= 5) {
    suspendUser(userId);
  } else if (missingDays > 1) {
    console.log(
      `[Notification] Strict warning for ${userId}: Multiple days absent.`,
    );
    // A realistic alert could be triggered if we had context, but we will mock a toast later.
  } else if (missingDays === 1) {
    console.log(
      `[Notification] Warning for ${userId}: Missed a class/test today.`,
    );
  }
}

export function isUserSuspended(userId: string): boolean {
  const suspended = getSuspendedUsers();
  return !!suspended.find((s) => s.userId === userId);
}
