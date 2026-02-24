import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useExams,
  useCreateExam,
  useUpdateExam,
  useDeleteExam,
} from "@/hooks/useManagerData";
import { useAuth } from "@/hooks/useAuth";
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
  AlertCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { format, isToday, isFuture } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── 1. Validation Schema ────────────────────────────────────────────────────

const examSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    exam_type: z.enum(["live", "mock", "practice"]),
    assigned_image: z.string().optional(),
    scheduled_date: z.string().refine((val) => new Date(val) > new Date(), {
      message: "Scheduled date must be in the future",
    }),
    duration_minutes: z.coerce
      .number()
      .min(10, "Duration must be at least 10 minutes"),
    total_marks: z.coerce.number().min(1, "Total marks must be at least 1"),
    passing_marks: z.coerce.number().min(1),
    negative_marking: z.coerce.number().min(0),
    shuffle_questions: z.boolean().default(true),
    proctoring_enabled: z.boolean().default(false),
  })
  .refine((data) => data.passing_marks <= data.total_marks, {
    message: "Passing marks cannot exceed total marks",
    path: ["passing_marks"],
  });

type ExamFormValues = z.infer<typeof examSchema>;

// ─── 2. Image Upload Component ──────────────────────────────────────────────

function FileUploadZone({
  value,
  onChange,
}: {
  value?: string;
  onChange: (val: string) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [tab, setTab] = useState<"upload" | "url">("upload");

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) onChange(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  if (value) {
    return (
      <div className="relative rounded-none overflow-hidden border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group h-40 bg-white">
        <img src={value} alt="Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="sm"
            onClick={() => onChange("")}
            className="bg-[#FD5A1A] text-white border-2 border-[#000000] font-black uppercase tracking-widest text-[10px] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as "upload" | "url")}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 h-10 mb-2 bg-[#E9E9E9] border-2 border-[#000000] rounded-none p-1">
        <TabsTrigger
          value="upload"
          className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#0075CF] data-[state=active]:text-white rounded-none transition-all"
        >
          Upload
        </TabsTrigger>
        <TabsTrigger
          value="url"
          className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#0075CF] data-[state=active]:text-white rounded-none transition-all"
        >
          URL
        </TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 border-4 border-dashed rounded-none transition-all",
            dragActive
              ? "border-[#0075CF] bg-[#0075CF]/5"
              : "border-[#000000]/20 hover:border-[#000000] hover:bg-[#E9E9E9]/50",
          )}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <ImageIcon className="h-6 w-6 text-[#000000]/40 mb-2" />
            <p className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Click or drag image
            </p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
            />
          </label>
        </div>
      </TabsContent>
      <TabsContent value="url">
        <Input
          placeholder="https://example.com/image.png"
          className="h-10 text-xs bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
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

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      exam_type: "live",
      duration_minutes: 60,
      total_marks: 100,
      passing_marks: 40,
      negative_marking: 0,
      shuffle_questions: true,
      proctoring_enabled: false,
      scheduled_date: "",
    },
  });

  const onSubmit = async (data: ExamFormValues) => {
    if (!user?.id) return;
    try {
      await createExam.mutateAsync({
        title: data.title as string,
        exam_type: data.exam_type as string,
        duration_minutes: data.duration_minutes as number,
        total_marks: data.total_marks as number,
        passing_marks: data.passing_marks as number,
        negative_marking: data.negative_marking as number,
        shuffle_questions: data.shuffle_questions as boolean,
        proctoring_enabled: data.proctoring_enabled as boolean,
        description: data.description ?? null,
        assigned_image: data.assigned_image ?? null,
        scheduled_date: new Date(data.scheduled_date).toISOString(),
        course_id: null,
        max_attempts: 1,
        show_results: true,
        status: "scheduled",
        created_by: user.id,
      });
      setIsAddOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create exam", error);
    }
  };

  const todayExams = exams.filter((e) => isToday(new Date(e.scheduled_date)));
  const upcomingExams = exams.filter(
    (e) =>
      isFuture(new Date(e.scheduled_date)) &&
      !isToday(new Date(e.scheduled_date)),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[10px] font-black text-[#000000] uppercase tracking-widest animate-pulse">
        Synchronizing exam registry...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-['Inter']">
      {/* Search and Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider">
            Exam Management
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest">
            Schedule and manage your assessment sessions
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FD5A1A] text-white border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FD5A1A]/90 hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-black uppercase tracking-widest text-xs">
              <Plus className="h-4 w-4 mr-2" /> Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-white border-4 border-[#000000] rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 font-['Inter']">
            <div className="max-h-[90vh] overflow-y-auto">
              <DialogHeader className="p-6 border-b-4 border-[#000000] bg-[#FFD166]">
                <DialogTitle className="text-2xl font-black text-[#000000] uppercase tracking-wider">
                  Schedule New Assessment
                </DialogTitle>
                <DialogDescription className="font-bold text-[#000000]/70 uppercase tracking-widest text-xs">
                  Configure the rules and timing for this exam.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5 p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                              Exam Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Internal Assessment"
                                className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="exam_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                              Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-0">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white border-2 border-[#000000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <SelectItem
                                  value="live"
                                  className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
                                >
                                  Live Proctored
                                </SelectItem>
                                <SelectItem
                                  value="mock"
                                  className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
                                >
                                  Mock Test
                                </SelectItem>
                                <SelectItem
                                  value="practice"
                                  className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
                                >
                                  Practice Set
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
                          <FormLabel className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                            Cover Image
                          </FormLabel>
                          <FormControl>
                            <FileUploadZone
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                          Instructions
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Instructions for candidates..."
                            className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50 min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-4 border-[#000000] rounded-none bg-[#E9E9E9]">
                    <FormField
                      control={form.control}
                      name="scheduled_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                            Date & Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              className="bg-white border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50 h-9 text-xs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration_minutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                            Duration (mins)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="bg-white border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50 h-9 text-xs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="total_marks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                            Total Marks
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="bg-white border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50 h-9 text-xs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border-4 border-[#000000] rounded-none bg-[#E9E9E9] gap-6">
                    <FormField
                      control={form.control}
                      name="shuffle_questions"
                      render={({ field }) => (
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-2 border-[#000000] data-[state=checked]:bg-[#6BCB77]"
                          />
                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                              Shuffle
                            </Label>
                            <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                              Randomize order
                            </p>
                          </div>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="proctoring_enabled"
                      render={({ field }) => (
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-2 border-[#000000] data-[state=checked]:bg-[#FD5A1A]"
                          />
                          <div className="space-y-0.5">
                            <Label className="text-[10px] font-black text-[#FD5A1A] uppercase tracking-widest">
                              Proctoring
                            </Label>
                            <p className="text-[10px] font-bold text-[#FD5A1A]/80 uppercase tracking-widest">
                              AI Monitoring
                            </p>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  <DialogFooter className="border-t-4 border-[#000000] bg-[#E9E9E9] -mx-6 mb-[-24px] p-6 flex sm:justify-between items-center w-[calc(100%+48px)]">
                    <Button
                      type="button"
                      className="bg-white text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all w-full sm:w-auto"
                      onClick={() => setIsAddOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createExam.isPending}
                      className="bg-[#6BCB77] text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full sm:w-auto mt-2 sm:mt-0"
                    >
                      {createExam.isPending
                        ? "Scheduling..."
                        : "Confirm Schedule"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Today */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#E9E9E9] p-3 rounded-lg border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#000000] flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" /> Sessions Today
            </h3>
            <Badge className="bg-[#0075CF] text-white border-2 border-[#000000] font-black">
              {todayExams.length}
            </Badge>
          </div>

          <div className="space-y-2">
            {todayExams.length === 0 ? (
              <p className="text-center py-8 text-xs font-medium text-muted-foreground border rounded-lg bg-muted/5">
                No active sessions for today.
              </p>
            ) : (
              todayExams.map((exam) => (
                <Card
                  key={exam.id}
                  className="bg-white rounded-xl border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all p-4 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-none bg-[#E9E9E9] flex items-center justify-center overflow-hidden shrink-0 border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {exam.assigned_image ? (
                        <img
                          src={exam.assigned_image}
                          className="h-full w-full object-cover"
                          alt={exam.title}
                        />
                      ) : (
                        <CalendarIcon className="h-5 w-5 text-[#000000]/40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-[#000000] text-sm uppercase tracking-wider truncate">
                        {exam.title}
                      </h4>
                      <p className="text-[10px] text-[#000000]/60 font-bold uppercase tracking-widest mt-0.5">
                        {format(new Date(exam.scheduled_date), "h:mm a")} •{" "}
                        {exam.duration_minutes}m
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      className={cn(
                        "flex-1 h-9 text-[10px] font-black uppercase tracking-widest rounded-none border-2 border-[#000000] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all",
                        exam.status === "active"
                          ? "bg-[#FD5A1A] text-white"
                          : "bg-[#6BCB77] text-[#000000]",
                      )}
                      onClick={() =>
                        updateExam.mutate({
                          id: exam.id,
                          status:
                            exam.status === "active" ? "completed" : "active",
                        })
                      }
                    >
                      {exam.status === "active" ? "STOP SESSION" : "START NOW"}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-destructive"
                      onClick={() => deleteExam.mutate(exam.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#E9E9E9]">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#000000] flex items-center gap-2">
              <CalendarIcon className="h-3.5 w-3.5" /> Upcoming Schedule
            </h3>
            <span className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
              {upcomingExams.length} assessments scheduled
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-1 xl:grid-cols-2">
            {upcomingExams.length === 0 ? (
              <div className="col-span-full py-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center space-y-2 bg-muted/5">
                <AlertCircle className="h-8 w-8 text-muted-foreground/20" />
                <p className="text-sm font-medium text-muted-foreground">
                  No upcoming exams found.
                </p>
              </div>
            ) : (
              upcomingExams.map((exam) => (
                <Card
                  key={exam.id}
                  className="group bg-white rounded-xl border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col overflow-hidden"
                >
                  <div className="h-20 sm:h-24 relative bg-[#E9E9E9] border-b-4 border-[#000000]">
                    {exam.assigned_image ? (
                      <img
                        src={exam.assigned_image}
                        className="w-full h-full object-cover"
                        alt={exam.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="bg-background/90 text-[10px] h-5 rounded-md border border-border"
                      >
                        {exam.exam_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-black text-[#000000] text-sm uppercase tracking-wider leading-tight line-clamp-1">
                        {exam.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {exam.duration_minutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />{" "}
                          {format(new Date(exam.scheduled_date), "MMM dd")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        className="flex-1 h-9 rounded-none bg-white text-[#000000] border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-[10px] font-black uppercase tracking-widest"
                        onClick={() => setIsAddOpen(true)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-white border-2 border-[#000000] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FD5A1A]/10 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all text-[#000000]/40 hover:text-[#FD5A1A]"
                        onClick={() => deleteExam.mutate(exam.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
