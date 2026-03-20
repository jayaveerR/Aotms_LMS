import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  Flag,
  Monitor,
  Layout,
  Maximize2,
  Minimize2,
  LogOut,
  HelpCircle,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExamQuestions } from '@/hooks/useStudentData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ExamSessionProps {
  examId: string;
  examTitle: string;
  durationMinutes: number;
  onFinish: (results: any) => void;
  onExit: () => void;
  type: 'mock' | 'live';
}

export function ExamSession({ examId, examTitle, durationMinutes, onFinish, onExit, type }: ExamSessionProps) {
  const { data: questions, isLoading } = useExamQuestions(examId);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();

  // Fullscreen management
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const currentQuestion = questions?.[currentIdx];
  const progress = questions ? ((Object.keys(answers).length / questions.length) * 100) : 0;

  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleComplete = () => {
    // Check if every mandatory question is attempted for mocks
    if (type === 'mock' && Object.keys(answers).length < (questions?.length || 0)) {
      toast({
        title: "Mandatory Questions Missing",
        description: `Questions marked with (*) must be attempted. You answered ${Object.keys(answers).length} of ${questions?.length}.`,
        variant: "destructive",
        className: "bg-red-50 border-red-100"
      });
      return;
    }

    // Generate results payload
    const results = {
        examId,
        score: calculateScore(),
        totalQuestions: questions?.length || 0,
        answers: answers,
        timeSpent: (durationMinutes * 60) - timeLeft
    };
    onFinish(results);
  };

  const calculateScore = () => {
    // Placeholder logic - Real grading happens on backend
    return Object.keys(answers).length;
  };

  if (isLoading) return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center text-white space-y-4">
        <Monitor className="h-12 w-12 text-primary animate-pulse" />
        <h2 className="text-xl font-bold tracking-widest uppercase">Initializing Digital Environment</h2>
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-primary" 
                initial={{ width: 0 }} 
                animate={{ width: '100%' }} 
                transition={{ duration: 2, repeat: Infinity }}
            />
        </div>
    </div>
  );

  if (!questions || questions.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-slate-300" />
        <p className="text-slate-600 font-bold">No questions found for this topic.</p>
        <Button onClick={onExit}>Return to Dashboard</Button>
    </div>
  );

  return (
    <div className={cn(
        "fixed inset-0 bg-[#f8fafc] z-[100] flex flex-col transition-all",
        isFullScreen ? "p-0" : "p-0"
    )}>
        {/* Modern Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm relative z-10">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Layout className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                        {examTitle}
                        {type === 'mock' && <span className="text-red-500 ml-1" title="Mandatory Assignment">*</span>}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-200 bg-slate-50">Authorized Session</Badge>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                            <Monitor className="h-3 w-3" /> Secure Connection
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Visual Timer */}
                <div className={cn(
                    "flex flex-col items-end px-6 py-2 rounded-2xl border transition-all duration-500",
                    timeLeft < 300 ? "bg-red-50 border-red-200 text-red-600" : "bg-primary/5 border-primary/10 text-primary"
                )}>
                    <div className="flex items-center gap-2 mb-0.5">
                        <Timer className={cn("h-4 w-4", timeLeft < 300 && "animate-pulse")} />
                        <span className="text-2xl font-black tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-70">Remaining Time</span>
                </div>

                <Separator orientation="vertical" className="h-10 bg-slate-200" />

                <div className="flex gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 text-slate-400 hover:text-slate-900 rounded-xl"
                        onClick={() => setIsFullScreen(!isFullScreen)}
                    >
                        {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </Button>
                    <Button 
                        variant="ghost" 
                        className="h-10 px-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl font-bold flex items-center gap-2"
                        onClick={onExit}
                    >
                        <LogOut className="h-4 w-4" /> Exit
                    </Button>
                </div>
            </div>
        </header>

        {/* Main Interface Content */}
        <main className="flex-1 flex overflow-hidden lg:flex-row flex-col">
            {/* Left Sidebar: Navigation & Controls - Hidden on small screens */}
            <aside className="w-full lg:w-[320px] bg-white border-r border-slate-200 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Global Progress
                            {type === 'mock' && <span className="text-red-600 font-black">*</span>}
                        </span>
                        <span className="text-sm font-black text-primary">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2.5 bg-slate-200 [&>div]:bg-primary shadow-sm" />
                </div>

                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Layout className="h-3.5 w-3.5" /> Navigation Hub
                        </h3>
                        <Badge variant="outline" className="font-bold text-[10px] text-slate-500">{questions.length} Items</Badge>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
                        {questions.map((q, idx) => {
                            const isAnswered = !!answers[q.id];
                            const isCurrent = currentIdx === idx;
                            const isFlagged = flagged[q.id];

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentIdx(idx)}
                                    className={cn(
                                        "h-12 rounded-xl text-xs font-black transition-all flex items-center justify-center relative group",
                                        isCurrent ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105 z-10" : 
                                        isAnswered ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                        "bg-slate-50 text-slate-400 border border-slate-200 hover:border-slate-300"
                                    )}
                                >
                                    {idx + 1}
                                    {isFlagged && (
                                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                                    )}
                                    {isAnswered && !isCurrent && (
                                        <CheckCircle2 className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-emerald-500 fill-white" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Question Legend */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-md bg-primary shadow-sm" /> Active</div>
                        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-md bg-emerald-100 border border-emerald-200" /> Saved</div>
                        <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded-md bg-red-500" /> Review</div>
                    </div>
                </div>
            </aside>

            {/* Central Question Workspace */}
            <section className="flex-1 relative bg-slate-50/30 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto py-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIdx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="h-8 px-3 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">ITEM NO. {currentIdx + 1}</span>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className={cn(
                                                "h-8 rounded-lg text-[10px] font-bold uppercase transition-all",
                                                flagged[currentQuestion.id] ? "bg-red-50 text-red-600 border-red-200" : "text-slate-500 border-slate-200"
                                            )}
                                            onClick={() => setFlagged(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
                                        >
                                            <Flag className={cn("h-3.5 w-3.5 mr-1.5", flagged[currentQuestion.id] && "fill-current")} />
                                            {flagged[currentQuestion.id] ? "Remove Flag" : "Flag for Review"}
                                        </Button>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                                        {currentQuestion.text}
                                        {type === 'mock' && <span className="text-red-500 ml-1">*</span>}
                                    </h2>
                                </div>

                                <Separator className="bg-slate-200/60" />

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Response</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {currentQuestion.options.map((option: any, oIdx: number) => (
                                            <button
                                              key={option.id}
                                              onClick={() => handleOptionSelect(option.id)}
                                              className={cn(
                                                "group relative flex items-center p-5 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-md",
                                                answers[currentQuestion.id] === option.id 
                                                  ? "bg-white border-primary shadow-lg shadow-primary/5 translate-x-1" 
                                                  : "bg-white/50 border-white hover:border-slate-300 hover:bg-white"
                                              )}
                                            >
                                              <div className={cn(
                                                "h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs mr-4 transition-colors",
                                                answers[currentQuestion.id] === option.id 
                                                  ? "bg-primary text-white" 
                                                  : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                              )}>
                                                {String.fromCharCode(65 + oIdx)}
                                              </div>
                                              <span className={cn(
                                                "font-semibold text-base",
                                                answers[currentQuestion.id] === option.id ? "text-slate-900" : "text-slate-600"
                                              )}>
                                                {option.text}
                                              </span>
                                              {answers[currentQuestion.id] === option.id && (
                                                <div className="absolute right-6 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                                </div>
                                              )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </ScrollArea>

                {/* Footer Navigation Controls */}
                <div className="bg-white border-t border-slate-200 p-6 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                                disabled={currentIdx === 0}
                                className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                                disabled={currentIdx === questions.length - 1}
                                className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="h-12 px-6 rounded-xl text-slate-600 font-bold hover:bg-slate-100 flex items-center gap-2"
                                onClick={() => {
                                    setAnswers(prev => {
                                        const newA = { ...prev };
                                        delete newA[currentQuestion.id];
                                        return newA;
                                    });
                                }}
                            >
                                Clear Response
                            </Button>
                            <Button
                                onClick={handleComplete}
                                className="h-12 px-8 rounded-xl pro-button-primary shadow-xl shadow-primary/20 font-black tracking-wider uppercase text-xs flex items-center gap-2"
                            >
                                Finish Assessment <HelpCircle className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
  );
}
