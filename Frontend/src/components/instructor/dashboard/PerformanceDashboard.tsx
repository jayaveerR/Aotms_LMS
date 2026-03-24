import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  Search
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useInstructorCourses,
  useInstructorStats,
  useInstructorStudentStats
} from '@/hooks/useInstructorData';
import { PerformanceCharts } from './PerformanceCharts';
import { SmartAlerts } from './SmartAlerts';
import { Skeleton } from '@/components/ui/skeleton';

const PerformanceDashboard: React.FC = () => {
  const { data: courses = [], isLoading: coursesLoading } = useInstructorCourses();
  const { data: generalStats, isLoading: statsLoading } = useInstructorStats();
  const { stats: studentStats, isLoading: studentStatsLoading } = useInstructorStudentStats();
  const [timeRange, setTimeRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');

  const isLoading = coursesLoading || statsLoading || studentStatsLoading;

  // Mock trend data
  const trends = [
    { label: 'Revenue', value: '$12,450', trend: '+12.5%', isUp: true },
    { label: 'Enrollments', value: studentStats.totalEnrollments.toString(), trend: '+8.2%', isUp: true },
    { label: 'Avg. Progress', value: `${studentStats.avgProgress}%`, trend: '+2.4%', isUp: true },
    { label: 'Completed', value: studentStats.completedStudents.toString(), trend: '-1.5%', isUp: false },
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Performance Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your course performance and student engagement metrics.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3">
          <Button variant="outline" className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[160px] h-11 bg-white border-slate-200 rounded-xl font-semibold">
              <Calendar className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="font-medium cursor-pointer">Last 7 Days</SelectItem>
              <SelectItem value="30d" className="font-medium cursor-pointer">Last 30 Days</SelectItem>
              <SelectItem value="90d" className="font-medium cursor-pointer">Last 90 Days</SelectItem>
              <SelectItem value="all" className="font-medium cursor-pointer">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {trends.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
                <div className={`p-2 rounded-full ${item.isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {item.isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4 rotate-180" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : item.value}</div>
                <div className="flex items-center mt-1">
                  <span className={`text-xs font-semibold flex items-center ${item.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {item.isUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {item.trend}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-2">vs last month</span>
                </div>
              </CardContent>
              {/* Subtle accent line */}
              <div className={`absolute bottom-0 left-0 h-1 w-full opacity-50 ${item.isUp ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Detailed Analytics</CardTitle>
                  <CardDescription>Visualizing student behavior and trends</CardDescription>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <PerformanceCharts loading={isLoading} />
            </CardContent>
          </Card>

          {/* Course Performance Table */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-900">Course Specific Performance</CardTitle>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search courses by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 bg-slate-50/50 border-slate-200 rounded-xl w-full focus-visible:ring-primary/20 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-4 bg-slate-50/30">
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 border border-slate-100 text-[10px] text-slate-500 font-black tracking-widest uppercase mb-4 rounded-xl mx-4 lg:mx-0">
                <div className="col-span-5">Course Focus</div>
                <div className="col-span-2 text-center">Engagement</div>
                <div className="col-span-3 text-center">Avg. Progress</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              <div className="space-y-4 lg:space-y-3 px-4 lg:px-0 pb-4 h-[400px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                     <div key={i} className="flex flex-col md:grid md:grid-cols-12 items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                       <Skeleton className="h-10 w-full md:col-span-5" />
                       <Skeleton className="h-10 w-full md:col-span-2 hidden md:block" />
                       <Skeleton className="h-10 w-full md:col-span-3 hidden md:block" />
                       <Skeleton className="h-10 w-full md:col-span-2 hidden md:block" />
                     </div>
                  ))
                ) : filteredCourses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-slate-100">
                    <BookOpen className="h-12 w-12 text-slate-200 mb-3" />
                    <p className="text-sm font-bold text-slate-600">No courses match your search</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">Try adjusting your filter</p>
                  </div>
                ) : (
                  filteredCourses.map((course) => (
                    <motion.div 
                      key={course.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-4 md:gap-4 p-4 md:p-5 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-md transition-all duration-300"
                    >
                      {/* Mobile Header / Desktop Col 1 */}
                      <div className="flex items-center gap-4 w-full md:col-span-5 min-w-0">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm md:text-base truncate">{course.title}</p>
                          <p className="text-xs text-slate-500 font-medium truncate md:hidden mt-0.5">Active enrollments and progress tracking</p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 w-full md:col-span-5 md:grid md:grid-cols-5 md:gap-0 bg-slate-50 md:bg-transparent rounded-xl p-3 md:p-0 border border-slate-100 md:border-none">
                        <div className="flex flex-col items-center justify-center md:col-span-2">
                           <span className="font-black text-slate-800 text-lg md:text-sm">124</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:hidden">Students</span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center md:col-span-3 border-l border-slate-200 md:border-none">
                           <div className="flex flex-col items-center w-full px-2 lg:px-6">
                              <span className="font-black text-primary text-lg md:text-sm md:hidden">65%</span>
                              <div className="flex items-center justify-between w-full hidden md:flex mb-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Progress</span>
                                <span className="font-black text-primary text-xs">65%</span>
                              </div>
                              <Progress value={65} className="h-2 flex-1 w-full bg-slate-200 hidden md:block" indicatorClassName="bg-primary" />
                           </div>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:hidden mt-1">Avg Progress</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="w-full flex items-center justify-between md:justify-end md:col-span-2 px-2 md:px-0 pt-2 md:pt-0 border-t border-slate-100 md:border-none">
                         <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest md:hidden">Environment</span>
                         <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="capitalize text-[10px] font-black tracking-widest px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none">
                           {course.status || 'Active'}
                         </Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Components Area */}
        <div className="space-y-6">
          <SmartAlerts />

          <Card className="border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                < Award className="h-5 w-5 text-amber-500" />
                Teaching Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-4 text-center">
                <div className="h-20 w-20 rounded-full border-4 border-primary/20 flex items-center justify-center mb-4 bg-background shadow-inner">
                  <span className="text-2xl font-bold text-primary italic">A+</span>
                </div>
                <p className="font-bold text-lg">Top 5% Instructor</p>
                <p className="text-sm text-muted-foreground px-4 mt-1">
                  Based on student satisfaction and completion rates this month.
                </p>
                <Button variant="ghost" className="mt-4 h-8 text-xs gap-2">
                  View Badges <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" /> Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Grade Project 1', date: 'Tomorrow, 5 PM', color: 'bg-red-500' },
                { title: 'New Course Launch', date: 'Oct 15, 2024', color: 'bg-blue-500' },
                { title: 'Live Q&A Session', date: 'Oct 18, 2024', color: 'bg-amber-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start group">
                  <div className={`mt-1.5 h-2 w-2 rounded-full cursor-help ${item.color} group-hover:ring-4 ring-${item.color.split('-')[1]}-500/20 transition-all`} />
                  <div>
                    <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors cursor-pointer">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;