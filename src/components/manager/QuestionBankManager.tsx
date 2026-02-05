import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuestions, useCreateQuestion, useDeleteQuestion } from '@/hooks/useManagerData';
import { useAuth } from '@/hooks/useAuth';
import { Plus, FileQuestion, Trash2, Search, Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

export function QuestionBankManager() {
  const { user } = useAuth();
  const { data: questions = [], isLoading } = useQuestions();
  const createQuestion = useCreateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [newQuestion, setNewQuestion] = useState({
    topic: '',
    question_text: '',
    question_type: 'mcq',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    marks: 1,
  });

  const handleCreate = async () => {
    if (!newQuestion.topic.trim() || !newQuestion.question_text.trim() || !user?.id) return;
    await createQuestion.mutateAsync({
      topic: newQuestion.topic,
      question_text: newQuestion.question_text,
      question_type: newQuestion.question_type,
      difficulty: newQuestion.difficulty,
      options: newQuestion.question_type === 'mcq' ? newQuestion.options.filter(o => o.trim()) : null,
      correct_answer: newQuestion.correct_answer,
      explanation: newQuestion.explanation || null,
      marks: newQuestion.marks,
      created_by: user.id,
    });
    setNewQuestion({
      topic: '',
      question_text: '',
      question_type: 'mcq',
      difficulty: 'medium',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      marks: 1,
    });
    setIsAddOpen(false);
  };

  // Get unique topics
  const topics = [...new Set(questions.map(q => q.topic))];
  
  // Get stats by topic
  const topicStats = topics.map(topic => {
    const topicQuestions = questions.filter(q => q.topic === topic);
    return {
      topic,
      total: topicQuestions.length,
      easy: topicQuestions.filter(q => q.difficulty === 'easy').length,
      medium: topicQuestions.filter(q => q.difficulty === 'medium').length,
      hard: topicQuestions.filter(q => q.difficulty === 'hard').length,
    };
  });

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === 'all' || q.topic === filterTopic;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading questions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Question Bank</h3>
          <p className="text-sm text-muted-foreground">{questions.length} questions in the bank</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>Create a question for the question bank</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Input
                    placeholder="e.g., JavaScript"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    min={1}
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={newQuestion.question_type}
                    onValueChange={(value) => setNewQuestion({ ...newQuestion, question_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="short">Short Answer</SelectItem>
                      <SelectItem value="long">Long Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={newQuestion.difficulty}
                    onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Question</Label>
                <Textarea
                  placeholder="Enter your question..."
                  rows={3}
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                />
              </div>
              {newQuestion.question_type === 'mcq' && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {newQuestion.options.map((opt, idx) => (
                    <Input
                      key={idx}
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...newQuestion.options];
                        newOpts[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOpts });
                      }}
                    />
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <Input
                  placeholder="Enter the correct answer"
                  value={newQuestion.correct_answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Explanation (optional)</Label>
                <Textarea
                  placeholder="Explain the answer..."
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createQuestion.isPending}>
                {createQuestion.isPending ? 'Adding...' : 'Add Question'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Topic Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topicStats.slice(0, 6).map((stat) => (
          <Card key={stat.topic}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{stat.topic}</CardTitle>
                <Badge variant="outline">{stat.total}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Easy</span>
                  <span>{stat.easy}</span>
                </div>
                <Progress value={(stat.easy / stat.total) * 100} className="h-1.5" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent">Medium</span>
                  <span>{stat.medium}</span>
                </div>
                <Progress value={(stat.medium / stat.total) * 100} className="h-1.5" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-destructive">Hard</span>
                  <span>{stat.hard}</span>
                </div>
                <Progress value={(stat.hard / stat.total) * 100} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-primary" />
              All Questions
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterTopic} onValueChange={setFilterTopic}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredQuestions.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No questions found</p>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.slice(0, 10).map((q) => (
                <div key={q.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="font-medium line-clamp-2">{q.question_text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{q.topic}</Badge>
                      <Badge variant={q.difficulty === 'easy' ? 'default' : q.difficulty === 'hard' ? 'destructive' : 'secondary'}>
                        {q.difficulty}
                      </Badge>
                      <Badge variant="outline">{q.question_type}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteQuestion.mutate(q.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
