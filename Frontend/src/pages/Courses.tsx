import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpen,
  Clock,
  Users,
  Star,
  Zap,
  ChevronRight,
  X,
  CheckCircle,
  Lock,
  Layers,
  Code,
  Database,
  Cpu,
  TrendingUp,
  Shield,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCourses, useEnrollments, Course } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

/* ── Category icon map ────────────────────────────── */
const categoryIcons: Record<string, React.ElementType> = {
  "Web Development": Code,
  "Data Science": Database,
  "Cloud Computing": Cpu,
  "Digital Marketing": TrendingUp,
  Cybersecurity: Shield,
  Design: Layers,
  default: BookOpen,
};

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;
const CATEGORIES = [
  "All",
  "Web Development",
  "Data Science",
  "Cloud Computing",
  "Digital Marketing",
  "Cybersecurity",
  "Design",
];

/* ── Course Detail Modal ──────────────────────────── */
function CourseModal({
  course,
  onClose,
  onEnroll,
  isEnrolled,
  enrolling,
}: {
  course: Course;
  onClose: () => void;
  onEnroll: (id: string) => void;
  isEnrolled: boolean;
  enrolling: boolean;
}) {
  const Icon = categoryIcons[course.category ?? ""] ?? BookOpen;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#000000]/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal — bottom sheet on mobile/tablet portrait, centered card on md+ */}
        <motion.div
          className="relative z-10 w-full max-w-2xl bg-white border-t-4 md:border-4 border-[#000000] rounded-t-3xl md:rounded-2xl shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden max-h-[92vh] overflow-y-auto"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Drag handle (mobile + tablet portrait) */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1.5 bg-[#000000]/20 rounded-full" />
          </div>

          {/* Header stripe */}
          <div className="h-1.5 md:h-2 bg-[#0075CF]" />

          <div className="p-5 md:p-8">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 flex items-center justify-center border-2 border-[#000000] rounded-lg hover:bg-[#E9E9E9] active:bg-[#E9E9E9] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon + Category */}
            <div className="flex items-center gap-3 mb-4 md:mb-5 pr-12">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#0075CF] border-2 border-[#000000] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0">
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#0075CF]">
                  {course.category ?? "Course"}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border-2 border-[#000000] ${
                      course.level === "Beginner"
                        ? "bg-[#E9E9E9] text-[#000000]"
                        : course.level === "Intermediate"
                          ? "bg-[#0075CF] text-white"
                          : "bg-[#FD5A1A] text-white"
                    }`}
                  >
                    {course.level ?? "All Levels"}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-[#000000] mb-3 leading-tight">
              {course.title}
            </h2>
            <p className="text-[#000000]/70 text-sm leading-relaxed mb-5 md:mb-6">
              {course.description ?? "No description available."}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5 md:mb-6">
              {[
                {
                  icon: Clock,
                  label: "Duration",
                  value: course.duration_hours
                    ? `${course.duration_hours}h`
                    : "Self-paced",
                },
                {
                  icon: BookOpen,
                  label: "Lessons",
                  value: course.total_lessons ?? "—",
                },
                {
                  icon: Users,
                  label: "Students",
                  value: course.enrollment_count ?? "—",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center p-3 bg-[#E9E9E9] border-2 border-[#000000] rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <s.icon className="w-5 h-5 text-[#0075CF] mb-1" />
                  <span className="text-lg font-black text-[#000000]">
                    {s.value}
                  </span>
                  <span className="text-xs text-[#000000]/60">{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            {isEnrolled ? (
              <div className="flex items-center gap-3 p-4 bg-[#E9E9E9] border-2 border-[#000000] rounded-xl">
                <CheckCircle className="w-6 h-6 text-[#0075CF] shrink-0" />
                <div>
                  <p className="font-black text-[#000000]">You're enrolled!</p>
                  <p className="text-xs text-[#000000]/60">
                    Go to your dashboard to continue learning.
                  </p>
                </div>
              </div>
            ) : (
              <Button
                variant="accent"
                size="lg"
                className="w-full text-base h-12 md:h-14"
                onClick={() => onEnroll(course.id)}
                disabled={enrolling}
              >
                {enrolling ? (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-spin" /> Enrolling…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Enroll For Free
                  </span>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Course Card ─────────────────────────────────── */
function CourseCard({
  course,
  isEnrolled,
  onClick,
}: {
  course: Course;
  isEnrolled: boolean;
  onClick: () => void;
}) {
  const Icon = categoryIcons[course.category ?? ""] ?? BookOpen;
  const levelColor =
    course.level === "Beginner"
      ? "bg-[#E9E9E9] text-[#000000]"
      : course.level === "Intermediate"
        ? "bg-[#0075CF] text-white"
        : "bg-[#FD5A1A] text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, x: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="bg-white border-2 border-[#000000] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,117,207,1)] transition-shadow duration-200 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="h-36 sm:h-40 md:h-44 bg-[#E9E9E9] flex items-center justify-center relative border-b-2 border-[#000000] shrink-0">
          <Icon className="w-14 h-14 md:w-16 md:h-16 text-[#0075CF]/40" />
          {/* Category chip */}
          <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest bg-[#000000] text-white px-2.5 py-1 rounded-full">
            {course.category ?? "Course"}
          </span>
          {/* Enrolled badge */}
          {isEnrolled && (
            <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#0075CF] text-white text-[10px] font-black uppercase px-2 py-1 rounded-full border border-white">
              <CheckCircle className="w-3 h-3" /> Enrolled
            </span>
          )}
          {/* Level badge */}
          <span
            className={`absolute bottom-3 right-3 text-[10px] font-black px-2.5 py-1 rounded border-2 border-[#000000] ${levelColor}`}
          >
            {course.level ?? "All Levels"}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 flex flex-col flex-1">
          <h3 className="font-black text-[#000000] text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-[#0075CF] transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-[#000000]/60 leading-relaxed line-clamp-2 mb-3 flex-1">
            {course.description ?? "No description provided."}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-[#E9E9E9] mt-auto">
            <div className="flex items-center gap-2 text-xs text-[#000000]/60 flex-wrap">
              {course.duration_hours && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration_hours}h
                </span>
              )}
              {course.total_lessons && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {course.total_lessons} lessons
                </span>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-[#0075CF] group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Skeleton Card ───────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white border-2 border-[#E9E9E9] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-36 sm:h-40 md:h-44 bg-[#E9E9E9]" />
      <div className="p-4 md:p-5 space-y-3">
        <div className="h-4 bg-[#E9E9E9] rounded w-3/4" />
        <div className="h-3 bg-[#E9E9E9] rounded w-full" />
        <div className="h-3 bg-[#E9E9E9] rounded w-2/3" />
        <div className="h-8 bg-[#E9E9E9] rounded-xl w-full mt-2" />
      </div>
    </div>
  );
}

/* ── Empty State ─────────────────────────────────── */
function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-[#000000] rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#E9E9E9] flex items-center justify-center mb-4 sm:mb-5">
        <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-[#000000]/40" />
      </div>
      <h3 className="font-black text-lg sm:text-xl text-[#000000] mb-2">
        No courses found
      </h3>
      <p className="text-sm text-[#000000]/60 max-w-xs">
        {query
          ? `No results for "${query}". Try a different keyword or filter.`
          : "No courses available right now. Check back later!"}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN: Courses Browse Page
══════════════════════════════════════════════════ */
export default function CoursesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { courses, loading: coursesLoading } = useCourses();
  const {
    enrollments,
    enrolling,
    enroll,
    isEnrolled,
    loading: enrollLoading,
  } = useEnrollments();

  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] =
    useState<(typeof LEVELS)[number]>("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());
      const matchLevel = selectedLevel === "All" || c.level === selectedLevel;
      const matchCat =
        selectedCategory === "All" || c.category === selectedCategory;
      return matchSearch && matchLevel && matchCat;
    });
  }, [courses, search, selectedLevel, selectedCategory]);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const result = await enroll(courseId);
    toast({
      title: result.success ? "🎉 Enrolled!" : "❌ Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    if (result.success) setActiveCourse(null);
  };

  const isLoading = coursesLoading || enrollLoading;

  return (
    <div className="min-h-screen bg-white font-['Inter'] flex flex-col">
      <Header />

      {/* ── Page Header ── */}
      <div className="bg-[#E9E9E9] border-b-8 border-black pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="container-width px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border-2 border-black shadow-[4px_4px_0px_0px_#FD5A1A] text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
              <Star className="w-4 h-4 text-[#FD5A1A]" /> Browse Library
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-black leading-[0.9] uppercase italic mb-6">
              FIND YOUR <br />
              <span className="text-[#FD5A1A]">NEXT</span>{" "}
              <span className="text-[#0075CF]">SKILL</span>
            </h1>
            <p className="text-black font-bold uppercase tracking-widest text-sm max-w-2xl opacity-60">
              {enrollments.length > 0
                ? `You're currently mastering ${enrollments.length} course${enrollments.length > 1 ? "s" : ""}. Push your limits!`
                : "Explore our arsenal of high-octane courses and build the future you deserve."}
            </p>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 bg-white relative">
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

        {/* ── Desktop Sidebar + Main Content Layout ── */}
        <div className="container-width px-4 sm:px-6 md:px-8 lg:px-16 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="lg:w-72 shrink-0 space-y-8">
              <div className="sticky top-28 space-y-8">
                {/* Search Card */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black/40">
                    Search
                  </h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                    <input
                      type="text"
                      placeholder="ENTER KEYWORD..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#E9E9E9] border-2 border-black text-xs font-black uppercase tracking-widest focus:outline-none focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Level Card */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,117,207,1)]">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black/40">
                    Experience Level
                  </h4>
                  <div className="space-y-2">
                    {LEVELS.map((l) => (
                      <button
                        key={l}
                        onClick={() => setSelectedLevel(l)}
                        className={`w-full text-left px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black transition-all ${
                          selectedLevel === l
                            ? "bg-[#0075CF] text-white translate-x-1 translate-y-1 shadow-none"
                            : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Card */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(253,90,26,1)]">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black/40">
                    Technology Area
                  </h4>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black transition-all ${
                          selectedCategory === cat
                            ? "bg-[#FD5A1A] text-white translate-x-1 translate-y-1 shadow-none"
                            : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 space-y-8">
              {/* Status Bar */}
              <div className="flex items-center justify-between gap-4 p-4 border-4 border-black bg-[#E9E9E9]">
                <div className="flex items-center gap-4">
                  <div className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                    SYSTEM_STATUS: ACTIVE
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-black/60 hidden sm:block">
                    {isLoading
                      ? "SCANN_IN_PROGRESS..."
                      : `FOUND_${filtered.length}_RECORDS`}
                  </p>
                </div>
                {user && (
                  <button
                    onClick={() => navigate("/dashboard/courses")}
                    className="text-[10px] font-black uppercase tracking-widest text-[#0075CF] flex items-center gap-2 hover:bg-black hover:text-white px-3 py-1 transition-colors border-2 border-transparent hover:border-black"
                  >
                    ACCESS_ENROLLMENTS <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : filtered.length === 0 ? (
                  <EmptyState query={search} />
                ) : (
                  filtered.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isEnrolled={isEnrolled(course.id)}
                      onClick={() => setActiveCourse(course)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Detail Modal ── */}
      {activeCourse && (
        <CourseModal
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
          onEnroll={handleEnroll}
          isEnrolled={isEnrolled(activeCourse.id)}
          enrolling={enrolling === activeCourse.id}
        />
      )}
    </div>
  );
}
