import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  useGuestCredentials,
  useUpdateGuestCredential,
  useCourses,
  type GuestCredential,
} from "@/hooks/useManagerData";
import {
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Globe,
  Users,
  Settings,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  KeyRound,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { format, isPast } from "date-fns";

export function AccessControlManager() {
  const { data: credentials = [], isLoading: credsLoading } =
    useGuestCredentials();
  const { data: courses = [] } = useCourses();
  const updateCredential = useUpdateGuestCredential();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCred, setEditingCred] = useState<GuestCredential | null>(null);
  const [editForm, setEditForm] = useState({
    access_level: "",
    allowed_courses: [] as string[],
    max_sessions: 1,
    is_active: true,
  });

  const openEditDialog = (cred: GuestCredential) => {
    setEditingCred(cred);
    setEditForm({
      access_level: cred.access_level,
      allowed_courses: cred.allowed_courses || [],
      max_sessions: cred.max_sessions || 1,
      is_active: cred.is_active !== false,
    });
  };

  const handleSave = async () => {
    if (!editingCred) return;
    await updateCredential.mutateAsync({
      id: editingCred.id,
      access_level: editForm.access_level,
      allowed_courses: editForm.allowed_courses,
      max_sessions: editForm.max_sessions,
      is_active: editForm.is_active,
    });
    setEditingCred(null);
  };

  const handleToggleActive = async (cred: GuestCredential) => {
    await updateCredential.mutateAsync({
      id: cred.id,
      is_active: !cred.is_active,
    });
  };

  const filteredCredentials = credentials.filter(
    (c) =>
      c.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeCount = credentials.filter(
    (c) => c.is_active && !isPast(new Date(c.expires_at)),
  ).length;
  const expiredCount = credentials.filter((c) =>
    isPast(new Date(c.expires_at)),
  ).length;
  const disabledCount = credentials.filter((c) => !c.is_active).length;

  const accessLevelConfig: Record<
    string,
    { label: string; icon: typeof Shield; color: string; description: string }
  > = {
    demo: {
      label: "Demo",
      icon: Eye,
      color: "text-blue-500",
      description: "View demo content only",
    },
    view_only: {
      label: "View Only",
      icon: EyeOff,
      color: "text-gray-500",
      description: "Browse courses, no interaction",
    },
    limited: {
      label: "Limited",
      icon: Lock,
      color: "text-yellow-500",
      description: "View + attempt select exams",
    },
    full: {
      label: "Full Access",
      icon: Unlock,
      color: "text-green-500",
      description: "Full student-level access",
    },
  };

  const toggleCourseAccess = (courseId: string) => {
    setEditForm((prev) => ({
      ...prev,
      allowed_courses: prev.allowed_courses.includes(courseId)
        ? prev.allowed_courses.filter((id) => id !== courseId)
        : [...prev.allowed_courses, courseId],
    }));
  };

  if (credsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading access control data...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Inter']">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider">
            Access Control
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest">
            Manage and assign limited access to guest users
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]" />
          <Input
            placeholder="Search guests..."
            className="pl-10 w-full sm:w-64 bg-[#E9E9E9] border-2 border-[#000000] text-[#000000] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-white transition-all placeholder:text-[#000000]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Total Guests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {credentials.length}
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              configured accounts
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#6BCB77]">
              {activeCount}
            </div>
            <p className="text-xs font-bold text-[#6BCB77] uppercase tracking-widest">
              currently accessible
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#FFD166]">
              {expiredCount}
            </div>
            <p className="text-xs font-bold text-[#FFD166] uppercase tracking-widest">
              past expiry date
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Disabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#FD5A1A]">
              {disabledCount}
            </div>
            <p className="text-xs font-bold text-[#FD5A1A] uppercase tracking-widest">
              manually disabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Access Level Overview */}
      <Card className="bg-white rounded-none border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black text-[#000000] uppercase tracking-wider">
            <Shield className="h-6 w-6 text-[#0075CF]" />
            Access Level Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {Object.entries(accessLevelConfig).map(([level, config]) => {
              const count = credentials.filter(
                (c) => c.access_level === level,
              ).length;
              const IconComp = config.icon;
              let iconBg = "bg-[#000000]";
              if (config.color === "text-blue-500") iconBg = "bg-[#0075CF]";
              if (config.color === "text-gray-500") iconBg = "bg-[#000000]/60";
              if (config.color === "text-yellow-500") iconBg = "bg-[#FFD166]";
              if (config.color === "text-green-500") iconBg = "bg-[#6BCB77]";
              return (
                <div
                  key={level}
                  className="flex items-center gap-3 p-3 rounded-none border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#E9E9E9]"
                >
                  <div
                    className={`h-10 w-10 border-2 border-[#000000] ${iconBg} flex items-center justify-center shrink-0`}
                  >
                    <IconComp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm uppercase tracking-wider">
                        {config.label}
                      </span>
                      <Badge className="bg-white text-[#000000] border-2 border-[#000000] font-black">
                        {count}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                      {config.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Guest Accounts List with Access Control */}
      <Card className="bg-white rounded-none border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black text-[#000000] uppercase tracking-wider">
            <KeyRound className="h-6 w-6 text-[#FD5A1A]" />
            Guest Access Permissions
          </CardTitle>
          <CardDescription className="font-bold text-[#000000]/60 uppercase tracking-widest text-xs">
            Click the settings icon to modify access levels and course
            permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCredentials.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No guest accounts found</p>
              <p className="text-sm">
                Create guest accounts from the Guest Credentials tab first
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCredentials.map((cred) => {
                const isExpired = isPast(new Date(cred.expires_at));
                const levelConfig =
                  accessLevelConfig[cred.access_level] ||
                  accessLevelConfig.view_only;
                const LevelIcon = levelConfig.icon;

                return (
                  <div
                    key={cred.id}
                    className={`flex items-center gap-4 p-4 rounded-none border-2 border-[#000000] transition-colors ${
                      !cred.is_active || isExpired
                        ? "bg-[#E9E9E9] opacity-70"
                        : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E9E9E9]"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 border-2 border-[#000000] flex items-center justify-center ${
                        cred.is_active && !isExpired
                          ? "bg-[#6BCB77]"
                          : "bg-[#000000]/20"
                      }`}
                    >
                      {cred.is_active && !isExpired ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <XCircle className="h-5 w-5 text-[#000000]/60" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm truncate">
                          {cred.display_name}
                        </h4>
                        <Badge className="gap-1 text-[10px] font-black uppercase tracking-widest bg-white text-[#000000] border-2 border-[#000000]">
                          <LevelIcon className="h-3 w-3" />
                          {levelConfig.label}
                        </Badge>
                        {isExpired && (
                          <Badge className="text-[10px] font-black uppercase tracking-widest bg-[#FD5A1A] text-white border-2 border-[#000000] rounded-none">
                            Expired
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
                        <span>@{cred.username}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires{" "}
                          {format(new Date(cred.expires_at), "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {cred.max_sessions || 1} session
                          {(cred.max_sessions || 1) > 1 ? "s" : ""}
                        </span>
                        {(cred.allowed_courses?.length || 0) > 0 && (
                          <span>
                            {cred.allowed_courses?.length} courses allowed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                          Active
                        </Label>
                        <Switch
                          checked={cred.is_active !== false}
                          onCheckedChange={() => handleToggleActive(cred)}
                          disabled={updateCredential.isPending}
                          className="border-2 border-[#000000] data-[state=checked]:bg-[#6BCB77]"
                        />
                      </div>
                      <Button
                        size="icon"
                        onClick={() => openEditDialog(cred)}
                        className="bg-white text-[#000000] border-2 border-[#000000] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ml-2"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Access Dialog */}
      <Dialog
        open={!!editingCred}
        onOpenChange={(open) => !open && setEditingCred(null)}
      >
        <DialogContent className="sm:max-w-lg bg-white border-4 border-[#000000] rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 font-['Inter']">
          <DialogHeader className="p-6 border-b-4 border-[#000000] bg-[#FFD166]">
            <DialogTitle className="flex items-center gap-2 text-2xl font-black text-[#000000] uppercase tracking-wider">
              <Shield className="h-6 w-6 text-[#000000]" />
              Edit Access — {editingCred?.display_name}
            </DialogTitle>
            <DialogDescription className="font-bold text-[#000000]/70 uppercase tracking-widest text-xs">
              Configure access level and course permissions for this guest user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 p-6 max-h-[60vh] overflow-y-auto bg-white">
            <div className="space-y-2">
              <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                Access Level
              </Label>
              <Select
                value={editForm.access_level}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, access_level: value })
                }
              >
                <SelectTrigger className="w-full bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-[#000000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {Object.entries(accessLevelConfig).map(([level, config]) => (
                    <SelectItem
                      key={level}
                      value={level}
                      className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
                    >
                      <span className="flex items-center gap-2">
                        <config.icon className="h-4 w-4" />
                        {config.label} — {config.description}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                Max Concurrent Sessions
              </Label>
              <Input
                type="number"
                min={1}
                max={10}
                className="w-full bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
                value={editForm.max_sessions}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    max_sessions: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 border-2 border-[#000000] bg-[#E9E9E9]">
              <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                Account Active
              </Label>
              <Switch
                checked={editForm.is_active}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, is_active: checked })
                }
                className="border-2 border-[#000000] data-[state=checked]:bg-[#6BCB77]"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                Allowed Courses
              </Label>
              <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                Select which courses this guest can access. If none selected,
                general access rules apply.
              </p>
              {courses.length === 0 ? (
                <p className="text-sm font-bold text-[#000000]/60 italic">
                  No courses available
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className={`flex items-center gap-3 p-3 border-2 border-[#000000] cursor-pointer transition-colors ${
                        editForm.allowed_courses.includes(course.id)
                          ? "bg-[#6BCB77] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px]"
                          : "bg-white hover:bg-[#E9E9E9]"
                      }`}
                      onClick={() => toggleCourseAccess(course.id)}
                    >
                      <div
                        className={`h-5 w-5 border-2 flex items-center justify-center ${
                          editForm.allowed_courses.includes(course.id)
                            ? "bg-[#000000] border-[#000000]"
                            : "border-[#000000] bg-white"
                        }`}
                      >
                        {editForm.allowed_courses.includes(course.id) && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-black truncate ${editForm.allowed_courses.includes(course.id) ? "text-[#000000]" : "text-[#000000]"}`}
                        >
                          {course.title}
                        </p>
                        {course.description && (
                          <p
                            className={`text-[10px] font-bold uppercase tracking-widest truncate ${editForm.allowed_courses.includes(course.id) ? "text-[#000000]/80" : "text-[#000000]/60"}`}
                          >
                            {course.description}
                          </p>
                        )}
                      </div>
                      {course.is_published ? (
                        <Badge
                          className={`rounded-none border-2 border-[#000000] font-black text-xs ${editForm.allowed_courses.includes(course.id) ? "bg-[#000000] text-white" : "bg-white text-[#000000]"}`}
                        >
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          className={`rounded-none border-2 border-[#000000] font-black text-xs ${editForm.allowed_courses.includes(course.id) ? "bg-[#000000]/20 text-[#000000]" : "bg-[#E9E9E9] text-[#000000]"}`}
                        >
                          Draft
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {editForm.allowed_courses.length > 0 && (
                <p className="text-[10px] font-black text-[#0075CF] uppercase tracking-widest">
                  {editForm.allowed_courses.length} course(s) selected
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="p-6 border-t-4 border-[#000000] bg-[#E9E9E9] flex sm:justify-between items-center w-full">
            <Button
              className="bg-white text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all w-full sm:w-auto"
              onClick={() => setEditingCred(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#6BCB77] text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full sm:w-auto mt-2 sm:mt-0"
              onClick={handleSave}
              disabled={updateCredential.isPending}
            >
              {updateCredential.isPending
                ? "Saving..."
                : "Save Access Controls"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
