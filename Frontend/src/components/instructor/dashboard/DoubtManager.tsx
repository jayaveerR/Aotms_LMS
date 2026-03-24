import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, Search, Filter, CheckCircle2, Pin, Trash2, 
  Send, Clock, User, BookOpen, ChevronDown, ChevronUp,
  MoreHorizontal, Reply, ThumbsUp, AlertCircle, Loader2, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { 
  useInstructorPlaylists,
  useDoubts, 
  useReplyToDoubt, 
  useMarkDoubtSolved, 
  usePinDoubtAnswer,
  useDeleteDoubt,
  type Doubt, 
  type DoubtReply 
} from '@/hooks/useInstructorData';

const getStatusConfig = (status: Doubt['status']) => {
  switch (status) {
    case 'pending':
      return { color: 'bg-amber-500', text: 'text-amber-500', label: 'Pending', bg: 'bg-amber-500/10' };
    case 'answered':
      return { color: 'bg-blue-500', text: 'text-blue-500', label: 'Answered', bg: 'bg-blue-500/10' };
    case 'solved':
      return { color: 'bg-green-500', text: 'text-green-500', label: 'Solved', bg: 'bg-green-500/10' };
  }
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

function DoubtCard({ 
  doubt, 
  onReply, 
  onMarkSolved, 
  onPinAnswer,
  onDelete 
}: { 
  doubt: Doubt;
  onReply: (doubtId: string) => void;
  onMarkSolved: (doubtId: string) => void;
  onPinAnswer: (doubtId: string, replyId: string) => void;
  onDelete: (doubtId: string) => void;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const status = getStatusConfig(doubt.status);
  
  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await onReply(doubt.id);
      setReplyText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-slate-100 rounded-2xl bg-white hover:border-primary/20 hover:shadow-md transition-all duration-300"
    >
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Avatar className="h-12 w-12 border border-slate-100 shadow-sm shrink-0">
              <AvatarFallback className="bg-primary/5 text-primary font-bold">
                {doubt.student_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="md:hidden flex-1">
              <p className="font-bold text-slate-900 text-sm">{doubt.student_name || 'Student'}</p>
              <span className="text-xs text-slate-500">{formatTimeAgo(doubt.created_at)}</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-between md:justify-start gap-2 mb-1 hidden md:flex">
              <p className="font-bold text-slate-900 text-sm md:text-base">{doubt.student_name || 'Student'}</p>
              <span className="text-xs text-slate-400 font-medium">{formatTimeAgo(doubt.created_at)}</span>
              <Badge variant="secondary" className={`${status.bg} ${status.text} text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border-none ml-2`}>
                {status.label}
              </Badge>
              {doubt.is_pinned && (
                <Badge variant="outline" className="gap-1 text-[10px] uppercase font-bold text-primary border-primary/20">
                  <Pin className="w-3 h-3" /> Pinned
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between md:hidden mb-3">
              <p className="text-xs text-slate-500 font-medium truncate">{doubt.student_email}</p>
              <Badge variant="secondary" className={`${status.bg} ${status.text} text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border-none shrink-0`}>
                {status.label}
              </Badge>
            </div>
            
            <p className="text-xs text-slate-500 font-medium truncate hidden md:block">{doubt.student_email}</p>
            
            <div className="mt-3 p-3 rounded-lg bg-muted/50">
              <p className="text-sm font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                {doubt.question}
              </p>
              {doubt.video_title && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Related to: {doubt.video_title}
                </p>
              )}
            </div>

            {doubt.replies && doubt.replies.length > 0 && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="gap-1 text-xs"
                >
                  {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {doubt.replies.length} {doubt.replies.length === 1 ? 'reply' : 'replies'}
                </Button>

                {showReplies && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-primary/20">
                    {doubt.replies.map((reply) => (
                      <div 
                        key={reply.id} 
                        className={`p-3 rounded-lg ${reply.is_pinned ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {reply.is_instructor ? (
                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                              Instructor
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Student</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.created_at)}</span>
                          {reply.is_pinned && (
                            <span className="flex items-center gap-1 text-xs text-primary">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{reply.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between sm:justify-start gap-2 flex-wrap sm:flex-nowrap">
              <Button
                variant="outline"
                onClick={() => onReply(doubt.id)}
                className="gap-2 h-10 w-full sm:w-auto font-bold rounded-xl"
              >
                <Reply className="w-4 h-4" />
                Reply
              </Button>
              
              {doubt.status !== 'solved' && (
                <Button
                  variant="outline"
                  onClick={() => onMarkSolved(doubt.id)}
                  className="gap-2 h-10 flex-1 sm:w-auto font-bold rounded-xl bg-slate-50 text-slate-600 hover:text-green-600 hover:bg-green-50 border-transparent transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Solved
                </Button>
              )}

              {doubt.replies && doubt.replies.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    const unpinnedReply = doubt.replies?.find(r => !r.is_pinned);
                    if (unpinnedReply) onPinAnswer(doubt.id, unpinnedReply.id);
                  }}
                  className="gap-2 h-10 flex-1 sm:w-auto font-bold rounded-xl hover:text-primary transition-colors"
                >
                  <Pin className="w-4 h-4" />
                  Pin Answer
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 sm:ml-auto p-0 rounded-xl hover:bg-slate-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-rose-600 cursor-pointer font-bold hover:bg-rose-50 hover:text-rose-700 focus:text-rose-700 focus:bg-rose-50 rounded-lg transition-colors"
                    onClick={() => onDelete(doubt.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Doubt
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DoubtManager() {
  const { toast } = useToast();
  const { data: playlists } = useInstructorPlaylists();
  const { data: doubts, isLoading, refetch } = useDoubts();
  const replyToDoubt = useReplyToDoubt();
  const markSolved = useMarkDoubtSolved();
  const pinAnswer = usePinDoubtAnswer();
  const deleteDoubt = useDeleteDoubt();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredDoubts = useMemo(() => {
    if (!doubts) return [];
    
    return doubts.filter(doubt => {
      const matchesSearch = 
        doubt.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doubt.student_email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || doubt.status === statusFilter;
      const matchesCourse = courseFilter === 'all' || doubt.playlist_id === courseFilter;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [doubts, searchQuery, statusFilter, courseFilter]);

  const stats = useMemo(() => {
    if (!doubts) return { pending: 0, answered: 0, solved: 0 };
    return {
      pending: doubts.filter(d => d.status === 'pending').length,
      answered: doubts.filter(d => d.status === 'answered').length,
      solved: doubts.filter(d => d.status === 'solved').length,
    };
  }, [doubts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({ title: 'Doubts refreshed' });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReply = async (doubtId: string) => {
    if (!replyText.trim() || !selectedDoubt) return;
    try {
      await replyToDoubt.mutateAsync({
        doubt_id: doubtId,
        answer: replyText,
        is_instructor: true
      });
      setReplyDialogOpen(false);
      setReplyText('');
      setSelectedDoubt(null);
      toast({ title: 'Reply posted successfully' });
    } catch (error) {
      toast({ title: 'Failed to post reply', variant: 'destructive' });
    }
  };

  const handleMarkSolved = async (doubtId: string) => {
    try {
      await markSolved.mutateAsync(doubtId);
      toast({ title: 'Doubt marked as solved' });
    } catch (error) {
      toast({ title: 'Failed to mark as solved', variant: 'destructive' });
    }
  };

  const handlePinAnswer = async (doubtId: string, replyId: string) => {
    try {
      await pinAnswer.mutateAsync({ doubt_id: doubtId, reply_id: replyId });
      toast({ title: 'Answer pinned' });
    } catch (error) {
      toast({ title: 'Failed to pin answer', variant: 'destructive' });
    }
  };

  const handleDelete = async (doubtId: string) => {
    try {
      await deleteDoubt.mutateAsync(doubtId);
      toast({ title: 'Doubt deleted', variant: 'destructive' });
    } catch (error) {
      toast({ title: 'Failed to delete doubt', variant: 'destructive' });
    }
  };

  const openReplyDialog = (doubt: Doubt) => {
    setSelectedDoubt(doubt);
    setReplyText('');
    setReplyDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Doubts & Q&A</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student questions and provide answers
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2 w-full sm:w-auto h-11 px-6 rounded-xl font-bold"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className={`cursor-pointer transition-all ${statusFilter === 'pending' ? 'ring-2 ring-amber-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between" onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${statusFilter === 'answered' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between" onClick={() => setStatusFilter(statusFilter === 'answered' ? 'all' : 'answered')}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.answered}</p>
                  <p className="text-xs text-muted-foreground">Answered</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${statusFilter === 'solved' ? 'ring-2 ring-green-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between" onClick={() => setStatusFilter(statusFilter === 'solved' ? 'all' : 'solved')}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.solved}</p>
                  <p className="text-xs text-muted-foreground">Solved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                All Doubts
                <Badge className="bg-primary/10 text-primary border-none font-bold py-0.5">{filteredDoubts.length}</Badge>
              </CardTitle>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search doubts by keyword or student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-slate-50/50 border-slate-200 rounded-xl w-full focus-visible:ring-primary/20 text-sm font-medium"
                />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full md:w-[220px] h-11 bg-slate-50/50 border-slate-200 rounded-xl font-medium text-slate-600 focus:ring-primary/20">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all" className="font-bold cursor-pointer hover:bg-slate-50">All Courses</SelectItem>
                  {playlists?.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id} className="font-bold cursor-pointer hover:bg-slate-50">
                      {playlist.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 bg-slate-50/30">
          <ScrollArea className="h-[600px] pr-2">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredDoubts.length > 0 ? (
                filteredDoubts.map((doubt) => (
                  <DoubtCard
                    key={doubt.id}
                    doubt={doubt}
                    onReply={(id) => openReplyDialog(doubt)}
                    onMarkSolved={handleMarkSolved}
                    onPinAnswer={handlePinAnswer}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="w-10 h-10 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No doubts found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery || statusFilter !== 'all' || courseFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Students will ask doubts once they enroll in your courses'}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to Doubt</DialogTitle>
            <DialogDescription>
              Provide an answer to the student's question.
            </DialogDescription>
          </DialogHeader>
          {selectedDoubt && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">Question:</p>
                <p className="text-sm text-muted-foreground">{selectedDoubt.question}</p>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Your Answer</label>
                <Textarea
                  placeholder="Type your answer here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleReply(selectedDoubt?.id || '')} 
              disabled={!replyText.trim() || replyToDoubt.isPending}
              className="gap-2"
            >
              {replyToDoubt.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Post Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
