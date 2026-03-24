import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useCourses, useInstructorProgress, useCourseTopics, useProfiles, useInstructors } from '@/hooks/useManagerData';
import {
    BookOpen, Users, CheckCircle2, Clock, Search, Video,
    FileText, MonitorPlay, TrendingUp, AlertCircle, Activity, Eye, Mail, Phone, Calendar, GraduationCap
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useCourseRoster } from '@/hooks/useInstructorData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function CourseMonitoring() {
    const { data: courses = [], isLoading: coursesLoading } = useCourses();
    const { data: instructorProgress = [], isLoading: progressLoading } = useInstructorProgress();
    const { data: topics = [], isLoading: topicsLoading } = useCourseTopics();
    const { data: profiles = [] } = useProfiles();
    const { data: instructors = [], isLoading: instructorsLoading } = useInstructors();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourseRoster, setSelectedCourseRoster] = useState<string | null>(null);
    const [isRosterOpen, setIsRosterOpen] = useState(false);

    const isLoading = coursesLoading || progressLoading || topicsLoading || instructorsLoading;

    // Helper: get instructor name from profiles
    const getInstructorName = (instructorId: string | null | undefined) => {
        if (!instructorId) return 'Unknown Instructor';
        const profile = profiles.find((p: { user_id: string; full_name: string }) => p.user_id === instructorId);
        return profile?.full_name || `Instructor #${String(instructorId).slice(0, 6)}`;
    };

    // Get course name
    const getCourseName = (courseId: string) => {
        const course = courses.find(c => c.id === courseId);
        return course?.title || 'Unknown Course';
    };

    // Filter courses
    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Aggregate topic stats per course
    const courseTopicStats = courses.map(course => {
        const courseTopics = topics.filter(t => t.course_id === course.id);
        const completed = courseTopics.filter(t => t.is_completed).length;
        return {
            courseId: course.id,
            title: course.title,
            totalTopics: courseTopics.length,
            completedTopics: completed,
            percentage: courseTopics.length > 0 ? Math.round((completed / courseTopics.length) * 100) : 0,
        };
    });

    // Summary stats
    const publishedCourses = courses.filter(c => c.is_published).length;
    const totalTopics = topics.length;
    const completedTopics = topics.filter(t => t.is_completed).length;
    const avgProgress = instructorProgress.length > 0
        ? Math.round(instructorProgress.reduce((acc, p) => {
            const pct = p.total_topics > 0 ? (p.topics_completed / p.total_topics) * 100 : 0;
            return acc + pct;
        }, 0) / instructorProgress.length)
        : 0;

    if (isLoading) {
        return <div className="flex items-center justify-center p-8">Loading course monitoring data...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Course Monitoring</h3>
                    <p className="text-sm text-muted-foreground">Track instructor progress & topic completion across courses</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{courses.length}</div>
                        <p className="text-xs text-muted-foreground">{publishedCourses} published</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTopics}</div>
                        <p className="text-xs text-green-600">{completedTopics} completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgProgress}%</div>
                        <Progress value={avgProgress} className="h-1.5 mt-1" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Instructors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{instructorProgress.length}</div>
                        <p className="text-xs text-muted-foreground">with progress data</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">overall topics</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="courses" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="courses" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Course Progress
                    </TabsTrigger>
                    <TabsTrigger value="instructors" className="gap-2">
                        <Users className="h-4 w-4" />
                        Instructor Activity
                    </TabsTrigger>
                </TabsList>

                {/* Course Progress Tab */}
                <TabsContent value="courses">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Course Topic Completion
                            </CardTitle>
                            <CardDescription>Track topic completion across all courses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredCourses.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No courses found</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredCourses.map((course) => {
                                        const stats = courseTopicStats.find(s => s.courseId === course.id);
                                        const courseTopicList = topics.filter(t => t.course_id === course.id);

                                        return (
                                            <div key={course.id} className="p-4 rounded-lg border bg-card">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                            <BookOpen className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">{course.title}</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                by {getInstructorName(course.instructor_id)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant={course.is_published ? 'default' : 'secondary'}>
                                                            {course.is_published ? 'Published' : 'Draft'}
                                                        </Badge>
                                                    <div className="flex items-center gap-2">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                                                            onClick={() => {
                                                                setSelectedCourseRoster(course.id);
                                                                setIsRosterOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <div className="text-right">
                                                            <div className="text-sm font-bold">
                                                                {stats?.completedTopics || 0}/{stats?.totalTopics || 0}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">topics</p>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Completion</span>
                                                        <span className="font-medium">{stats?.percentage || 0}%</span>
                                                    </div>
                                                    <Progress value={stats?.percentage || 0} className="h-2" />
                                                </div>

                                                {/* Topic list */}
                                                {courseTopicList.length > 0 && (
                                                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                        {courseTopicList.slice(0, 8).map((topic) => (
                                                            <div
                                                                key={topic.id}
                                                                className={`flex items-center gap-2 p-2 rounded text-xs ${topic.is_completed
                                                                        ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                                                                        : 'bg-muted/50 text-muted-foreground'
                                                                    }`}
                                                            >
                                                                {topic.is_completed ? (
                                                                    <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                                                                ) : (
                                                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                                                )}
                                                                <span className="truncate">{topic.title}</span>
                                                            </div>
                                                        ))}
                                                        {courseTopicList.length > 8 && (
                                                            <div className="flex items-center justify-center p-2 rounded text-xs bg-muted/50 text-muted-foreground">
                                                                +{courseTopicList.length - 8} more
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Instructor Activity Tab */}
                <TabsContent value="instructors">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Instructor Activity
                            </CardTitle>
                            <CardDescription>Monitor instructor progress by course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {instructorProgress.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No instructor progress data available</p>
                                    <p className="text-sm">Progress will appear here as instructors work on courses</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {instructorProgress
                                        .filter(p => instructors.some(i => i.user_id === p.instructor_id))
                                        .map((progress) => {
                                        const progressPct = progress.total_topics > 0
                                            ? Math.round((progress.topics_completed / progress.total_topics) * 100)
                                            : 0;
                                        const isActive = new Date(progress.last_activity_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                                        return (
                                            <div key={progress.id} className="p-4 rounded-lg border bg-card">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isActive ? 'bg-green-100 dark:bg-green-950/40' : 'bg-muted'
                                                            }`}>
                                                            <Users className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-muted-foreground'}`} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">{getInstructorName(progress.instructor_id)}</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {getCourseName(progress.course_id)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {isActive ? (
                                                            <Badge variant="default" className="bg-green-600 gap-1">
                                                                <Activity className="h-3 w-3" /> Active
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="gap-1">
                                                                <AlertCircle className="h-3 w-3" /> Inactive
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        <div>
                                                            <p className="text-sm font-medium">{progress.topics_completed}/{progress.total_topics}</p>
                                                            <p className="text-xs text-muted-foreground">Topics</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Video className="h-4 w-4 text-blue-500" />
                                                        <div>
                                                            <p className="text-sm font-medium">{progress.videos_uploaded}</p>
                                                            <p className="text-xs text-muted-foreground">Videos</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-orange-500" />
                                                        <div>
                                                            <p className="text-sm font-medium">{progress.resources_uploaded}</p>
                                                            <p className="text-xs text-muted-foreground">Resources</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MonitorPlay className="h-4 w-4 text-purple-500" />
                                                        <div>
                                                            <p className="text-sm font-medium">{progress.live_classes_conducted}</p>
                                                            <p className="text-xs text-muted-foreground">Live Classes</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">Topic Completion</span>
                                                        <span className="font-medium">{progressPct}%</span>
                                                    </div>
                                                    <Progress
                                                        value={progressPct}
                                                        className={`h-2 ${progressPct >= 80 ? '[&>div]:bg-green-500' : progressPct >= 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`}
                                                    />
                                                </div>

                                                {progress.notes && (
                                                    <p className="mt-2 text-xs text-muted-foreground italic">📝 {progress.notes}</p>
                                                )}

                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    Last active: {new Date(progress.last_activity_at).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Student Roster Dialog */}
            <CourseRosterDialog 
                courseId={selectedCourseRoster} 
                open={isRosterOpen} 
                onOpenChange={setIsRosterOpen} 
                courseTitle={courses.find(c => c.id === selectedCourseRoster)?.title || ''}
            />
        </div>
    );
}

interface StudentRosterItem {
    id: string;
    full_name: string;
    email: string;
    mobile_number?: string | null;
    avatar_url?: string | null;
    progress?: number;
    enrolled_at: string | Date;
}

function CourseRosterDialog({ courseId, open, onOpenChange, courseTitle }: { 
    courseId: string | null; 
    open: boolean; 
    onOpenChange: (open: boolean) => void; 
    courseTitle: string;
}) {
    const { data: roster = [], isLoading } = useCourseRoster(courseId || '');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-[2rem] sm:rounded-3xl border-none shadow-2xl">
                <DialogHeader className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
                        <div className="h-16 w-16 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                            <GraduationCap className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-1 sm:space-y-0.5 max-w-full">
                            <DialogTitle className="text-2xl sm:text-3xl font-black uppercase text-white flex flex-wrap justify-center sm:justify-start items-center gap-x-2">
                                <span>STUDENT</span> 
                                <span className="text-blue-300">ROSTER</span>
                            </DialogTitle>
                            <DialogDescription className="text-white/70 font-medium text-sm sm:text-base leading-snug">
                                Enrolled students for <span className="text-white font-bold block sm:inline">{courseTitle}</span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/80">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                        </div>
                    ) : roster.length === 0 ? (
                        <div className="text-center py-24 px-4">
                            <Users className="h-16 w-16 text-slate-300 mx-auto mb-5" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Students Enrolled Yet</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {roster.map((student: StudentRosterItem) => (
                                <div key={student.id} className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/60 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="h-14 w-14 shrink-0 rounded-full bg-slate-100 flex items-center justify-center border-[3px] border-white shadow-md overflow-hidden">
                                            {student.avatar_url ? (
                                                <img src={student.avatar_url} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <span className="text-xl font-black text-slate-400">{student.full_name?.[0]?.toUpperCase() || 'S'}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                                                {student.full_name || 'Anonymous Student'}
                                            </h4>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-slate-500 font-medium mt-1">
                                                <span className="flex items-center gap-1.5 truncate"><Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{student.email}</span></span>
                                                {student.mobile_number && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" /> {student.mobile_number}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-between lg:justify-end gap-4 sm:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto">
                                        <div className="text-left lg:text-right flex-1 lg:flex-none">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Progress</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-full sm:w-28 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner flex-1 sm:flex-none">
                                                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${student.progress || 0}%` }} />
                                                </div>
                                                <span className="text-sm font-black text-slate-900 w-8">{student.progress || 0}%</span>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block h-10 w-px bg-slate-200" />
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Joined</p>
                                            <span className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                {new Date(student.enrolled_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4 sm:p-6 border-t bg-white flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                        Close Roster
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
