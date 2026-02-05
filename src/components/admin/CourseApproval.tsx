import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 
  Eye, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import type { Course } from '@/hooks/useAdminData';

interface CourseApprovalProps {
  courses: Course[];
  loading: boolean;
  onApprove: (courseId: string) => Promise<boolean>;
  onReject: (courseId: string, reason: string) => Promise<boolean>;
}

export function CourseApproval({ 
  courses, 
  loading,
  onApprove, 
  onReject 
}: CourseApprovalProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const pendingCourses = courses.filter((c) => c.status === 'pending');
  const approvedCourses = courses.filter((c) => c.status === 'approved');
  const rejectedCourses = courses.filter((c) => c.status === 'rejected');
  const disabledCourses = courses.filter((c) => c.status === 'disabled');

  const handleApprove = async (course: Course) => {
    setProcessing(true);
    await onApprove(course.id);
    setProcessing(false);
  };

  const handleReject = async () => {
    if (selectedCourse && rejectReason) {
      setProcessing(true);
      await onReject(selectedCourse.id, rejectReason);
      setProcessing(false);
      setShowRejectDialog(false);
      setSelectedCourse(null);
      setRejectReason('');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Course Approvals
              </CardTitle>
              <CardDescription>Review and approve submitted courses</CardDescription>
            </div>
            <Badge variant="secondary">{pendingCourses.length} pending</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mb-4 text-green-500" />
              <p>No pending courses to review</p>
            </div>
          ) : (
            pendingCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{course.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    by {course.instructor_name || 'Unknown'} • <Clock className="h-3 w-3 inline" /> {formatDate(course.submitted_at)}
                  </p>
                  {course.category && (
                    <Badge variant="outline" className="mt-1">{course.category}</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" title="Preview">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Approve" 
                    className="text-green-600"
                    disabled={processing}
                    onClick={() => handleApprove(course)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Reject" 
                    className="text-destructive"
                    disabled={processing}
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowRejectDialog(true);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      
      {/* Course Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Course Statistics</CardTitle>
          <CardDescription>Platform-wide course data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Total Courses</span>
              <span className="font-bold">{courses.length}</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
          <div className="p-4 rounded-lg bg-green-500/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-green-600">Published</span>
              <span className="font-bold">{approvedCourses.length}</span>
            </div>
            <Progress 
              value={courses.length > 0 ? (approvedCourses.length / courses.length) * 100 : 0} 
              className="h-2" 
            />
          </div>
          <div className="p-4 rounded-lg bg-accent/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-accent">Pending</span>
              <span className="font-bold">{pendingCourses.length}</span>
            </div>
            <Progress 
              value={courses.length > 0 ? (pendingCourses.length / courses.length) * 100 : 0} 
              className="h-2" 
            />
          </div>
          <div className="p-4 rounded-lg bg-destructive/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-destructive">Rejected</span>
              <span className="font-bold">{rejectedCourses.length}</span>
            </div>
            <Progress 
              value={courses.length > 0 ? (rejectedCourses.length / courses.length) * 100 : 0} 
              className="h-2" 
            />
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Disabled</span>
              <span className="font-bold">{disabledCourses.length}</span>
            </div>
            <Progress 
              value={courses.length > 0 ? (disabledCourses.length / courses.length) * 100 : 0} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Course</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedCourse?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectReason || processing}
            >
              Reject Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
