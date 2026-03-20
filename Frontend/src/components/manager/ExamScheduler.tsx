import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useExams, useCreateExam, useUpdateExam, useDeleteExam, type Exam } from '@/hooks/useManagerData';
import { useAuth } from '@/hooks/useAuth';
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  Play,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { format, isToday, isFuture } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── 1. Validation Schema ────────────────────────────────────────────────────

const examSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  exam_type: z.string().min(1, 'Please select or enter an exam type'),

  assigned_image: z.string().optional(),
  scheduled_date: z.string().refine((val) => new Date(val) > new Date(), {
    message: 'Scheduled date must be in the future',
  }),
  duration_minutes: z.coerce.number().min(5, 'Duration must be at least 5 minutes'),
  total_marks: z.coerce.number().min(1, 'Total marks must be at least 1'),
  passing_percentage: z.coerce.number().min(0).max(100).default(40),
  max_attempts: z.coerce.number().min(1).default(1),
  show_results: z.boolean().default(true),
  browser_security: z.boolean().default(false),
  shuffle_questions: z.boolean().default(true),
  proctoring_enabled: z.boolean().default(false),
}).refine((data) => data.total_marks > 0, {
  message: 'Total marks must be positive',
  path: ['total_marks'],
});


type ExamFormValues = z.infer<typeof examSchema>;

// ─── 2. Image Upload Component ──────────────────────────────────────────────

function ExamCard({ 
  exam, 
  onUpdate, 
  onDelete, 
  isPast 
}: { 
  exam: Exam; 
  onUpdate: (params: { id: string; status: string }) => void;
  onDelete: (id: string) => void;
  isPast?: boolean;
}) {
  return (
    <Card className={cn(
      "group rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden flex flex-col",
      isPast && "opacity-75 grayscale-[0.2]"
    )}>
      <div className="h-32 relative bg-slate-900 overflow-hidden">
        {exam.assigned_image ? (
          <img src={exam.assigned_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={exam.title} />
        ) : (
          <div className="w-full h-full flex items-center justify-center mesh-bg">
            <ImageIcon className="h-8 w-8 text-white/20" />
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none text-[10px] font-black uppercase tracking-widest h-6 rounded-full px-3">
             {exam.exam_type}
          </Badge>
          <Badge className={cn(
             "border-none text-[10px] font-black uppercase tracking-widest h-6 rounded-full px-3",
             exam.status === 'active' ? "bg-emerald-500 text-white animate-pulse" : 
             isPast ? "bg-slate-500 text-white" : "bg-blue-500 text-white"
          )}>
            {exam.status}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-1">
          <h4 className="font-black text-lg text-slate-900 leading-tight group-hover:text-primary transition-colors">{exam.title}</h4>
          <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {exam.duration_minutes}m</span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" /> 
              {exam.scheduled_date ? (
                (() => {
                  try {
                    return format(new Date(exam.scheduled_date), 'MMM dd');
                  } catch {
                    return 'Invalid Date';
                  }
                })()
              ) : 'No Date'}
            </span>
          </div>

        </div>

        <div className="flex items-center gap-3 pt-2">
           {!isPast && (
             <Button
               className={cn(
                 "flex-1 h-11 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg",
                 exam.status === 'active' ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200" : "pro-button-primary shadow-blue-100"
               )}
               onClick={() => onUpdate({ id: exam.id, status: exam.status === 'active' ? 'completed' : 'active' })}
             >
               {exam.status === 'active' ? 'Stop Session' : 'Start Now'}
             </Button>
           )}
           <Button 
             variant="outline" 
             size="icon" 
             className="h-11 w-11 rounded-2xl border-slate-100 text-slate-400 hover:text-destructive hover:bg-rose-50 transition-colors" 
             onClick={() => onDelete(exam.id)}
           >
             <Trash2 className="h-4 w-4" />
           </Button>
        </div>
      </div>
    </Card>
  );
}

function FileUploadZone({ value, onChange }: { value?: string; onChange: (val: string) => void }) {

  const [dragActive, setDragActive] = useState(false);
  const [tab, setTab] = useState<'upload' | 'url'>('upload');

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) onChange(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  if (value) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-border group h-40">
        <img src={value} alt="Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="destructive" size="sm" onClick={() => onChange('')} className="rounded-lg">
            <Trash2 className="h-4 w-4 mr-2" /> Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as 'upload' | 'url')} className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-9 mb-2">
        <TabsTrigger value="upload" className="text-xs">Upload</TabsTrigger>
        <TabsTrigger value="url" className="text-xs">URL</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:bg-muted/50"
          )}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <ImageIcon className="h-6 w-6 text-muted-foreground/40 mb-2" />
            <p className="text-xs font-medium text-muted-foreground">Click or drag image</p>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        </div>
      </TabsContent>
      <TabsContent value="url">
        <Input
          placeholder="https://example.com/image.png"
          className="h-9 text-xs"
          onChange={(e) => onChange(e.target.value)}
        />
      </TabsContent>
    </Tabs>
  );
}

