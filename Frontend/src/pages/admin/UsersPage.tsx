import { useOutletContext } from "react-router-dom";
import { useAdminData } from "@/hooks/useAdminData";
import { UserManagement } from "@/components/admin/UserManagement";
import { motion } from "framer-motion";

export function UsersPage() {
  const { adminData } = useOutletContext<{ adminData: ReturnType<typeof useAdminData> }>();
  const {
    profiles,
    loading: dataLoading,
    stats,
    updateUserStatus,
    updateUserRole,
    sendApprovalEmail,
  } = adminData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 animate-in fade-in duration-500"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage profiles, roles, and platform access for all registered
            users.
          </p>
        </div>
      </div>

      <UserManagement
        users={profiles}
        loading={dataLoading}
        roleCounts={stats.roleCounts}
        onUpdateStatus={updateUserStatus}
        onUpdateRole={updateUserRole}
        onSendEmail={sendApprovalEmail}
      />
    </motion.div>
  );
}
