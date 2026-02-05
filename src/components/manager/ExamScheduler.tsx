import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExams, useCreateExam, useUpdateExam, useDeleteExam } from '@/hooks/useManagerData';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Calendar, Clock, Timer, Users, Trash2, Settings, Play, Eye } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { format, isToday, isFuture } from 'date-fns';

export function ExamScheduler() {
  const { user } = useAuth();
  const { data: exams = [], isLoading } = useExams();
  const createExam = useCreateExam();
  const updateExam = useUpdateExam();
  const deleteExam = useDeleteExam();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    exam_type: 'live',
    scheduled_date: '',
    duration_minutes: 60,
    total_marks: 100,
    passing_marks: 40,
    negative_marking: 0,
    shuffle_questions: true,
    proctoring_enabled: false,
  });

  const handleCreate = async () => {
    if (!newExam.title.trim() || !newExam.scheduled_date || !user?.id) return;
    await createExam.mutateAsync({
      ...newExam,
      course_id: null,
      max_attempts: 1,
      show_results: true,
      status: 'scheduled',
      created_by: user.id,
      scheduled_date: new Date(newExam.scheduled_date).toISOString(),
    });
    setNewExam({
      title: '',
      description: '',
      exam_type: 'live',
      scheduled_date: '',
      duration_minutes: 60,
      total_marks: 100,
      passing_marks: 40,
      negative_marking: 0,
      shuffle_questions: true,
      proctoring_enabled: false,
    });
    setIsAddOpen(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateExam.mutateAsync({ id, status });
  };

  const todayExams = exams.filter(e => isToday(new Date(e.scheduled_date)));
  const upcomingExams = exams.filter(e => isFuture(new Date(e.scheduled_date)) && !isToday(new Date(e.scheduled_date)));

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading exams...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Exam Scheduling</h3>
          <p className="text-sm text-muted-foreground">Schedule and manage live exams</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule New Exam</DialogTitle>
              <DialogDescription>Create a new exam for students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Exam title"
                  value={newExam.title}
                  onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Exam description (optional)"
                  value={newExam.description}
                  onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Exam Type</Label>
                  <Select
                    value={newExam.exam_type}
                    onValueChange={(value) => setNewExam({ ...newExam, exam_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live Exam</SelectItem>
                      <SelectItem value="mock">Mock Test</SelectItem>
                      <SelectItem value="practice">Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    min={10}
                    value={newExam.duration_minutes}
                    onChange={(e) => setNewExam({ ...newExam, duration_minutes: parseInt(e.target.value) || 60 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={newExam.scheduled_date}
                  onChange={(e) => setNewExam({ ...newExam, scheduled_date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Marks</Label>
                  <Input
                    type="number"
                    min={1}
                    value={newExam.total_marks}
                    onChange={(e) => setNewExam({ ...newExam, total_marks: parseInt(e.target.value) || 100 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Passing Marks</Label>
                  <Input
                    type="number"
                    min={0}
                    value={newExam.passing_marks}
                    onChange={(e) => setNewExam({ ...newExam, passing_marks: parseInt(e.target.value) || 40 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Negative Marking (per wrong answer)</Label>
                <Input
                  type="number"
                  step={0.25}
                  min={0}
                  value={newExam.negative_marking}
                  onChange={(e) => setNewExam({ ...newExam, negative_marking: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Shuffle Questions</Label>
                <Switch
                  checked={newExam.shuffle_questions}
                  onCheckedChange={(checked) => setNewExam({ ...newExam, shuffle_questions: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Proctoring</Label>
                <Switch
                  checked={newExam.proctoring_enabled}
                  onCheckedChange={(checked) => setNewExam({ ...newExam, proctoring_enabled: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createExam.isPending}>
                {createExam.isPending ? 'Scheduling...' : 'Schedule Exam'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Exams
          </CardTitle>
          <CardDescription>{todayExams.length} exams scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          {todayExams.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No exams scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {todayExams.map((exam) => (
                <div key={exam.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{exam.title}</h4>
                      <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>
                        {exam.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(exam.scheduled_date), 'h:mm a')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {exam.duration_minutes} min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {exam.status === 'scheduled' && (
                      <Button size="sm" onClick={() => handleStatusChange(exam.id, 'active')}>
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {exam.status === 'active' && (
                      <Button size="sm" variant="destructive" onClick={() => handleStatusChange(exam.id, 'completed')}>
                        End
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => deleteExam.mutate(exam.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Exams */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription>{upcomingExams.length} exams scheduled</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingExams.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No upcoming exams scheduled</p>
          ) : (
            <div className="space-y-3">
              {upcomingExams.slice(0, 5).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <h4 className="font-medium">{exam.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(exam.scheduled_date), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  <Badge variant="outline">{exam.exam_type}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
