import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const weeklyActivity = [
    { day: "Mon", active: 42, newEnroll: 5 },
    { day: "Tue", active: 58, newEnroll: 8 },
    { day: "Wed", active: 75, newEnroll: 12 },
    { day: "Thu", active: 63, newEnroll: 7 },
    { day: "Fri", active: 89, newEnroll: 15 },
    { day: "Sat", active: 45, newEnroll: 3 },
    { day: "Sun", active: 32, newEnroll: 2 },
];

const engagementData = [
    { name: "Completed", value: 45, color: "#10b981" },
    { name: "In Progress", value: 30, color: "#3b82f6" },
    { name: "Not Started", value: 25, color: "#e2e8f0" },
];

const coursePerformance = [
    { name: "Course 1", completion: 82, satisfaction: 88 },
    { name: "Course 2", completion: 65, satisfaction: 74 },
    { name: "Course 3", completion: 91, satisfaction: 95 },
    { name: "Course 4", completion: 48, satisfaction: 62 },
    { name: "Course 5", completion: 73, satisfaction: 79 },
];

const HEATMAP_HOURS = ["9am", "12pm", "3pm", "6pm", "9pm"];
const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heatmapData = HEATMAP_DAYS.map((day) => ({
    day,
    values: HEATMAP_HOURS.map(() => Math.floor(Math.random() * 100)),
}));

function HeatCell({ value }: { value: number }) {
    const opacity = value / 100;
    const style = {
        backgroundColor: `rgba(59, 130, 246, ${0.1 + opacity * 0.9})`,
    };
    return (
        <div
            style={style}
            className="w-full h-8 rounded-sm flex items-center justify-center text-xs font-medium text-blue-900 dark:text-blue-100 hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
            title={`${value}% engagement`}
        >
            {value > 40 ? value : ""}
        </div>
    );
}

interface PerformanceChartsProps {
    loading?: boolean;
}

export function PerformanceCharts({ loading }: PerformanceChartsProps) {
    if (loading) {
        return (
            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-border/50">
                        <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
                        <CardContent><Skeleton className="h-48 w-full" /></CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <Tabs defaultValue="activity" className="w-full">
            <div className="w-full overflow-x-auto hide-scrollbar pb-1 mb-4 md:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                <TabsList className="bg-slate-100/50 p-1 flex md:inline-flex rounded-xl min-w-max h-auto">
                    <TabsTrigger value="activity" className="rounded-lg font-bold min-w-[120px] md:min-w-[140px] h-10 data-[state=active]:shadow-sm">Activity</TabsTrigger>
                    <TabsTrigger value="performance" className="rounded-lg font-bold min-w-[120px] md:min-w-[140px] h-10 data-[state=active]:shadow-sm">Performance</TabsTrigger>
                    <TabsTrigger value="engagement" className="rounded-lg font-bold min-w-[120px] md:min-w-[140px] h-10 data-[state=active]:shadow-sm">Engagement</TabsTrigger>
                    <TabsTrigger value="heatmap" className="rounded-lg font-bold min-w-[120px] md:min-w-[140px] h-10 data-[state=active]:shadow-sm">Heatmap</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="activity">
                <Card className="border-border/50 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-4 border-b border-slate-100">
                        <CardTitle className="text-base font-bold text-slate-900">Weekly Student Activity</CardTitle>
                        <p className="text-xs font-medium text-slate-500">Active students and new enrollments per day</p>
                    </CardHeader>
                    <CardContent className="overflow-visible px-0 sm:px-6 pt-6 pb-2 sm:pb-6">
                        <div className="h-[280px] sm:h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyActivity} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
                                    <defs>
                                        <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} iconType="circle" />
                                    <Area type="monotone" dataKey="active" name="Active Students" stroke="#3b82f6" fill="url(#activeGrad)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="newEnroll" name="New Enrollments" stroke="#10b981" fill="url(#enrollGrad)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="performance">
                <Card className="border-border/50 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-4 border-b border-slate-100">
                        <CardTitle className="text-base font-bold text-slate-900">Course-Wise Performance</CardTitle>
                        <p className="text-xs font-medium text-slate-500">Completion rate vs student satisfaction</p>
                    </CardHeader>
                    <CardContent className="overflow-visible px-0 sm:px-6 pt-6 pb-4 sm:pb-6">
                        <div className="h-[280px] sm:h-[320px] w-full pr-4 sm:pr-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={coursePerformance} barGap={4} barCategoryGap="20%" margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} interval={0} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} unit="%" domain={[0, 100]} axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip 
                                        formatter={(v: number) => `${v}%`} 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} iconType="circle" />
                                    <Bar dataKey="completion" name="Completion" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={24} />
                                    <Bar dataKey="satisfaction" name="Satisfaction" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="engagement">
                <Card className="border-border/50 shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-4 border-b border-slate-100">
                        <CardTitle className="text-base font-bold text-slate-900">Overall Engagement</CardTitle>
                        <p className="text-xs font-medium text-slate-500">Pass vs Fail & completion distribution</p>
                    </CardHeader>
                    <CardContent className="overflow-hidden flex flex-col items-center justify-center p-6">
                        <div className="h-[240px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={engagementData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={6}
                                        dataKey="value"
                                        nameKey="name"
                                        stroke="none"
                                        cornerRadius={4}
                                    >
                                        {engagementData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(v: number) => `${v}%`} 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                            {engagementData.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                                    <span className="text-xs font-black text-slate-900">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="heatmap">
                <Card className="border-border/50 shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-4 border-b border-slate-100">
                        <CardTitle className="text-base font-bold text-slate-900">Student Engagement Timeline</CardTitle>
                        <p className="text-xs font-medium text-slate-500">When are students most active throughout the week?</p>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pb-6 overflow-x-auto hide-scrollbar">
                        <div className="min-w-[400px]">
                            <div className="flex gap-2 mb-3">
                                <div className="w-10" /> {/* spacer */}
                                {HEATMAP_HOURS.map((h) => (
                                    <div key={h} className="flex-1 text-center text-[10px] sm:text-xs font-bold text-slate-400">{h}</div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                {heatmapData.map((row) => (
                                    <div key={row.day} className="flex gap-2 items-center">
                                        <div className="w-10 text-[10px] sm:text-xs font-bold text-slate-500 text-right pr-2 uppercase tracking-widest">{row.day}</div>
                                        {row.values.map((val, i) => (
                                            <div key={i} className="flex-1">
                                                <HeatCell value={val} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mt-6 justify-end mr-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Low</span>
                                <div className="flex gap-1">
                                    {[10, 30, 50, 70, 90].map((v) => (
                                        <div key={v} className="w-6 sm:w-8 h-2 sm:h-3 rounded-md" style={{ backgroundColor: `rgba(59,130,246,${0.1 + v / 100 * 0.9})` }} />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">High</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
