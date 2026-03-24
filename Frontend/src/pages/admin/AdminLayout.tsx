import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";

export function AdminLayout() {
  const { user, loading: authLoading, userRole } = useAuth();
  const navigate = useNavigate();
  
  // Create context to provide down to child routes
  const adminData = useAdminData(userRole);

  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'admin')) {
      navigate("/");
    }
  }, [user, authLoading, userRole, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">
            Initializing Admin Framework...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="h-[100dvh] w-full overflow-hidden mesh-bg font-sans">
      <AdminSidebar />
      <SidebarInset className="flex flex-col h-[100dvh] w-full overflow-hidden bg-transparent">
        <AdminHeader />
        
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 custom-scrollbar bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-10">
            {/* The active route component will be injected here */}
            {/* We pass the adminData through context so children can access it without re-fetching */}
            <Outlet context={{ adminData }} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
