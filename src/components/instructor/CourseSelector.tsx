import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInstructorCourses, Course } from '@/hooks/useInstructorData';
import { BookOpen } from 'lucide-react';

interface CourseSelectorProps {
  selectedCourse: Course | null;
  onSelectCourse: (course: Course | null) => void;
}

export function CourseSelector({ selectedCourse, onSelectCourse }: CourseSelectorProps) {
  const { data: courses = [], isLoading } = useInstructorCourses();

  return (
    <div className="flex items-center gap-3">
      <BookOpen className="h-5 w-5 text-primary" />
      <Select
        value={selectedCourse?.id || ''}
        onValueChange={(value) => {
          const course = courses.find((c) => c.id === value) || null;
          onSelectCourse(course);
        }}
        disabled={isLoading || courses.length === 0}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder={isLoading ? "Loading courses..." : "Select a course"} />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              <div className="flex items-center gap-2">
                <span>{course.title}</span>
                <span className="text-xs text-muted-foreground">({course.status})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
