import { useSocket } from "@/hooks/useSocket";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Trash2, CheckCircle2, AlertCircle, Info, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Notifications() {
    const { notifications, clearNotifications } = useSocket();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
            case 'exam_submission':
                return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-amber-500" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-rose-500" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />;
            case 'message':
                return <MessageSquare className="h-5 w-5 text-indigo-500" />;
            default:
                return <Bell className="h-5 w-5 text-slate-400" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Communications</h2>
                    <p className="text-slate-500 font-medium">Stay updated with the latest activity from the academy.</p>
                </div>
                {notifications.length > 0 && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearNotifications}
                        className="h-10 rounded-xl border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all font-bold gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[2.5rem] overflow-hidden">
                    <CardContent className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                        <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-inner border border-slate-100 mb-2">
                            <Bell className="h-12 w-12 text-slate-200" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-black text-slate-900">Quiet for now</p>
                            <p className="text-sm font-medium text-slate-500 max-w-sm">
                                When you receive updates about your courses, exams, or account, they will appear here.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence initial={false}>
                        {notifications.map((notif, idx) => (
                            <motion.div
                                key={notif.id || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-all rounded-2xl group cursor-default">
                                    <CardContent className="p-0">
                                        <div className="flex items-start p-6 gap-5">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white transition-colors">
                                                {getIcon(notif.type)}
                                            </div>
                                            
                                            <div className="flex-1 space-y-1 min-w-0">
                                                <div className="flex items-center justify-between gap-4">
                                                    <h3 className="font-bold text-slate-900 truncate">{notif.title}</h3>
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(notif.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                                    {notif.message}
                                                </p>
                                                <div className="pt-2 flex items-center gap-3">
                                                    <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary hover:text-primary/80">
                                                        Mark as Read
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Notification Preferences Helper */}
            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex flex-col md:flex-row items-center gap-6">
                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-primary/10">
                    <Bell className="h-7 w-7 text-primary" />
                </div>
                <div className="text-center md:text-left">
                    <h4 className="font-bold text-slate-900">Notification Settings</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Want to change how you receive alerts? You can customize your preferences in the system settings.</p>
                </div>
                <Button variant="outline" className="md:ml-auto h-11 rounded-xl border-slate-200 font-bold bg-white shadow-sm">
                    Configure
                </Button>
            </div>
        </div>
    );
}
