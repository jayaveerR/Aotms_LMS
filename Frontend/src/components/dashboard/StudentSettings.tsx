import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Settings, 
    Bell, 
    Shield, 
    Smartphone, 
    Monitor, 
    Moon, 
    Sun, 
    Save, 
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    Palette
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export function StudentSettings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Information Updated",
                description: "Your preferences have been saved locally.",
                className: "bg-emerald-50 border-emerald-200"
            });
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/30">
                        <Settings className="h-8 w-8 animate-[spin_10s_linear_infinite]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Preferences</h2>
                        <p className="text-slate-500 font-medium">Control your digital learning experience and privacy.</p>
                    </div>
                </div>
                <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="h-12 px-6 rounded-2xl pro-button-primary shadow-xl shadow-primary/20 font-bold"
                >
                    {loading ? <Save className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/5 overflow-hidden">
                <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
                    <aside className="lg:w-72 bg-slate-50 border-r border-slate-100 p-6 space-y-2">
                        <TabsList className="bg-transparent flex flex-col h-auto w-full gap-2 space-y-0 p-0">
                            {[
                                { id: "general", label: "General", icon: Monitor },
                                { id: "notifications", label: "Notifications", icon: Bell },
                                { id: "security", label: "Security & Login", icon: Shield },
                                { id: "appearance", label: "Appearance", icon: Palette },
                                { id: "accessibility", label: "Mobile Sync", icon: Smartphone }
                            ].map((tab) => (
                                <TabsTrigger 
                                    key={tab.id}
                                    value={tab.id}
                                    className="w-full justify-start h-12 px-4 rounded-xl gap-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary text-slate-500 border border-transparent font-bold transition-all"
                                >
                                    <tab.icon className="h-4.5 w-4.5" />
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="pt-8">
                            <Card className="bg-primary/5 border-primary/10 rounded-2xl p-4 shadow-none">
                                <div className="space-y-4">
                                     <div className="space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">System Health</div>
                                        <Progress value={94} className="h-1.5 bg-primary/10" />
                                     </div>
                                     <p className="text-[11px] text-slate-500 font-medium italic">Synchronized with core registry on 03/20/2026</p>
                                </div>
                            </Card>
                        </div>
                    </aside>

                    <div className="flex-1 overflow-y-auto">
                        <TabsContent value="general" className="mt-0 p-8 space-y-8 animate-in fade-in duration-300">
                             <div className="space-y-6">
                                <h3 className="text-xl font-black text-slate-900 pr-2 border-l-4 border-primary pl-4">Account Basics</h3>
                                <div className="grid gap-6">
                                    <div className="space-y-2.5">
                                        <Label className="text-sm font-bold text-slate-700 ml-1">Learning Alias</Label>
                                        <Input defaultValue={(user?.full_name as string) || ''} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white" />
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-sm font-bold text-slate-700 ml-1">Timezone</Label>
                                        <select className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all">
                                            <option>Eastern Time (ET)</option>
                                            <option>GMT+5:30 (India Standard Time)</option>
                                            <option>GMT+00:00 (UTC)</option>
                                        </select>
                                    </div>
                                </div>
                             </div>

                             <div className="space-y-6 pt-4">
                                <h3 className="text-xl font-black text-slate-900 pr-2 border-l-4 border-primary pl-4">Privacy</h3>
                                <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold text-slate-900">Show ranking on Leaderboard</div>
                                            <div className="text-xs text-slate-500 font-medium">Your score will be visible to other students in the academy.</div>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                    </div>
                                    <hr className="border-slate-200/80" />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="text-sm font-bold text-slate-900">Course Progress Privacy</div>
                                            <div className="text-xs text-slate-500 font-medium">Keep your course activity and completion data strictly private.</div>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-primary" />
                                    </div>
                                </div>
                             </div>
                        </TabsContent>

                        <TabsContent value="notifications" className="mt-0 p-8 space-y-8 animate-in fade-in duration-300">
                             <div className="space-y-8">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-200">
                                        <Bell className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Alert Center</h4>
                                        <p className="text-xs text-slate-500 font-medium">Master control for all real-time communications.</p>
                                    </div>
                                    <Switch defaultChecked className="ml-auto data-[state=checked]:bg-primary" />
                                </div>

                                <div className="grid gap-6">
                                    {[
                                        { title: "Exam Reminders", desc: "Get notified 15 minutes before scheduled exams." },
                                        { title: "Live Class Entry", desc: "Notification when an instructor starts a meeting." },
                                        { title: "Announcement Postings", desc: "Alerts when staff post news in the academy." },
                                        { title: "Badge Achievements", desc: "Alerts for new certification or ranking awards." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between px-2">
                                            <div className="space-y-1">
                                                <div className="text-sm font-bold text-slate-900">{item.title}</div>
                                                <div className="text-xs text-slate-500 font-medium">{item.desc}</div>
                                            </div>
                                            <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </TabsContent>

                        <TabsContent value="security" className="mt-0 p-8 space-y-6 animate-in fade-in duration-300">
                             <h3 className="text-xl font-black text-slate-900 pr-2 border-l-4 border-primary pl-4">Security Protocol</h3>
                             <div className="grid gap-6">
                                <div className="p-6 border border-slate-200 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-3 text-amber-600 font-bold mb-2">
                                        <Lock className="h-5 w-5" />
                                        <span>Change Password</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5 flex-1">
                                            <Label className="text-[11px] font-black uppercase text-slate-500 tracking-wider">New Secure Password</Label>
                                            <div className="relative">
                                                <Input type="password" placeholder="Min. 12 characters" className="h-11 rounded-lg border-slate-200 pr-10" />
                                                <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer" />
                                            </div>
                                        </div>
                                        <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-200 font-bold">Update Key</Button>
                                    </div>
                                </div>
                             </div>
                        </TabsContent>

                        <TabsContent value="appearance" className="mt-0 p-8 space-y-8 animate-in fade-in duration-300">
                             <h3 className="text-xl font-black text-slate-900 pr-2 border-l-4 border-primary pl-4">Interface Customization</h3>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border-2 border-primary bg-white rounded-2xl flex flex-col items-center gap-3">
                                    <div className="h-20 w-full bg-slate-50 rounded-xl relative overflow-hidden">
                                        <Sun className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary/40" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-bold text-slate-900">Light Vision</span>
                                    </div>
                                </div>
                                <div className="p-4 border border-slate-200 bg-white rounded-2xl flex flex-col items-center gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 cursor-not-allowed">
                                    <div className="h-20 w-full bg-slate-900 rounded-xl relative overflow-hidden">
                                        <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white/20" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-400">Night Mode</span>
                                    </div>
                                </div>
                             </div>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                 <p className="text-xs text-slate-500 font-medium">Session ID: 5b47-d0f7-5ddb-4d81-820c-4cc9de3d80e1-S900</p>
                 <Badge variant="outline" className="text-slate-400 font-bold border-slate-200">AOTMS CORE V.2.1</Badge>
            </div>
        </div>
    );
}
