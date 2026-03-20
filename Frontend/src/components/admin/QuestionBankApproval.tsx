import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fetchWithAuth } from '@/lib/api';
import { Loader2, CheckCircle, XCircle, FileText, AlertCircle, LayoutGrid, Clock, History } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCourses } from '@/hooks/useManagerData';

interface PendingQuestionBank {
    topic: string;
    count: number;
    created_by: string;
    created_at: string;
}

export function QuestionBankApproval() {
    const [pendingBanks, setPendingBanks] = useState<PendingQuestionBank[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const { toast } = useToast();

    // Course Selection State
    const [showCourseDialog, setShowCourseDialog] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [viewTab, setViewTab] = useState<'pending' | 'library'>('pending');
    const { data: courses } = useCourses();
    const [approvedBanks, setApprovedBanks] = useState<PendingQuestionBank[]>([]);

    const fetchPendingBanks = async () => {
        try {
            setLoading(true);
            const questions = await fetchWithAuth('/data/question_bank') as any[];
            
            const groupData = (data: any[], status: string) => {
                return data.filter(q => q.approval_status === status).reduce((acc: Record<string, PendingQuestionBank>, q: any) => {
                    if (!acc[q.topic]) {
                        acc[q.topic] = {
                            topic: q.topic,
                            count: 0,
                            created_by: q.created_by,
                            created_at: q.created_at
                        };
                    }
                    acc[q.topic].count++;
                    return acc;
                }, {});
            };

            setPendingBanks(Object.values(groupData(questions, 'pending')));
            setApprovedBanks(Object.values(groupData(questions, 'approved')));
        } catch (err) {
            console.error('Failed to fetch question banks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingBanks();
    }, []);

    const handleApproveClick = (topic: string) => {
        setSelectedTopic(topic);
        setShowCourseDialog(true);
    };

    const confirmApproval = async () => {
        if (!selectedTopic || !selectedCourseId) {
            toast({
                title: "Incomplete Action",
                description: "Please select a course to associate with this question bank.",
                variant: "destructive"
            });
            return;
        }
        await handleAction(selectedTopic, 'approved', selectedCourseId);
        setShowCourseDialog(false);
    };

    const handleAction = async (topic: string, status: 'approved' | 'rejected', courseId?: string) => {
        try {
            setProcessing(topic);
            await fetchWithAuth('/admin/approve-question-bank', {
                method: 'PUT',
                body: JSON.stringify({ 
                    topic, 
                    status,
                    course_id: courseId 
                })
            });

            toast({
                title: `Question Bank ${status === 'approved' ? 'Approved' : 'Rejected'}`,
                description: `Successfully updated topic: ${topic}`
            });

            setPendingBanks(prev => prev.filter(b => b.topic !== topic));
        } catch (err) {
            toast({
                title: 'Action Failed',
                description: err instanceof Error ? err.message : 'Failed to update status',
                variant: 'destructive'
            });
        } finally {
            setProcessing(null);
            setSelectedTopic(null);
            setSelectedCourseId("");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Fetching pending approvals...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <LayoutGrid className="h-6 w-6 text-primary" />
                        Question Bank Approvals
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">Review and activate curated question repositories.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Tabs value={viewTab} onValueChange={(v) => setViewTab(v as any)} className="bg-slate-100 p-1 rounded-xl">
                        <TabsList className="bg-transparent border-none">
                            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
                            <TabsTrigger value="library" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Library</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Badge variant="secondary" className="h-7 px-3 bg-primary/10 text-primary border-none font-bold">
                        {pendingBanks.length} Total Requests
                    </Badge>
                </div>
            </div>

            <Tabs value={viewTab} className="w-full">
                <TabsContent value="pending" className="mt-0">
                    {pendingBanks.length === 0 ? (
                        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[2rem]">
                            <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-inner border border-slate-100">
                                    <CheckCircle className="h-10 w-10 text-slate-200" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-bold text-slate-900">Queue is empty!</p>
                                    <p className="text-sm font-medium text-slate-500 max-w-sm">There are no pending question banks awaiting review.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {pendingBanks.map((bank) => (
                                <Card key={bank.topic} className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center">
                                            <div className="bg-primary/5 p-8 flex flex-col justify-center border-r border-slate-100 min-w-[200px]">
                                                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                                                    <FileText className="h-6 w-6 text-primary" />
                                                </div>
                                                <Badge variant="secondary" className="w-fit bg-primary/20 text-primary border-none font-bold px-3">
                                                    {bank.count} Questions
                                                </Badge>
                                            </div>

                                            <div className="flex-1 p-8 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-bold text-xl text-slate-900">{bank.topic}</h3>
                                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-2 py-0 text-[10px] uppercase tracking-wider font-black">Pending</Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500 mt-2">
                                                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                                        <Clock className="h-3.5 w-3.5 text-primary" />
                                                        <span>Submitted: {new Date(bank.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                                        <span>Source: {bank.created_by.substring(0, 8)}...</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 lg:bg-slate-50/50 flex flex-row lg:flex-col justify-center gap-3 border-l border-slate-100 min-w-[220px]">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleAction(bank.topic, 'rejected')}
                                                    disabled={!!processing}
                                                    className="w-full h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all font-bold"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Reject
                                                </Button>
                                                <Button
                                                    onClick={() => handleApproveClick(bank.topic)}
                                                    disabled={!!processing}
                                                    className="w-full h-11 rounded-xl pro-button-primary shadow-lg shadow-primary/20 font-bold"
                                                >
                                                    {processing === bank.topic ? (
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                    )}
                                                    Approve Set
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="library" className="mt-0">
                    <div className="grid gap-4">
                        {approvedBanks.map((bank) => (
                            <Card key={bank.topic} className="overflow-hidden border-slate-200/60 shadow-sm rounded-2xl opacity-80 hover:opacity-100 transition-opacity">
                                <CardContent className="p-0">
                                    <div className="flex items-center p-6">
                                        <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mr-6 border border-emerald-100">
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900">{bank.topic}</h3>
                                            <p className="text-xs text-slate-500 font-medium">Authorized questions available in portal</p>
                                        </div>
                                        <Badge variant="outline" className="text-slate-400 font-bold border-slate-200">{bank.count} Questions</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Course Selection Dialog */}
            <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary p-8 text-white relative">
                        {/* Decorative Background Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        
                        <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30 shadow-xl relative z-10">
                            <LayoutGrid className="h-8 w-8 text-white" />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tight relative z-10">Link to Curriculum</DialogTitle>
                        <DialogDescription className="text-white/80 mt-2 font-medium relative z-10">
                            Select the target course for <span className="text-white underline underline-offset-4 decoration-2">{selectedTopic}</span> authorization.
                        </DialogDescription>
                    </div>

                    <div className="p-8 space-y-8 bg-white">
                        <div className="space-y-4">
                            <Label htmlFor="course-select" className="text-sm font-bold text-slate-900 uppercase tracking-widest">Target Deployment Course</Label>
                            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                <SelectTrigger id="course-select" className="h-14 rounded-2xl border-slate-200 bg-slate-50 focus:ring-primary/20 font-semibold text-slate-700">
                                    <SelectValue placeholder="Select Course..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-200">
                                    {courses?.map((course: any) => (
                                        <SelectItem 
                                            key={course.id} 
                                            value={course.id}
                                            className="rounded-xl focus:bg-primary/5 focus:text-primary py-3 px-4 font-medium"
                                        >
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs font-semibold text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed italic">
                                Note: Only students enrolled in this course will have permission to access these assessment items in their portal.
                            </p>
                        </div>

                        <DialogFooter className="flex gap-3 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setShowCourseDialog(false)}
                                className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmApproval}
                                className="flex-1 h-12 rounded-xl pro-button-primary shadow-lg shadow-primary/20 font-bold"
                                disabled={!selectedCourseId}
                            >
                                Authorize & Deploy
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
