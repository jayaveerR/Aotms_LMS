import { useState, useEffect } from "react";
import {
  getAllAttendance,
  getSuspendedUsers,
  markAbsent,
  checkAbsencesAndSuspend,
  reactivateUser,
  suspendUser,
} from "@/lib/attendanceService";
import { UserRole } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  CalendarDays,
  UserX,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

export function ManagerAttendance() {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [suspended, setSuspended] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const loadData = () => {
    setAttendances(getAllAttendance());
    setSuspended(getSuspendedUsers());
  };

  useEffect(() => {
    loadData();
    // Refresh interval for live monitoring demo
    const iv = setInterval(loadData, 5000);
    return () => clearInterval(iv);
  }, []);

  const handleMarkAbsent = (
    userId: string,
    date: string = new Date().toISOString().split("T")[0],
  ) => {
    markAbsent(userId, "student", date);
    toast({ title: `Student ${userId} marked absent for ${date}` });
    loadData();
  };

  const handleSuspend = (userId: string) => {
    suspendUser(userId);
    toast({
      title: "Student Suspended",
      description: `Account suspended successfully.`,
    });
    loadData();
  };

  const handleReactivate = (userId: string) => {
    reactivateUser(userId);
    toast({
      title: "Account Reactivated",
      description: `Student ${userId} has been restored.`,
    });
    loadData();
  };

  // Group by users for summary
  const userSummaries = attendances.reduce(
    (acc, curr) => {
      if (!acc[curr.userId]) {
        acc[curr.userId] = {
          userId: curr.userId,
          role: curr.role,
          present: 0,
          absent: 0,
          lastSeen: null,
        };
      }
      if (curr.status === "present") acc[curr.userId].present++;
      if (curr.status === "absent") acc[curr.userId].absent++;
      // simple lastSeen Logic
      if (
        curr.status === "present" &&
        (!acc[curr.userId].lastSeen ||
          new Date(curr.timestamp) > new Date(acc[curr.userId].lastSeen))
      ) {
        acc[curr.userId].lastSeen = curr.timestamp;
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const userList = Object.values(userSummaries).filter((u: any) =>
    u.userId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 border-b-4 border-[#000000] pb-4">
        <div>
          <h1 className="text-3xl font-black text-[#000000] uppercase tracking-tighter">
            Attendance Register
          </h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
            Live monitoring and actions
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border-2 border-[#000000] text-sm font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#FD5A1A]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <div className="bg-white border-4 border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <h2 className="text-xl font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#FD5A1A]" /> User Summary
          </h2>
          <div className="space-y-4">
            {userList.length === 0 && (
              <p className="text-sm font-bold text-gray-500 uppercase">
                No users found.
              </p>
            )}
            {userList.map((user: any) => {
              const isSuspended = suspended.some(
                (s) => s.userId === user.userId,
              );
              return (
                <div
                  key={user.userId}
                  className={`flex items-center justify-between p-4 border-2 border-[#000000] ${isSuspended ? "bg-red-50" : "bg-gray-50"}`}
                >
                  <div>
                    <h3 className="font-bold text-[#000000]">
                      {user.userId}{" "}
                      <span className="text-xs text-gray-400 uppercase tracking-widest">
                        ({user.role})
                      </span>
                    </h3>
                    <p className="text-xs font-semibold text-gray-600 mt-1">
                      Present:{" "}
                      <span className="text-green-600">{user.present}</span> |
                      Absent:{" "}
                      <span className="text-red-600 font-bold">
                        {user.absent}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Last seen:{" "}
                      {user.lastSeen
                        ? new Date(user.lastSeen).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isSuspended &&
                      user.role !== "manager" &&
                      user.role !== "admin" && (
                        <>
                          <button
                            onClick={() => handleMarkAbsent(user.userId)}
                            className="px-3 py-1 bg-white border-2 border-[#000000] text-xs font-bold uppercase hover:bg-red-100 transition-colors"
                          >
                            Mark Absent Today
                          </button>
                          {user.absent >= 5 && (
                            <button
                              onClick={() => handleSuspend(user.userId)}
                              className="p-1 bg-red-500 text-white border-2 border-[#000000] hover:bg-red-600 transition-colors"
                              title="Suspend User (>= 5 Absences)"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                    {isSuspended && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 border-2 border-red-500 font-bold text-xs uppercase flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" /> Suspended
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suspended Users Section */}
        <div className="bg-white border-4 border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <h2 className="text-xl font-black uppercase tracking-widest text-[#000000] mb-4 flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-500" /> Suspended Accounts
          </h2>
          {suspended.length === 0 ? (
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Zero Suspensions
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {suspended.map((s) => (
                <div
                  key={s.userId}
                  className="flex items-center justify-between bg-red-50 p-4 border-2 border-[#000000]"
                >
                  <div>
                    <h4 className="font-bold text-[#000000]">{s.userId}</h4>
                    <p className="text-xs text-red-600 font-semibold mt-1">
                      Suspended: {new Date(s.suspendedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Only Admin/Manager can reactivate.
                    </p>
                  </div>
                  <button
                    onClick={() => handleReactivate(s.userId)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] text-white font-bold uppercase text-xs border-2 border-[#000000] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <UserCheck className="h-4 w-4" /> Reactivate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
