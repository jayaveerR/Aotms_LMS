import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

export function useInstructorCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['instructor-courses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
    enabled: !!user?.id,
  });
}

export function useTopics(courseId: string | null) {
  return useQuery({
    queryKey: ['course-topics', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from('course_topics')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as CourseTopic[];
    },
    enabled: !!courseId,
  });
}

export function useVideos(courseId: string | null) {
  return useQuery({
    queryKey: ['course-videos', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from('course_videos')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as CourseVideo[];
    },
    enabled: !!courseId,
  });
}

export function useResources(courseId: string | null) {
  return useQuery({
    queryKey: ['course-resources', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from('course_resources')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as CourseResource[];
    },
    enabled: !!courseId,
  });
}

export function useTimeline(courseId: string | null) {
  return useQuery({
    queryKey: ['course-timeline', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from('course_timeline')
        .select('*')
        .eq('course_id', courseId)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data as CourseTimeline[];
    },
    enabled: !!courseId,
  });
}

export function useAnnouncements(courseId: string | null) {
  return useQuery({
    queryKey: ['course-announcements', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from('course_announcements')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CourseAnnouncement[];
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
      const { data, error } = await supabase
        .from('course_topics')
        .insert(topic)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('course_topics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('course_topics')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('course_videos')
        .insert(video)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('course_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('course_resources')
        .insert(resource)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('course_resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('course_timeline')
        .insert(timeline)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('course_timeline')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('course_announcements')
        .insert(announcement)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('course_announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
  const fileExt = file.name.split('.').pop();
  const fileName = `${courseId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('course-videos')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('course-videos')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function uploadResource(file: File, courseId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${courseId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('course-resources')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('course-resources')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
