import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string | null;
  thumbnail_url: string | null;
  instructor_id: string | null;
  created_at: string | null;
}

export interface CourseTopic {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_completed: boolean;
  completed_at: string | null;
  duration_minutes: number;
}

export interface CourseVideo {
  id: string;
  course_id: string;
  topic_id: string | null;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration_seconds: number;
  order_index: number;
  is_published: boolean;
}

export interface CourseResource {
  id: string;
  course_id: string;
  topic_id: string | null;
  title: string;
  description: string | null;
  resource_type: string;
  file_url: string;
  file_size_bytes: number;
  order_index: number;
}

export interface CourseTimeline {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  milestone_type: string;
  scheduled_date: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface CourseAnnouncement {
  id: string;
  course_id: string;
  instructor_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string | null;
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

export function useInstructorCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['instructor-courses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return fetchWithAuth('/instructor/courses');
    },
    enabled: !!user?.id,
  });
}

export function useTopics(courseId: string | null) {
  return useQuery({
    queryKey: ['course-topics', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      return fetchWithAuth(`/courses/${courseId}/topics`);
    },
    enabled: !!courseId,
  });
}

export function useVideos(courseId: string | null) {
  return useQuery({
    queryKey: ['course-videos', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      return fetchWithAuth(`/courses/${courseId}/videos`);
    },
    enabled: !!courseId,
  });
}

export function useResources(courseId: string | null) {
  return useQuery({
    queryKey: ['course-resources', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      return fetchWithAuth(`/courses/${courseId}/resources`);
    },
    enabled: !!courseId,
  });
}

export function useTimeline(courseId: string | null) {
  return useQuery({
    queryKey: ['course-timeline', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      return fetchWithAuth(`/courses/${courseId}/timeline`);
    },
    enabled: !!courseId,
  });
}

export function useAnnouncements(courseId: string | null) {
  return useQuery({
    queryKey: ['course-announcements', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      return fetchWithAuth(`/courses/${courseId}/announcements`);
    },
    enabled: !!courseId,
  });
}

// Mutations
export function useCreateTopic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (topic: Omit<CourseTopic, 'id' | 'is_completed' | 'completed_at'>) => {
      return fetchWithAuth(`/courses/${topic.course_id}/topics`, {
        method: 'POST',
        body: JSON.stringify(topic)
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-topics', variables.course_id] });
      toast({ title: 'Topic created successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating topic', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CourseTopic> & { id: string; course_id: string }) => {
      return fetchWithAuth(`/topics/${id}`, { // Assuming direct resource access or use nested route if preferred
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['course-topics', data.course_id] });
      toast({ title: 'Topic updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating topic', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      await fetchWithAuth(`/topics/${id}`, { method: 'DELETE' });
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({ queryKey: ['course-topics', courseId] });
      toast({ title: 'Topic deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting topic', description: error.message, variant: 'destructive' });
    },
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (video: Omit<CourseVideo, 'id'>) => {
      return fetchWithAuth(`/courses/${video.course_id}/videos`, {
        method: 'POST',
        body: JSON.stringify(video)
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-videos', variables.course_id] });
      toast({ title: 'Video added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding video', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      await fetchWithAuth(`/videos/${id}`, { method: 'DELETE' });
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({ queryKey: ['course-videos', courseId] });
      toast({ title: 'Video deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting video', description: error.message, variant: 'destructive' });
    },
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (resource: Omit<CourseResource, 'id'>) => {
      return fetchWithAuth(`/courses/${resource.course_id}/resources`, {
        method: 'POST',
        body: JSON.stringify(resource)
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-resources', variables.course_id] });
      toast({ title: 'Resource added successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding resource', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      await fetchWithAuth(`/resources/${id}`, { method: 'DELETE' });
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({ queryKey: ['course-resources', courseId] });
      toast({ title: 'Resource deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting resource', description: error.message, variant: 'destructive' });
    },
  });
}

export function useCreateTimeline() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (timeline: Omit<CourseTimeline, 'id' | 'is_completed' | 'completed_at'>) => {
      return fetchWithAuth(`/courses/${timeline.course_id}/timeline`, {
        method: 'POST',
        body: JSON.stringify(timeline)
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-timeline', variables.course_id] });
      toast({ title: 'Timeline milestone added' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding milestone', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteTimeline() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      await fetchWithAuth(`/timeline/${id}`, { method: 'DELETE' });
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({ queryKey: ['course-timeline', courseId] });
      toast({ title: 'Milestone deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting milestone', description: error.message, variant: 'destructive' });
    },
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (announcement: Omit<CourseAnnouncement, 'id' | 'created_at'>) => {
      return fetchWithAuth(`/courses/${announcement.course_id}/announcements`, {
        method: 'POST',
        body: JSON.stringify(announcement)
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-announcements', variables.course_id] });
      toast({ title: 'Announcement posted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error posting announcement', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      await fetchWithAuth(`/announcements/${id}`, { method: 'DELETE' });
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.invalidateQueries({ queryKey: ['course-announcements', courseId] });
      toast({ title: 'Announcement deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting announcement', description: error.message, variant: 'destructive' });
    },
  });
}

// File upload helpers
export async function uploadVideo(file: File, courseId: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_URL}/upload/course-videos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Upload failed');
  }

  const data = await res.json();
  return data.url;
}

export async function uploadResource(file: File, courseId: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_URL}/upload/course-resources`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Upload failed');
  }

  const data = await res.json();
  return data.url;
}
