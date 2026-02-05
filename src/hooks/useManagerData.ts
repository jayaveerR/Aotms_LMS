import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Exam {
  id: string;
  course_id: string | null;
  title: string;
  description: string | null;
  exam_type: string;
  scheduled_date: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number | null;
  negative_marking: number | null;
  max_attempts: number | null;
  shuffle_questions: boolean | null;
  show_results: boolean | null;
  proctoring_enabled: boolean | null;
  status: string | null;
  created_by: string;
  created_at: string | null;
}

export interface Question {
  id: string;
  topic: string;
  question_text: string;
  question_type: string;
  difficulty: string;
  options: any;
  correct_answer: string;
  explanation: string | null;
  marks: number | null;
  created_by: string;
}

export interface LeaderboardEntry {
  id: string;
  student_id: string;
  student_name: string;
  total_score: number | null;
  exams_completed: number | null;
  average_percentage: number | null;
  rank: number | null;
  badges: any;
  is_verified: boolean | null;
}

export interface GuestCredential {
  id: string;
  username: string;
  password_hash: string;
  display_name: string;
  access_level: string;
  expires_at: string;
  max_sessions: number | null;
  allowed_courses: string[] | null;
  is_active: boolean | null;
  last_login_at: string | null;
  created_by: string;
}

export interface MockTestConfig {
  id: string;
  title: string;
  description: string | null;
  course_id: string | null;
  topics: string[];
  question_count: number;
  duration_minutes: number;
  difficulty_mix: any;
  is_active: boolean | null;
  created_by: string;
}

// Exams
export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data as Exam[];
    },
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exam: Omit<Exam, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('exams')
        .insert(exam)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast({ title: 'Exam scheduled successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error scheduling exam', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Exam> & { id: string }) => {
      const { data, error } = await supabase
        .from('exams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast({ title: 'Exam updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating exam', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('exams').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast({ title: 'Exam deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting exam', description: error.message, variant: 'destructive' });
    },
  });
}

// Questions
export function useQuestions() {
  return useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Question[];
    },
  });
}

export function useQuestionsByTopic() {
  const { data: questions = [] } = useQuestions();
  
  const grouped = questions.reduce((acc, q) => {
    if (!acc[q.topic]) {
      acc[q.topic] = { easy: 0, medium: 0, hard: 0, total: 0 };
    }
    acc[q.topic][q.difficulty as 'easy' | 'medium' | 'hard']++;
    acc[q.topic].total++;
    return acc;
  }, {} as Record<string, { easy: number; medium: number; hard: number; total: number }>);

  return Object.entries(grouped).map(([topic, stats]) => ({
    topic,
    ...stats,
  }));
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (question: Omit<Question, 'id'>) => {
      const { data, error } = await supabase
        .from('question_bank')
        .insert(question)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Question added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding question', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('question_bank').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Question deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting question', description: error.message, variant: 'destructive' });
    },
  });
}

// Leaderboard
export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_score', { ascending: false });

      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });
}

export function useVerifyLeaderboardEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, verified_by }: { id: string; verified_by: string }) => {
      const { data, error } = await supabase
        .from('leaderboard')
        .update({ is_verified: true, verified_by, verified_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast({ title: 'Leaderboard entry verified' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error verifying entry', description: error.message, variant: 'destructive' });
    },
  });
}

// Guest Credentials
export function useGuestCredentials() {
  return useQuery({
    queryKey: ['guest-credentials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_credentials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GuestCredential[];
    },
  });
}

export function useCreateGuestCredential() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credential: Omit<GuestCredential, 'id' | 'last_login_at'>) => {
      const { data, error } = await supabase
        .from('guest_credentials')
        .insert(credential)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-credentials'] });
      toast({ title: 'Guest credential created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating credential', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteGuestCredential() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('guest_credentials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-credentials'] });
      toast({ title: 'Guest credential deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting credential', description: error.message, variant: 'destructive' });
    },
  });
}

// Mock Test Configs
export function useMockTestConfigs() {
  return useQuery({
    queryKey: ['mock-test-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mock_test_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MockTestConfig[];
    },
  });
}

export function useCreateMockTestConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (config: Omit<MockTestConfig, 'id'>) => {
      const { data, error } = await supabase
        .from('mock_test_configs')
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mock-test-configs'] });
      toast({ title: 'Mock test configured successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error configuring mock test', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteMockTestConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('mock_test_configs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mock-test-configs'] });
      toast({ title: 'Mock test config deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting config', description: error.message, variant: 'destructive' });
    },
  });
}

// Student Exam Results (for monitoring)
export function useExamResults(examId?: string) {
  return useQuery({
    queryKey: ['exam-results', examId],
    queryFn: async () => {
      let query = supabase.from('student_exam_results').select('*');
      if (examId) {
        query = query.eq('exam_id', examId);
      }
      const { data, error } = await query.order('completed_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
