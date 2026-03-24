import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAdminData } from "@/hooks/useAdminData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, BookOpen, Trash2 } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useEffect } from "react";
import { motion } from "framer-motion";

export function AllCoursesPage() {
  const { adminData } = useOutletContext<{ adminData: ReturnType<typeof useAdminData> }>();
  const { deleteCourse: _deleteCourse } = adminData;
  const [refreshKey, setRefreshKey] = useState(0);

  const { courses: allCourses, fetchCourses, loading } = useCourses();

  useEffect(() => {
    fetchCourses(1, 'all', true);
  }, [fetchCourses, refreshKey]);

  const deleteCourse = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this course? This action cannot be undone.")) {
      const success = await _deleteCourse(id);
      if (success) {
        setRefreshKey(prev => prev + 1);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 animate-in fade-in duration-500"
    >
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Courses Repository</h1>
          <p className="text-slate-500 font-medium">View and manage all courses published across the platform.</p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-1.5 font-semibold bg-blue-50 text-blue-700">
          {allCourses.length} Courses Total
        </Badge>
      </div>

      {loading && allCourses.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : allCourses.length === 0 ? (
        <Card className="border-dashed border-2 shadow-none bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
              <LayoutGrid className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-semibold text-lg">No courses found</p>
            <p className="text-slate-400 text-sm">Courses created by instructors will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-slate-200">
              <div className="aspect-video relative bg-slate-100 overflow-hidden">
                {course.image ? (
                  <img 
                    src={course.image.startsWith('http') ? course.image : `/s3/public/${course.image}`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <BookOpen className="h-10 w-10 text-slate-300" />
                  </div>
                )}
                <Badge 
                  className={`absolute top-3 right-3 font-semibold shadow-sm ${
                    course.is_active ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-500 hover:bg-slate-600'
                  }`}
                >
                  {course.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardHeader className="p-5 relative">
                <CardTitle className="text-lg line-clamp-2 pr-10 font-bold leading-tight text-slate-800">
                  {course.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-xs font-medium text-slate-600 bg-slate-50 border-slate-200">
                    {course.category || 'Uncategorized'}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-medium text-slate-600 bg-slate-50 border-slate-200">
                    {course.level || 'All Levels'}
                  </Badge>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-4 right-4 h-9 w-9 bg-white/50 backdrop-blur-sm text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-sm"
                  onClick={() => deleteCourse(course.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 pt-0 border-t border-slate-100 mt-2">
                <div className="flex items-center justify-between text-sm pt-3">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                     {course.duration || '0'} hrs
                  </span>
                  <span className="font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-md">
                    {course.price || 'Free'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
