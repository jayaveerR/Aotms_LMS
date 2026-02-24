import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle,
  CheckCircle,
  Circle,
  ChevronLeft,
  Menu,
  MessageSquare,
  FileText,
  Download,
  Play,
  ShieldAlert,
  ListVideo,
  Clock,
  Loader2,
  Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/hooks/useCourses";

const API_URL = "http://localhost:5000/api";

/* ── Types ────────────────────────────────────────── */
export interface Video {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  duration_minutes: number;
  order_index: number;
  topic_id?: string;
  is_completed?: boolean; // Managed locally or via progress table
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  videos: Video[];
}

export interface Resource {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
}

/* ── Mock Data Fallback ───────────────────────────── */
const MOCK_TOPICS: Topic[] = [
  {
    id: "t1",
    title: "Module 1: Getting Started",
    order_index: 0,
    videos: [
      {
        id: "v1",
        title: "Introduction to the Course",
        duration_minutes: 5,
        video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
        order_index: 0,
        is_completed: true,
      },
      {
        id: "v2",
        title: "Setting Up Your Environment",
        duration_minutes: 12,
        video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
        order_index: 1,
        is_completed: false,
      },
    ],
  },
  {
    id: "t2",
    title: "Module 2: Core Concepts",
    order_index: 1,
    videos: [
      {
        id: "v3",
        title: "Understanding the Architecture",
        duration_minutes: 18,
        video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
        order_index: 0,
      },
      {
        id: "v4",
        title: "Building Your First Component",
        duration_minutes: 25,
        video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
        order_index: 1,
      },
      {
        id: "v5",
        title: "State & Props Deep Dive",
        duration_minutes: 30,
        video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
        order_index: 2,
      },
    ],
  },
];

const MOCK_RESOURCES: Resource[] = [
  { id: "r1", title: "Course Syllabus", file_url: "#", file_type: "PDF" },
  { id: "r2", title: "Starter Code Template", file_url: "#", file_type: "ZIP" },
];

