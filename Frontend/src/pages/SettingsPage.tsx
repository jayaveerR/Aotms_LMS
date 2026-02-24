import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings,
  User,
  Lock,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  ShieldCheck,
  Mail,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "appearance"
  >("profile");

  // Dummy states to simulate interactions
  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || "",
  );
  const [email] = useState(user?.email || "");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Alerts", icon: Bell },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-['Inter']">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-[#000000] flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#0075CF]" />
          Account Settings
        </h1>
        <p className="text-[#000000]/60 font-medium mt-1">
          Manage your account preferences and security.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* SIDEBAR TABS */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-black text-sm uppercase tracking-widest ${
                activeTab === tab.id
                  ? "bg-[#000000] text-white border-[#000000] shadow-[4px_4px_0px_0px_rgba(253,90,26,1)] translate-x-[-2px] translate-y-[-2px]"
                  : "bg-white text-[#000000]/70 border-transparent hover:border-[#000000]/20 hover:bg-[#E9E9E9]"
              }`}
            >
              <tab.icon
                className={`w-5 h-5 ${activeTab === tab.id ? "text-[#FD5A1A]" : ""}`}
              />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 w-full bg-white border-4 border-[#000000] rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-[#000000] border-b-4 border-[#E9E9E9] pb-4 mb-6 uppercase tracking-wider">
                Public Profile
              </h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-2xl border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#0075CF]/10 flex items-center justify-center font-black text-4xl text-[#0075CF]">
                  {fullName.charAt(0) || "U"}
                </div>
                <div className="space-y-3">
                  <Button
                    variant="default"
                    className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Upload new avatar
                  </Button>
                  <p className="text-xs font-bold text-[#000000]/50 uppercase">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label className="font-black uppercase text-xs tracking-widest text-[#000000]/70">
                    Full Name
                  </Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-2 border-[#000000] bg-[#E9E9E9]/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-white text-base font-bold shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-black uppercase text-xs tracking-widest text-[#000000]/70">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000000]/40" />
                    <Input
                      value={email}
                      disabled
                      className="pl-9 border-2 border-[#000000]/20 bg-[#E9E9E9] text-base font-bold text-[#000000]/50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="accent"
                    className="w-full sm:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY SETTINGS */}
          {activeTab === "security" && (
            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-[#000000] border-b-4 border-[#E9E9E9] pb-4 mb-6 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#FD5A1A]" />
                Account Security
              </h2>

              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label className="font-black uppercase text-xs tracking-widest text-[#000000]/70">
                    Current Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="border-2 border-[#000000] focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="space-y-2 pt-2">
                  <Label className="font-black uppercase text-xs tracking-widest text-[#000000]/70">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="border-2 border-[#000000] focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-black uppercase text-xs tracking-widest text-[#000000]/70">
                    Confirm New Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="border-2 border-[#000000] focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <div className="pt-6 border-t-4 border-[#E9E9E9] flex justify-between items-center">
                  <Button
                    variant="destructive"
                    className="bg-[#FD5A1A] hover:bg-[#FD5A1A]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SETTINGS */}
          {activeTab === "notifications" && (
            <div className="p-6 sm:p-8 space-y-6 flex flex-col h-full">
              <h2 className="text-xl font-black text-[#000000] border-b-4 border-[#E9E9E9] pb-4 mb-6 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-6 h-6 text-[#0075CF]" />
                Alert Preferences
              </h2>

              <div className="space-y-4 flex-1">
                {[
                  {
                    label: "Exam Reminders",
                    desc: "Get notified 24h before an exam starts",
                  },
                  {
                    label: "Course Announcements",
                    desc: "Updates directly from your instructors",
                  },
                  {
                    label: "New Grades Posted",
                    desc: "Find out immediately when scored",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 border-2 border-[#000000] rounded-xl flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-[#E9E9E9] transition-colors cursor-pointer group"
                  >
                    <div>
                      <p className="font-black text-[#000000] group-hover:text-[#0075CF] transition-colors">
                        {item.label}
                      </p>
                      <p className="text-xs font-bold text-[#000000]/50">
                        {item.desc}
                      </p>
                    </div>
                    {/* Brutalist Toggle fake */}
                    <div className="relative w-12 h-6 rounded-full bg-[#000000] p-1 border-2 border-[#000000] cursor-pointer shadow-inner">
                      <div className="w-4 h-4 bg-[#FD5A1A] rounded-full translate-x-5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
