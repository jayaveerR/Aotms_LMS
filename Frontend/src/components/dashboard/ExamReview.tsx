import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    CheckCircle2, 
    XCircle, 
    ChevronLeft, 
    Clock, 
    Award,
    AlertCircle,
    BookOpen,
    HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewResult {
    meta: {
        score: number;
        total: number;
        percentage: number;
        submitted_at: string;
    };
    questions: Array<{
        id: string;
        text: string;
        type: string;
        options: Array<{
            id: string;
            text: string;
            is_correct: boolean;
        }>;
        studentAnswerId: string | null;
        marks: number;
    }>;
}

interface ExamReviewProps {
    resultId: string;
    onClose: () => void;
}

export function ExamReview({ resultId, onClose }: ExamReviewProps) {
    const [review, setReview] = useState<ReviewResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const data = await fetchWithAuth(`/student/exam-review/${resultId}`) as ReviewResult;
                setReview(data);
            } catch (err) {
                console.error('Failed to fetch exam review', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [resultId]);

    if (loading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto py-8">
                <Skeleton className="h-40 w-full rounded-2xl" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
                </div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="text-center py-20 flex flex-col items-center gap-4">
                <AlertCircle className="h-12 w-12 text-rose-500" />
                <h3 className="text-xl font-bold">Failed to load review</h3>
                <Button onClick={onClose}>Return to History</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 mt-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" className="rounded-xl gap-2 font-bold text-slate-500 hover:text-primary transition-colors" onClick={onClose}>
                    <ChevronLeft className="h-5 w-5" />
                    Back to History
                </Button>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Submission Date</p>
                    <p className="text-sm font-bold text-slate-900">{new Date(review.meta.submitted_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Performance Banner */}
            <Card className="pro-card border-none bg-primary text-white overflow-hidden relative shadow-2xl shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <Badge className="bg-white/20 text-white border-none font-black px-3 py-1 mb-2">Detailed Analysis</Badge>
                        <h2 className="text-4xl font-black tracking-tight">Post-Exam Review</h2>
                        <p className="text-white/70 font-medium">Verify your answers and learn from your mistakes.</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="h-32 w-32 rounded-3xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
                            <span className="text-3xl font-black">{Math.round(review.meta.percentage)}%</span>
                            <span className="text-[10px] uppercase font-bold text-white/60">Score Rate</span>
                        </div>
                        <div className="h-32 w-32 rounded-3xl bg-white text-primary flex flex-col items-center justify-center shadow-lg">
                            <span className="text-3xl font-black text-primary">{review.meta.score}<span className="text-lg opacity-50">/{review.meta.total}</span></span>
                            <span className="text-[10px] uppercase font-bold opacity-60">Points Won</span>
                        </div>
                    </div>
                </CardContent>
                <Award className="absolute -bottom-8 -right-8 h-48 w-48 text-white/5 -rotate-12" />
            </Card>

            {/* Questions List */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-black text-slate-900">Question Summary</h3>
                </div>

                {review.questions.map((q, idx) => {
                    const isCorrect = q.options.find(opt => opt.id === q.studentAnswerId)?.is_correct;
                    
                    return (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className={`overflow-hidden rounded-[1.5rem] border-2 transition-all ${
                                isCorrect 
                                ? 'border-emerald-100 bg-emerald-50/20' 
                                : q.studentAnswerId 
                                    ? 'border-rose-100 bg-rose-50/20' 
                                    : 'border-slate-100'
                            }`}>
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="h-6 rounded-lg font-bold border-slate-200">Q#{idx + 1}</Badge>
                                                <Badge className={isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}>
                                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                                </Badge>
                                            </div>
                                            <h4 className="text-lg font-black text-slate-900 leading-tight">{q.text}</h4>
                                        </div>
                                        <div className="shrink-0 font-black text-slate-400">+{q.marks} Pts</div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {q.options.map((opt) => {
                                        const isSelected = opt.id === q.studentAnswerId;
                                        const isTruth = opt.is_correct;
                                        
                                        let stateClass = "bg-white border-slate-100 text-slate-600";
                                        if (isSelected && isTruth) stateClass = "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200";
                                        else if (isSelected && !isTruth) stateClass = "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200";
                                        else if (isTruth) stateClass = "bg-emerald-100 border-emerald-300 text-emerald-800 ring-2 ring-emerald-300/20";

                                        return (
                                            <div 
                                                key={opt.id}
                                                className={`flex items-center justify-between p-4 rounded-xl border text-sm font-bold transition-all ${stateClass}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center border ${
                                                        isSelected ? 'bg-white/20 border-white/40' : 'bg-slate-50 border-slate-200'
                                                    }`}>
                                                        {isSelected ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                                                    </div>
                                                    <span>{opt.text}</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    {isSelected && (
                                                        <span className="text-[8px] uppercase tracking-widest font-black bg-black/10 px-1.5 py-0.5 rounded">Your Choice</span>
                                                    )}
                                                    {isTruth && (
                                                        <CheckCircle2 className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                                                    )}
                                                    {!isTruth && isSelected && (
                                                        <XCircle className="h-4 w-4 text-white" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {!isCorrect && (
                                        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-primary uppercase tracking-widest">Correction Note</p>
                                                <p className="text-xs text-slate-600 font-medium">
                                                    The correct answer is <span className="font-bold text-emerald-600 underline">"{q.options.find(o => o.is_correct)?.text}"</span>. 
                                                    Review this topic in your courses to improve your concepts.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 text-center space-y-4">
                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto border border-slate-200">
                    <HelpCircle className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900">Have questions about these results?</h3>
                    <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">Contact your instructor or raise a support ticket if you believe there is a grading discrepancy.</p>
                </div>
                <Button variant="outline" className="rounded-xl h-12 px-8 border-slate-200 font-bold bg-white" onClick={onClose}>
                    Close Review
                </Button>
            </div>
        </div>
    );
}
