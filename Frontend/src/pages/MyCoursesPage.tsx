import { useNavigate } from "react-router-dom";
import { Play, Loader2, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEnrollments } from "@/hooks/useCourses";

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const { enrollments, loading } = useEnrollments();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Courses Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            You haven't enrolled in any courses. Browse our catalog to start
            learning!
          </p>
          <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground mt-1">Pick up where you left off</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => (
          <Card
            key={enrollment.id}
            className="group cursor-pointer hover:border-primary transition-colors"
            onClick={() => navigate(`/course/${enrollment.course_id}/play`)}
          >
            <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted border-b">
              {enrollment.course?.thumbnail_url ? (
                <img
                  src={enrollment.course.thumbnail_url}
                  alt={enrollment.course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5">
                  <Play className="h-12 w-12 text-primary/40 group-hover:text-primary transition-colors duration-300" />
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                {enrollment.course?.title ||
                  `Course ${enrollment.course_id.substring(0, 8)}`}
              </CardTitle>
              <CardDescription>
                {enrollment.course?.instructor_name || "Instructor"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Overall Progress
                  </span>
                  <span className="font-semibold">
                    {enrollment.progress_percent || 0}%
                  </span>
                </div>
                <Progress
                  value={enrollment.progress_percent || 0}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
