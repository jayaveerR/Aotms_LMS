import { useRef, useEffect } from "react";
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
  X,
  Loader2,
} from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";

/* ── Relative time helper ────────────────────────── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ── Notification type → icon / colour ──────────── */
const typeConfig: Record<
  Notification["type"],
  { icon: React.ElementType; bg: string; text: string }
> = {
  announcement: { icon: Megaphone, bg: "bg-[#0075CF]", text: "text-white" },
  exam: { icon: ClipboardCheck, bg: "bg-[#FD5A1A]", text: "text-white" },
  grade: { icon: Star, bg: "bg-[#000000]", text: "text-white" },
  course: { icon: BookOpen, bg: "bg-[#0075CF]", text: "text-white" },
  system: { icon: Rss, bg: "bg-[#E9E9E9]", text: "text-[#000000]" },
};

/* ── Single notification row ─────────────────────── */
function NotifRow({
  notif,
  isRead,
  onRead,
}: {
  notif: Notification;
  isRead: boolean;
  onRead: (id: string) => void;
}) {
  const {
    icon: Icon,
    bg,
    text,
  } = typeConfig[notif.type] ?? typeConfig.announcement;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={() => onRead(notif.id)}
      className={`group flex items-start gap-3 px-4 py-3 border-b border-[#E9E9E9] last:border-0 cursor-pointer transition-colors duration-150 ${isRead ? "bg-white" : "bg-[#0075CF]/5"} hover:bg-[#E9E9E9]`}
    >
      {/* Type icon */}
      <div
        className={`w-9 h-9 rounded-lg border-2 border-[#000000] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${bg}`}
      >
        <Icon className={`w-4 h-4 ${text}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm leading-snug ${isRead ? "font-medium text-[#000000]/80" : "font-black text-[#000000]"}`}
          >
            {notif.title}
          </p>
          {!isRead && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-[#FD5A1A] border border-white mt-1" />
          )}
        </div>
        {notif.message && (
          <p className="text-xs text-[#000000]/60 mt-0.5 line-clamp-2 leading-relaxed">
            {notif.message}
          </p>
        )}
        <p className="text-[10px] text-[#000000]/40 font-bold mt-1">
          {timeAgo(notif.created_at)}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN NOTIFICATION BELL COMPONENT
═══════════════════════════════════════════════════ */
export function NotificationBell() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    open,
    setOpen,
    markAsRead,
    markAllAsRead,
    isRead,
  } = useNotifications();

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setOpen]);

  return (
    <div className="relative">
      {/* ── Bell button ── */}
      <button
        ref={buttonRef}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        onClick={() => setOpen((v) => !v)}
        className={`relative flex items-center justify-center w-10 h-10 border-2 border-[#000000] rounded-xl transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] ${open ? "bg-[#0075CF] text-white" : "bg-white text-[#000000] hover:bg-[#E9E9E9]"}`}
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 animate-[wiggle_1s_ease-in-out_infinite]" />
        ) : (
          <Bell className="w-5 h-5" />
        )}

        {/* Unread badge */}
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-[#FD5A1A] border-2 border-white rounded-full text-white text-[10px] font-black flex items-center justify-center shadow"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-12 w-80 sm:w-96 bg-white border-2 border-[#000000] rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-[200]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#000000] bg-[#000000]">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#FD5A1A]" />
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#FD5A1A] text-white text-[10px] font-black rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="flex items-center gap-1 text-[10px] font-black text-white/70 hover:text-[#FD5A1A] transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> All read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-8 h-8 text-[#0075CF] animate-spin" />
                  <p className="text-xs font-bold text-[#000000]/50">
                    Loading notifications…
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 gap-3">
                  <div className="w-16 h-16 bg-[#E9E9E9] border-2 border-[#000000] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Bell className="w-8 h-8 text-[#000000]/30" />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-[#000000] text-sm">
                      All caught up!
                    </p>
                    <p className="text-xs text-[#000000]/50 mt-0.5">
                      No notifications yet.
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((notif) => (
                    <NotifRow
                      key={notif.id}
                      notif={notif}
                      isRead={isRead(notif.id)}
                      onRead={markAsRead}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t-2 border-[#E9E9E9] px-4 py-2.5">
                <button
                  onClick={() => {
                    navigate("/dashboard/notifications");
                    setOpen(false);
                  }}
                  className="w-full text-center text-xs font-black text-[#0075CF] hover:text-[#FD5A1A] transition-colors py-1"
                >
                  View all notifications →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wiggle keyframe — injected via inline style tag */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