// ─── 3. Main Component ──────────────────────────────────────────────────────

export function ExamScheduler() {
  const { user } = useAuth();
  const { data: exams = [], isLoading } = useExams();
  const createExam = useCreateExam();
  const updateExam = useUpdateExam();
  const deleteExam = useDeleteExam();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showCustomType, setShowCustomType] = useState(false);
  const [customType, setCustomType] = useState('');


  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: '',
      description: '',
      exam_type: 'mock',
      duration_minutes: 60,
      total_marks: 100,
      passing_percentage: 40,
      max_attempts: 1,
      show_results: true,
      browser_security: false,
      shuffle_questions: true,
      proctoring_enabled: false,
      scheduled_date: '',
    },

  });

  const onSubmit = async (data: ExamFormValues) => {
    if (!user?.id) return;
    try {
      await createExam.mutateAsync({
        title: data.title,
        exam_type: data.exam_type === 'other' ? customType : data.exam_type,
        duration_minutes: data.duration_minutes,

        total_marks: data.total_marks,
        passing_marks: Math.round((data.total_marks * data.passing_percentage) / 100),
        negative_marking: 0, // Default to 0, add field if needed later
        shuffle_questions: data.shuffle_questions,
        proctoring_enabled: data.proctoring_enabled,
        browser_security: data.browser_security,
        description: data.description ?? null,
        assigned_image: data.assigned_image ?? null,
        scheduled_date: new Date(data.scheduled_date).toISOString(),
        course_id: null,
        max_attempts: data.max_attempts,
        show_results: data.show_results,
        status: 'scheduled',
        created_by: user.id,
      });

      setIsAddOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to create exam', error);
    }
  };

  const todayExams = exams.filter(e => {
    if (!e.scheduled_date) return false;
    try {
      return isToday(new Date(e.scheduled_date));
    } catch {
      return false;
    }
  });

  const upcomingExams = exams.filter(e => {
    if (!e.scheduled_date) return false;
    try {
      const d = new Date(e.scheduled_date);
      return isFuture(d) && !isToday(d);
    } catch {
      return false;
    }
  });

  const pastExams = exams.filter(e => {
    if (!e.scheduled_date) return false;
    try {
      const d = new Date(e.scheduled_date);
      return !isFuture(d) && !isToday(d);
    } catch {
      return false;
    }
  });



  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px] text-xs font-medium text-muted-foreground animate-pulse">Synchronizing exam registry...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Search and Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Exam Management</h2>
          <p className="text-sm text-muted-foreground">Schedule and manage your assessment sessions</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg shadow-sm">
              <Plus className="h-4 w-4 mr-2" /> Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl rounded-xl border shadow-lg overflow-hidden">
            <div className="p-1 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Schedule New Assessment</DialogTitle>
                <DialogDescription>Configure the rules and timing for this exam.</DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-tight">Exam Title</FormLabel>
                            <FormControl><Input placeholder="Internal Assessment" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="exam_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-tight">Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="live">Live Proctored</SelectItem>
                                <SelectItem value="midterm">Midterm Examination</SelectItem>
                                <SelectItem value="final">Final Examination</SelectItem>
                                <SelectItem value="mock">Full Mock Test</SelectItem>
                                <SelectItem value="certification">Certification Exam</SelectItem>
                                <SelectItem value="competitive">Competitive Exam</SelectItem>
                                <SelectItem value="practice">Daily Practice Set</SelectItem>
                                <SelectItem value="quiz">Speed Quiz</SelectItem>
                                <SelectItem value="diagnostic">Diagnostic Assessment</SelectItem>
                                <SelectItem value="scholarship">Scholarship Test</SelectItem>
                                <SelectItem value="placement">Placement Drive</SelectItem>
                                <SelectItem value="other">Other / Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            {field.value === 'other' && (
                              <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label className="text-[10px] font-bold uppercase mb-1.5 block">Custom Category Name</Label>
                                <Input 
                                  placeholder="Enter own type..." 
                                  className="h-9 text-xs"
                                  value={customType}
                                  onChange={(e) => {
                                    setCustomType(e.target.value);
                                    // Normally we'd use field.onChange here but we need to keep 'other' as the select value
                                    // We'll handle the final mapping in onSubmit
                                  }}
                                />
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="assigned_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-tight">Cover Image</FormLabel>
                          <FormControl><FileUploadZone value={field.value} onChange={field.onChange} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-tight">Instructions</FormLabel>
                        <FormControl><Textarea placeholder="Instructions for candidates..." className="min-h-[80px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border">
                    <FormField
                      control={form.control}
                      name="scheduled_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase">Date & Time</FormLabel>
                          <FormControl><Input type="datetime-local" {...field} className="h-9 text-xs" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration_minutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase">Duration (mins)</FormLabel>
                          <FormControl><Input type="number" {...field} className="h-9 text-xs" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="total_marks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase">Total Marks</FormLabel>
                          <FormControl><Input type="number" {...field} className="h-9 text-xs" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passing_percentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase">Pass %</FormLabel>
                          <FormControl><Input type="number" {...field} className="h-9 text-xs" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="max_attempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase">Max Attempts</FormLabel>
                          <FormControl><Input type="number" {...field} className="h-9 text-xs" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>


                  <div className="flex items-center justify-between p-4 bg-muted/20 border rounded-lg gap-6">
                    <FormField
                      control={form.control}
                      name="shuffle_questions"
                      render={({ field }) => (
                        <div className="flex items-center gap-3">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                          <div className="space-y-0.5">
                            <Label className="text-xs font-bold">Shuffle</Label>
                          </div>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="proctoring_enabled"
                      render={({ field }) => (
                        <div className="flex items-center gap-3">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                          <div className="space-y-0.5">
                            <Label className="text-xs font-bold">Proctoring</Label>
                          </div>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="browser_security"
                      render={({ field }) => (
                        <div className="flex items-center gap-3">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                          <div className="space-y-0.5">
                            <Label className="text-xs font-bold">Security</Label>
                          </div>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="show_results"
                      render={({ field }) => (
                        <div className="flex items-center gap-3">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                          <div className="space-y-0.5">
                            <Label className="text-xs font-bold">Results</Label>
                          </div>
                        </div>
                      )}
                    />
                  </div>


                  <DialogFooter className="pt-4 border-t gap-2">
                    <Button type="button" variant="outline" className="rounded-lg" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createExam.isPending} className="rounded-lg px-8">
                      {createExam.isPending ? 'Scheduling...' : 'Confirm Schedule'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-12 rounded-xl bg-slate-100/50 p-1 border">
          <TabsTrigger value="today" className="rounded-lg font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Today ({todayExams.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-lg font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
            Upcoming ({upcomingExams.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-500 data-[state=active]:shadow-sm">
            Past / Completed ({pastExams.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {todayExams.length === 0 ? (
               <div className="col-span-full py-16 text-center border-2 border-dashed rounded-3xl bg-slate-50/50">
                 <CalendarIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-sm font-bold text-slate-400">No sessions active for today.</p>
               </div>
            ) : (
              todayExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} onUpdate={updateExam.mutate} onDelete={deleteExam.mutate} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {upcomingExams.length === 0 ? (
               <div className="col-span-full py-16 text-center border-2 border-dashed rounded-3xl bg-slate-50/50">
                 <CalendarIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-sm font-bold text-slate-400">No upcoming assessments found.</p>
               </div>
            ) : (
              upcomingExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} onUpdate={updateExam.mutate} onDelete={deleteExam.mutate} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 opacity-60 grayscale-[0.5]">
            {pastExams.length === 0 ? (
               <div className="col-span-full py-16 text-center border-2 border-dashed rounded-3xl bg-slate-50/50">
                 <CalendarIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                 <p className="text-sm font-bold text-slate-400">No past sessions found.</p>
               </div>
            ) : (
              pastExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} onUpdate={updateExam.mutate} onDelete={deleteExam.mutate} isPast />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      </div>
    </div>
  );
}