/* ── Main Component ───────────────────────────────── */
export default function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Player state
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"content" | "resources" | "qna">(
    "content",
  );

  // Load course content
  useEffect(() => {
    let mounted = true;
    const loadContent = async () => {
      const token = localStorage.getItem("access_token");
      if (!courseId) return;

      try {
        setLoading(true);

        // Fetch course info
        const cRes = await fetch(`${API_URL}/data/courses`);
        if (cRes.ok) {
          const courses: Course[] = await cRes.json();
          const target = courses.find((c) => c.id === courseId);
          if (target) setCourse(target);
        }

        // Fetch topics and videos
        if (token) {
          const tRes = await fetch(`${API_URL}/courses/${courseId}/topics`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const vRes = await fetch(`${API_URL}/courses/${courseId}/videos`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const rRes = await fetch(`${API_URL}/courses/${courseId}/resources`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          let loadedTopics: any[] = [];
          let loadedVideos: any[] = [];

          if (tRes.ok) loadedTopics = await tRes.json();
          if (vRes.ok) loadedVideos = await vRes.json();
          if (rRes.ok) setResources(await rRes.json());

          if (loadedTopics.length > 0 && loadedVideos.length > 0) {
            // Map videos to topics
            const grouped = loadedTopics
              .map((t) => ({
                ...t,
                videos: loadedVideos
                  .filter((v) => v.topic_id === t.id)
                  .sort((a, b) => a.order_index - b.order_index),
              }))
              .sort((a, b) => a.order_index - b.order_index);
            setTopics(grouped);
          } else {
            // Fallback to mock data if empty
            setTopics(MOCK_TOPICS);
            setResources(MOCK_RESOURCES);
          }
        } else {
          setTopics(MOCK_TOPICS);
          setResources(MOCK_RESOURCES);
        }
      } catch (err) {
        console.error(err);
        setTopics(MOCK_TOPICS);
        setResources(MOCK_RESOURCES);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadContent();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  // Set default active video once loaded
  useEffect(() => {
    if (!activeVideo && topics.length > 0 && topics[0].videos.length > 0) {
      setActiveVideo(topics[0].videos[0]);
    }
  }, [topics, activeVideo]);

  const toggleVideoCompletion = (video: Video, e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic UI update
    setTopics((prev) =>
      prev.map((t) => ({
        ...t,
        videos: t.videos.map((v) =>
          v.id === video.id ? { ...v, is_completed: !v.is_completed } : v,
        ),
      })),
    );
    toast({
      title: !video.is_completed
        ? "Marked as completed"
        : "Marked as incomplete",
      description: video.title,
    });
    // In prod: await fetch('/api/data/instructor_progress', { method: 'POST', body... })
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;
    topics.forEach((t) => {
      total += t.videos.length;
      completed += t.videos.filter((v) => v.is_completed).length;
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9E9E9] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#0075CF] animate-spin mb-4" />
        <h2 className="text-xl font-black text-[#000000]">
          Loading Course Editor...
        </h2>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="h-screen bg-[#E9E9E9] flex flex-col overflow-hidden font-['Inter']">
      {/* ── HEADER ── */}
      <header className="h-16 bg-[#000000] border-b-2 border-[#FD5A1A] flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-white font-black text-sm sm:text-base truncate">
              {course?.title || "Loading Course..."}
            </h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">
                {activeVideo?.title || "Select a topic"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Progress ring mini */}
          <div className="hidden sm:flex items-center gap-2">
            <svg className="w-6 h-6 -rotate-90">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#0075CF"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 10}`}
                strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                className="transition-all duration-500 rounded-full"
              />
            </svg>
            <span className="text-white text-xs font-black">{progress}%</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-[#000000] border-2 border-white shadow-[2px_2px_0px_0px_rgba(253,90,26,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_rgba(253,90,26,1)] transition-all md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* PLAYER AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Video wrapper */}
          <div className="relative w-full aspect-video bg-[#000000] border-b-2 border-[#000000] flex shrink-0 group">
            {activeVideo ? (
              <video
                key={activeVideo.id}
                src={activeVideo.video_url}
                controls
                controlsList="nodownload"
                className="w-full h-full outline-none"
                poster={`https://source.unsplash.com/random/1280x720/?technology&sig=${activeVideo.id}`} // Dummy poster
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
                <PlayCircle className="w-16 h-16 mb-2 opacity-50" />
                <p className="font-bold">Select a lesson to begin</p>
              </div>
            )}

            {/* Brutalist overlay badge (visible briefly or on hover if custom controls built) */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-[#FD5A1A] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-[#000000] rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Playing
              </span>
            </div>
          </div>

          {/* Under-video tabs */}
          <div className="flex border-b-2 border-[#000000] bg-[#E9E9E9]">
            {[
              { id: "content", icon: ListVideo, label: "Content" },
              { id: "resources", icon: Download, label: "Resources" },
              { id: "qna", icon: MessageSquare, label: "Q&A" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-black border-r-2 border-[#000000] last:border-r-0 transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-[#0075CF] border-b-4 border-b-[#0075CF] -mb-[2px]"
                    : "bg-[#E9E9E9] text-[#000000]/60 hover:bg-white hover:text-[#000000]"
                }`}
              >
                <tab.icon className="w-4 h-4" />{" "}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* RESOURCES TAB */}
                {activeTab === "resources" && (
                  <div>
                    <h2 className="text-xl font-black text-[#000000] mb-4">
                      Course Resources
                    </h2>
                    {resources.length === 0 ? (
                      <p className="text-sm text-[#000000]/60 p-4 border-2 border-dashed border-[#000000]/20 rounded-xl text-center">
                        No resources attached to this course.
                      </p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {resources.map((res) => (
                          <a
                            key={res.id}
                            href={res.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center p-4 border-2 border-[#000000] rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,117,207,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#E9E9E9] border-2 border-[#000000] flex items-center justify-center mr-3 shrink-0">
                              <FileText className="w-5 h-5 text-[#0075CF]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-black text-[#000000] text-sm truncate group-hover:text-[#0075CF] transition-colors">
                                {res.title}
                              </h4>
                              <p className="text-[10px] font-bold text-[#000000]/50 uppercase">
                                {res.file_type}
                              </p>
                            </div>
                            <Download className="w-5 h-5 text-[#000000] opacity-50 group-hover:opacity-100" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Q&A TAB */}
                {activeTab === "qna" && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-[#E9E9E9] border-2 border-[#000000] rounded-2xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <MessageSquare className="w-8 h-8 text-[#000000]/30" />
                    </div>
                    <h3 className="font-black text-lg text-[#000000] mb-2">
                      Q&A Disabled
                    </h3>
                    <p className="text-sm text-[#000000]/60 max-w-xs">
                      The instructor has disabled the public Q&A wall for this
                      course.
                    </p>
                  </div>
                )}

                {/* OVERVIEW / CONTENT TAB (Fallback if on Mobile and Sidebar closed) */}
                {activeTab === "content" && (
                  <div className="max-w-3xl">
                    <h2 className="text-2xl font-black text-[#000000] mb-2">
                      {activeVideo?.title || "Course Overview"}
                    </h2>
                    <div className="flex items-center gap-4 text-xs font-bold text-[#000000]/60 mb-6">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />{" "}
                        {activeVideo?.duration_minutes || 0} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <PlayCircle className="w-4 h-4" /> Video Lesson
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none text-[#000000]/80 border-t-2 border-[#E9E9E9] pt-6">
                      <p>
                        {activeVideo?.description ||
                          course?.description ||
                          "No detailed description provided for this lesson."}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* SIDEBAR NAVIGATION */}
        <AnimatePresence initial={false}>
          {(sidebarOpen || window.innerWidth > 768) && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute md:relative right-0 top-0 bottom-0 bg-white border-l-2 border-[#000000] z-30 flex flex-col shrink-0 overflow-hidden shadow-[-8px_0px_0px_0px_rgba(0,0,0,0.1)] md:shadow-none`}
            >
              {/* Sidebar Header */}
              <div className="p-4 bg-[#E9E9E9] border-b-2 border-[#000000] flex items-center justify-between shrink-0">
                <h3 className="font-black text-sm uppercase tracking-widest text-[#000000]">
                  Course Content
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg border-2 border-[#000000] bg-white text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Topics List */}
              <div className="flex-1 overflow-y-auto w-full">
                {topics.map((topic, tIdx) => (
                  <div key={topic.id} className="border-b-2 border-[#E9E9E9]">
                    {/* Topic Header */}
                    <div className="px-4 py-3 bg-white w-full text-left">
                      <p className="text-[10px] font-black text-[#0075CF] uppercase tracking-widest mb-1">
                        Module {tIdx + 1}
                      </p>
                      <h4 className="font-black text-sm text-[#000000] leading-tight">
                        {topic.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-[#000000]/50 uppercase">
                        <span>{topic.videos.length} lessons</span>
                      </div>
                    </div>

                    {/* Videos */}
                    <div className="flex flex-col bg-[#E9E9E9]/30 py-1">
                      {topic.videos.map((vid, vIdx) => {
                        const isActive = activeVideo?.id === vid.id;
                        return (
                          <button
                            key={vid.id}
                            onClick={() => {
                              setActiveVideo(vid);
                              if (window.innerWidth < 768)
                                setSidebarOpen(false);
                            }}
                            className={`flex items-start gap-3 w-full text-left px-4 py-3 border-l-4 transition-all ${
                              isActive
                                ? "border-[#0075CF] bg-white shadow-sm"
                                : "border-transparent hover:bg-[#E9E9E9]"
                            }`}
                          >
                            {/* Status Icon */}
                            <div
                              className="shrink-0 pt-0.5"
                              onClick={(e) => toggleVideoCompletion(vid, e)}
                            >
                              {vid.is_completed ? (
                                <CheckCircle className="w-5 h-5 text-[#0075CF] transition-transform hover:scale-110" />
                              ) : (
                                <Circle className="w-5 h-5 text-[#000000]/30 hover:text-[#000000] transition-colors" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm leading-snug truncate mb-1 ${isActive ? "font-black text-[#0075CF]" : "font-bold text-[#000000]/80"}`}
                              >
                                {vIdx + 1}. {vid.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#000000]/50">
                                <Play className="w-3 h-3" />{" "}
                                {vid.duration_minutes} min
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-[#000000]/50 backdrop-blur-sm z-20 md:hidden"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
