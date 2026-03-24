import { useOutletContext } from "react-router-dom";
import { useAdminData } from "@/hooks/useAdminData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Users, BookOpen, GraduationCap, ShieldAlert, Activity, RefreshCw, Shield 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Mock data for analytics illustrations (can be replaced with API data later)
const userGrowthData = [
  { month: "Jan", students: 400, instructors: 20 },
  { month: "Feb", students: 600, instructors: 28 },
  { month: "Mar", students: 850, instructors: 35 },
  { month: "Apr", students: 1200, instructors: 48 },
  { month: "May", students: 1600, instructors: 65 },
  { month: "Jun", students: 2100, instructors: 80 },
];

const engagementData = [
  { category: "Web Dev", active: 1200, completed: 800 },
  { category: "Data Sci", active: 900, completed: 500 },
  { category: "Design", active: 650, completed: 300 },
  { category: "Marketing", active: 400, completed: 250 },
  { category: "Business", active: 850, completed: 600 },
];

export function OverviewPage() {
  const { adminData } = useOutletContext<{ adminData: ReturnType<typeof useAdminData> }>();
  const { stats, loading: dataLoading, refresh } = adminData;

  const statItems = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
      trend: "+12.5%",
      description: "Registered accounts",
    },
    {
      label: "Active Courses",
      value: stats.activeCourses,
      icon: BookOpen,
      color: "orange",
      trend: "Steady",
      description: "Verified curriculum",
    },
    {
      label: "Pending Enrollments",
      value: stats.pendingEnrollments,
      icon: GraduationCap,
      color: "red",
      trend: stats.pendingEnrollments > 0 ? "Action needed" : "Clear",
      description: "Approval queue",
    },
    {
      label: "Security Events",
      value: stats.securityEvents,
      icon: ShieldAlert,
      color: "blue",
      trend: "-5%",
      description: "Requiring attention",
    },
    {
      label: "System Health",
      value: "99.9%",
      icon: Activity,
      color: "blue",
      trend: "Optimal",
      description: "Across all nodes",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Platform Administration
          </h1>
          <p className="text-slate-500 font-medium">
            Overview of system performance, user activities, and security protocols.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={refresh}
            disabled={dataLoading}
            className="h-10 px-4 gap-2 rounded-lg border-slate-200 text-slate-600 font-semibold shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${dataLoading ? "animate-spin" : ""}`} />
            Sync Data
          </Button>
          <Button className="pro-button-primary h-10 px-6 gap-2 rounded-lg shadow-md bg-blue-600 text-white hover:bg-blue-700">
            <Shield className="h-4 w-4" />
            Security Protocol
          </Button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {statItems.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
            className="p-6 bg-white relative overflow-hidden group hover:border-blue-500 border border-slate-200 rounded-xl cursor-default shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div
                className={`p-2.5 rounded-lg ${
                  stat.color === "red" ? "bg-red-50" : stat.color === "blue" ? "bg-blue-50" : "bg-orange-50"
                }`}
              >
                <stat.icon
                  className={`h-5 w-5 ${
                    stat.color === "red" ? "text-red-500" : stat.color === "blue" ? "text-blue-600" : "text-orange-500"
                  }`}
                />
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trend === "Action needed" 
                    ? "bg-red-50 text-red-600" 
                    : stat.trend.startsWith("+") || stat.trend === "Optimal"
                      ? "bg-emerald-50 text-emerald-600" 
                      : "bg-slate-50 text-slate-600"
                }`}
              >
                {stat.trend}
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {dataLoading ? "..." : stat.value}
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-medium">{stat.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        
        {/* User Growth Area Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}>
          <Card className="border-slate-200 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800">Platform User Growth</CardTitle>
              <CardDescription className="text-slate-500">6-month registration trend for students and instructors</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInstructors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="students" name="Students" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                  <Area type="monotone" dataKey="instructors" name="Instructors" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorInstructors)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Engagement Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}>
          <Card className="border-slate-200 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800">Course Engagement by Category</CardTitle>
              <CardDescription className="text-slate-500">Active enrollments vs completed courses</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  <Bar dataKey="active" name="Active Enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
