import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  options: Record<string, string> | string[];
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
  badges: string[] | null;
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
  difficulty_mix: Record<string, number>;
  is_active: boolean | null;
  created_by: string;
}

const API_URL = 'http://localhost:5000/api';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${url}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'API Request Failed');
  }
  return res.json();
};

// Exams
export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      // order by scheduled_date ascending
      return fetchWithAuth('/data/exams?sort=scheduled_date&order=asc');
    },
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (exam: Omit<Exam, 'id' | 'created_at'>) => {
      return fetchWithAuth('/data/exams', {
        method: 'POST',
        body: JSON.stringify(exam)
      });
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
      return fetchWithAuth(`/data/exams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
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
      await fetchWithAuth(`/data/exams/${id}`, { method: 'DELETE' });
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
      return fetchWithAuth('/data/question_bank?sort=created_at&order=desc');
    },
  });
}

export function useQuestionsByTopic() {
  const { data: questions = [] } = useQuestions();

  const grouped = questions.reduce((acc: Record<string, { easy: number; medium: number; hard: number; total: number }>, q: Question) => {
    if (!acc[q.topic]) {
      acc[q.topic] = { easy: 0, medium: 0, hard: 0, total: 0 };
    }
    const difficulty = q.difficulty as 'easy' | 'medium' | 'hard';
    if (acc[q.topic][difficulty] !== undefined) {
      acc[q.topic][difficulty]++;
    }
    acc[q.topic].total++;
    return acc;
  }, {} as Record<string, { easy: number; medium: number; hard: number; total: number }>);

  return Object.entries(grouped).map(([topic, stats]) => {
    // Explicitly cast to ensure TS knows it's an object
    const typedStats = stats as { easy: number; medium: number; hard: number; total: number };
    return {
      topic,
      ...typedStats,
    };
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (question: Omit<Question, 'id'>) => {
      return fetchWithAuth('/data/question_bank', {
        method: 'POST',
        body: JSON.stringify(question)
      });
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
      await fetchWithAuth(`/data/question_bank/${id}`, { method: 'DELETE' });
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
      return fetchWithAuth('/data/leaderboard?sort=total_score&order=desc');
    },
  });
}

export function useVerifyLeaderboardEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, verified_by }: { id: string; verified_by: string }) => {
      return fetchWithAuth(`/data/leaderboard/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_verified: true, verified_by, verified_at: new Date().toISOString() })
      });
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
      return fetchWithAuth('/data/guest_credentials?sort=created_at&order=desc');
    },
  });
}

export function useCreateGuestCredential() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credential: Omit<GuestCredential, 'id' | 'last_login_at'>) => {
      return fetchWithAuth('/data/guest_credentials', {
        method: 'POST',
        body: JSON.stringify(credential)
      });
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
      await fetchWithAuth(`/data/guest_credentials/${id}`, { method: 'DELETE' });
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
      return fetchWithAuth('/data/mock_test_configs?sort=created_at&order=desc');
    },
  });
}

export function useCreateMockTestConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (config: Omit<MockTestConfig, 'id'>) => {
      return fetchWithAuth('/data/mock_test_configs', {
        method: 'POST',
        body: JSON.stringify(config)
      });
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
      await fetchWithAuth(`/data/mock_test_configs/${id}`, { method: 'DELETE' });
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
// Use plain fetch call as originally implemented
export function useExamResults(examId?: string) {
  return useQuery({
    queryKey: ['exam-results', examId],
    queryFn: async () => {
      // Filter logic is slightly specialized, but we can do simple filter via query params if we supported it
      // Or filtering on client side if data set is small
      // My generic endpoint only supports sort and limit.
      // For specific filtering, we may need to fetch all or add filter support to server.js
      // For now, let's fetch all Exam Results and filter on client if examId is provided
      // This is not efficient for production but sufficient for migration
      const data = await fetchWithAuth('/data/student_exam_results?sort=completed_at&order=desc');
      if (examId) {
        return data.filter((d: { exam_id: string }) => d.exam_id === examId);
      }
      return data;
    },
  });
}
