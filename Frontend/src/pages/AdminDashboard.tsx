import { Routes, Route, useOutletContext } from "react-router-dom";
import { useAdminData } from "@/hooks/useAdminData";
import { AdminLayout } from "./admin/AdminLayout";
import { OverviewPage } from "./admin/OverviewPage";
import { UsersPage } from "./admin/UsersPage";
import { AllCoursesPage } from "./admin/AllCoursesPage";

// Original components imported
import InstructorCoursesAdmin from "@/pages/InstructorCourses";
import { QuestionBankApproval } from "@/components/admin/QuestionBankApproval";
import { SecurityMonitor } from "@/components/admin/SecurityMonitor";

// Inline Wrappers for features not yet fully migrated to their own page files
function SecurityPageWrapper() {
  const { adminData } = useOutletContext<{ adminData: ReturnType<typeof useAdminData> }>();
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security Center</h1>
          <p className="text-slate-500 font-medium">Monitor and resolve platform security events.</p>
        </div>
      </div>
      <SecurityMonitor
        securityEvents={adminData.securityEvents}
        systemLogs={adminData.systemLogs}
        loading={adminData.loading}
        highPriorityCount={adminData.stats.highPriorityEvents}
        onResolveEvent={adminData.resolveSecurityEvent}
      />
    </div>
  );
}

function QuestionBankPageWrapper() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Question Bank Approval</h1>
          <p className="text-slate-500 font-medium">Review and publish questions from instructors.</p>
        </div>
      </div>
      <QuestionBankApproval />
    </div>
  );
}

function InstructorCoursesWrapper() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Instructor Courses</h1>
          <p className="text-slate-500 font-medium">Manage pending course approvals.</p>
        </div>
      </div>
      {/* InstructorCoursesAdmin is already a full page, we just render it here */}
      <InstructorCoursesAdmin />
    </div>
  );
}

function SettingsPageWrapper() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Configurations</h1>
          <p className="text-slate-500 font-medium">Global settings and integrations.</p>
        </div>
      </div>
      <div className="p-8 bg-white rounded-xl border border-slate-200 flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 font-semibold text-lg">Settings Module - Coming Soon</p>
      </div>
    </div>
  );
}

export default function AdminDashboardRouter() {
  return (
    <Routes>
      {/* AdminLayout provides the Sidebar, Header, and Outlet context */}
      <Route path="/" element={<AdminLayout />}>
        {/* The index route ("") renders the Overview */}
        <Route index element={<OverviewPage />} />
        
        {/* Child routes */}
        <Route path="users" element={<UsersPage />} />
        <Route path="all-courses" element={<AllCoursesPage />} />
        
        {/* Legacy/Wrapped Components */}
        <Route path="security" element={<SecurityPageWrapper />} />
        <Route path="questions" element={<QuestionBankPageWrapper />} />
        <Route path="instructor-courses" element={<InstructorCoursesWrapper />} />
        <Route path="settings" element={<SettingsPageWrapper />} />
      </Route>
    </Routes>
  );
}
