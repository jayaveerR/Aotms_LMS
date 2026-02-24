import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BellRing,
  Megaphone,
  ClipboardCheck,
  BookOpen,
  Star,
  Rss,
  CheckCheck,
  Loader2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";

/* ── Relative time helper ─────────────────────────── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

/* ── Type config ──────────────────────────────────── */
const typeConfig: Record<
  Notification["type"],
  {
    icon: React.ElementType;
    bg: string;
    text: string;
    label: string;
  }
> = {
  announcement: {
    icon: Megaphone,
    bg: "bg-[#0075CF]",
    text: "text-white",
    label: "Announcement",
  },
  exam: {
    icon: ClipboardCheck,
    bg: "bg-[#FD5A1A]",
    text: "text-white",
    label: "Exam",
  },
  grade: { icon: Star, bg: "bg-[#000000]", text: "text-white", label: "Grade" },
  course: {
    icon: BookOpen,
    bg: "bg-[#0075CF]",
    text: "text-white",
    label: "Course",
  },
  system: {
    icon: Rss,
    bg: "bg-[#E9E9E9]",
    text: "text-[#000000]",
    label: "System",
  },
};

/* ── Notification Card ────────────────────────────── */
function NotifCard({
  notif,
  isRead,
  onRead,
}: {
  notif: Notification;
  isRead: boolean;
  onRead: (id: string) => void;
}) {
  const cfg = typeConfig[notif.type] ?? typeConfig.announcement;
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ x: -3, y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={() => onRead(notif.id)}
      className={`group relative flex items-start gap-4 p-5 border-2 border-[#000000] rounded-2xl cursor-pointer transition-shadow duration-200
        ${
          isRead
            ? "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,117,207,1)]"
            : "bg-[#0075CF]/5 shadow-[3px_3px_0px_0px_rgba(0,117,207,1)] hover:shadow-[6px_6px_0px_0px_rgba(253,90,26,1)]"
        }`}
    >
      {/* Unread accent line */}
      {!isRead && (
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#FD5A1A] rounded-r-full" />
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl border-2 border-[#000000] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${cfg.bg}`}
      >
        <Icon className={`w-6 h-6 ${cfg.text}`} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-black px-2 py-0.5 border-2 border-[#000000] rounded-full uppercase tracking-widest shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${cfg.bg} ${cfg.text}`}
            >
              {cfg.label}
            </span>
            {!isRead && (
              <span className="text-[10px] font-black text-[#FD5A1A] uppercase tracking-widest">
                ● New
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#000000]/40 shrink-0 mt-0.5">
            {timeAgo(notif.created_at)}
          </span>
        </div>

        <h3
          className={`text-sm leading-snug mb-1 ${isRead ? "font-semibold text-[#000000]/80" : "font-black text-[#000000]"}`}
        >
          {notif.title}
        </h3>

        {notif.message && (
          <p className="text-xs text-[#000000]/60 leading-relaxed">
            {notif.message}
          </p>
        )}
      </div>

      {/* Mark-read tick */}
      {!isRead && (
        <div
          className="shrink-0 w-5 h-5 rounded-full bg-[#FD5A1A] flex items-center justify-center mt-1"
          title="Click to mark as read"
        >
          <span className="w-2 h-2 rounded-full bg-white" />
        </div>
      )}
    </motion.div>
  );
}

/* ── Section Header ───────────────────────────────── */
function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-black text-[#000000]/50 uppercase tracking-[0.15em]">
        {label}
      </span>
      <span className="text-xs font-black text-[#000000] bg-[#E9E9E9] border border-[#000000] rounded-full px-2 py-0.5">
        {count}
      </span>
      <div className="flex-1 h-px bg-[#000000]/10" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   NOTIFICATIONS FULL PAGE
═══════════════════════════════════════════════════ */
export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    isRead,
  } = useNotifications();

  const unread = notifications.filter((n) => !isRead(n.id));
  const read = notifications.filter((n) => isRead(n.id));

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-9 h-9 flex items-center justify-center border-2 border-[#000000] rounded-xl bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[#000000] flex items-center gap-2">
              <BellRing className="w-6 h-6 text-[#FD5A1A]" />
              Notifications
            </h1>
            <p className="text-sm text-[#000000]/60">
              {loading
                ? "Loading…"
                : unreadCount > 0
                  ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
                  : "All caught up!"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total",
            value: notifications.length,
            bg: "bg-[#E9E9E9]",
            text: "text-[#000000]",
          },
          {
            label: "Unread",
            value: unreadCount,
            bg: "bg-[#FD5A1A]",
            text: "text-white",
          },
          {
            label: "Read",
            value: notifications.length - unreadCount,
            bg: "bg-[#0075CF]",
            text: "text-white",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border-2 border-[#000000] rounded-xl p-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
          >
            <div className={`text-3xl font-black ${s.text}`}>{s.value}</div>
            <div
              className={`text-xs font-bold uppercase tracking-widest ${s.text} opacity-80 mt-0.5`}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-[#0075CF] animate-spin" />
          <p className="font-bold text-[#000000]/50">Loading notifications…</p>
        </div>
      ) : notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 gap-5"
        >
          <div className="w-24 h-24 bg-[#E9E9E9] border-2 border-[#000000] rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Bell className="w-12 h-12 text-[#000000]/20" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-black text-[#000000] mb-1">
              No Notifications Yet
            </h3>
            <p className="text-sm text-[#000000]/60 max-w-xs">
              When instructors post announcements, new exams go live, or grades
              are released — they'll appear here.
            </p>
          </div>
          <Button
            variant="default"
            onClick={() => navigate("/courses")}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" /> Browse Courses
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Unread section */}
          {unread.length > 0 && (
            <div>
              <SectionLabel label="New" count={unread.length} />
              <div className="space-y-3">
                <AnimatePresence>
                  {unread.map((n) => (
                    <NotifCard
                      key={n.id}
                      notif={n}
                      isRead={false}
                      onRead={markAsRead}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Read section */}
          {read.length > 0 && (
            <div>
              <SectionLabel label="Earlier" count={read.length} />
              <div className="space-y-3">
                <AnimatePresence>
                  {read.map((n) => (
                    <NotifCard
                      key={n.id}
                      notif={n}
                      isRead={true}
                      onRead={markAsRead}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Hint ── */}
      {notifications.length > 0 && (
        <p className="text-center text-xs text-[#000000]/30 font-bold pt-4 flex items-center justify-center gap-1.5">
          <Trash2 className="w-3 h-3" /> Notifications auto-clear after 30 days
          • Click any to mark as read
        </p>
      )}
    </div>
  );
}
