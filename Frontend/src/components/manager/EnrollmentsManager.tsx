import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Search, 
  BookOpen, 
  Calendar, 
  CreditCard,
  Globe,
  RefreshCw,
  Filter
} from "lucide-react";
import { CourseEnrollment } from "@/hooks/useCourses";

interface ManagerEnrollmentsProps {
  enrollments: CourseEnrollment[];
  loading: boolean;
  onRefresh: () => void;
}

export function ManagerEnrollments({ enrollments, loading, onRefresh }: ManagerEnrollmentsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");

  const courses = [...new Set(enrollments.map(e => e.course_name))];

  const filteredEnrollments = enrollments.filter(e => {
    const matchesSearch = 
      e.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === "all" || e.course_name === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold truncate">{enrollments.length}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold truncate hover:text-clip">Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold truncate">{courses.length}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold truncate">Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 bg-green-100 rounded-lg shrink-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold truncate">
                  {new Set(enrollments.map(e => e.user_id)).size}
                </p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold truncate">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-bold truncate">
                  ₹{enrollments.reduce((acc, e) => acc + parseInt(e.price?.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString('en-IN')}
                </p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-semibold truncate">Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 w-full"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 sm:flex-none sm:min-w-[180px]">
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-full h-10 bg-background hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2 truncate">
                  <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="All Courses" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon" onClick={onRefresh} className="shrink-0 h-10 w-10">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Enrollments List */}
      {filteredEnrollments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium text-slate-600">No enrollments found</p>
            {searchQuery && <p className="text-sm mt-1">Try a different search query</p>}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredEnrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-md transition-shadow group overflow-hidden">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
                      <span className="text-base sm:text-lg font-bold text-primary">
                        {enrollment.user_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                        {enrollment.user_name || 'Unknown Student'}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                        <Globe className="h-3 w-3 shrink-0" />
                        <span className="truncate">{enrollment.user_email}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-row items-center justify-between md:justify-end gap-3 sm:gap-8 pt-3 sm:pt-4 md:pt-0 border-t border-slate-100 md:border-t-0 w-full md:w-auto">
                    <div className="text-left md:text-right min-w-0 flex-1 md:flex-none">
                      <Badge variant="secondary" className="mb-1.5 truncate max-w-[140px] sm:max-w-[200px]">
                        {enrollment.course_name}
                      </Badge>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 md:justify-end">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {formatDate(enrollment.enrollment_date)}
                      </p>
                    </div>
                    <div className="hidden sm:block h-10 w-px bg-slate-100" />
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400 font-black tracking-widest uppercase mb-0.5">Paid</p>
                      <p className="text-base sm:text-lg font-black text-green-600">
                        {enrollment.price}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
