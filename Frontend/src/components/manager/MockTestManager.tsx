import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useMockTestConfigs,
  useCreateMockTestConfig,
  useDeleteMockTestConfig,
} from "@/hooks/useManagerData";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  Trash2,
  Clock,
  ListChecks,
  Shuffle,
  Layers,
  ArrowRight,
  Settings,
  Target,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function MockTestManager() {
  const { user } = useAuth();
  const { data: configs = [], isLoading } = useMockTestConfigs();
  const createConfig = useCreateMockTestConfig();
  const deleteConfig = useDeleteMockTestConfig();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newConfig, setNewConfig] = useState({
    title: "",
    description: "",
    topics: "",
    question_count: 30,
    duration_minutes: 60,
    easy_percent: 30,
    medium_percent: 50,
    hard_percent: 20,
    is_active: true,
  });

  const handleCreate = async () => {
    if (!newConfig.title.trim() || !user?.id) return;
    try {
      await createConfig.mutateAsync({
        title: newConfig.title,
        description: newConfig.description || null,
        course_id: null,
        topics: newConfig.topics
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        question_count: newConfig.question_count,
        duration_minutes: newConfig.duration_minutes,
        difficulty_mix: {
          easy: newConfig.easy_percent,
          medium: newConfig.medium_percent,
          hard: newConfig.hard_percent,
        },
        is_active: newConfig.is_active,
        created_by: user.id,
      });
      setNewConfig({
        title: "",
        description: "",
        topics: "",
        question_count: 30,
        duration_minutes: 60,
        easy_percent: 30,
        medium_percent: 50,
        hard_percent: 20,
        is_active: true,
      });
      setIsAddOpen(false);
    } catch (err) {
      console.error("Failed to create mock test:", err);
    }
  };

  const activeConfigs = configs.filter((c) => c.is_active);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
        <p className="text-xs font-medium text-muted-foreground animate-pulse">
          Loading configurations...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-['Inter']">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider">
            Mock Test Manager
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest">
            Configure and manage practice assessment environments
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FD5A1A] text-white border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FD5A1A]/90 hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-black uppercase tracking-widest text-xs">
              <Plus className="h-4 w-4 mr-2" />
              Create Mock Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-[#000000] bg-white p-0 font-['Inter']">
            <DialogHeader className="p-6 border-b-4 border-[#000000] bg-[#FFD166]">
              <DialogTitle className="text-2xl font-black text-[#000000] uppercase tracking-wider">
                Mock Test Configuration
              </DialogTitle>
              <DialogDescription className="font-bold text-[#000000]/70 uppercase tracking-widest text-xs">
                Set the parameters for this practice assessment
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                  Title
                </Label>
                <Input
                  placeholder="e.g. Full Stack Interview Prep"
                  value={newConfig.title}
                  onChange={(e) =>
                    setNewConfig({ ...newConfig, title: e.target.value })
                  }
                  className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/30"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                  Description
                </Label>
                <Textarea
                  placeholder="Instructions for students..."
                  className="min-h-[80px] resize-none bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/30"
                  value={newConfig.description}
                  onChange={(e) =>
                    setNewConfig({
                      ...newConfig,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                  Topics (comma separated)
                </Label>
                <Input
                  placeholder="React, Node.js, TypeScript"
                  value={newConfig.topics}
                  onChange={(e) =>
                    setNewConfig({ ...newConfig, topics: e.target.value })
                  }
                  className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                    Question Count
                  </Label>
                  <Input
                    type="number"
                    value={newConfig.question_count}
                    className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                    onChange={(e) =>
                      setNewConfig({
                        ...newConfig,
                        question_count: parseInt(e.target.value) || 30,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-[#000000] uppercase tracking-widest">
                    Duration (mins)
                  </Label>
                  <Input
                    type="number"
                    value={newConfig.duration_minutes}
                    className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                    onChange={(e) =>
                      setNewConfig({
                        ...newConfig,
                        duration_minutes: parseInt(e.target.value) || 60,
                      })
                    }
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-[#000000] bg-[#E9E9E9] rounded-none space-y-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <h4 className="text-[10px] font-black uppercase text-[#000000] flex items-center gap-2 tracking-[0.2em]">
                  <Shuffle className="h-3.5 w-3.5" /> Difficulty Balance
                </h4>

                {[
                  { label: "Easy", key: "easy_percent" },
                  { label: "Medium", key: "medium_percent" },
                  { label: "Hard", key: "hard_percent" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span>{item.label}</span>
                      <span>
                        {newConfig[item.key as keyof typeof newConfig]}%
                      </span>
                    </div>
                    <Slider
                      value={[
                        newConfig[item.key as keyof typeof newConfig] as number,
                      ]}
                      max={100}
                      step={5}
                      className="cursor-pointer"
                      onValueChange={([v]) =>
                        setNewConfig({ ...newConfig, [item.key]: v })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 border-2 border-[#000000] rounded-none bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest">
                    Active Status
                  </Label>
                  <p className="text-[9px] font-bold text-[#000000]/50 uppercase tracking-widest">
                    Make available immediately
                  </p>
                </div>
                <Switch
                  checked={newConfig.is_active}
                  onCheckedChange={(checked) =>
                    setNewConfig({ ...newConfig, is_active: checked })
                  }
                />
              </div>
            </div>

            <DialogFooter className="p-6 border-t-4 border-[#000000] bg-[#E9E9E9] gap-3">
              <Button
                className="bg-white text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex-1 h-12"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#6BCB77] text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex-1 h-12"
                onClick={handleCreate}
                disabled={createConfig.isPending}
              >
                {createConfig.isPending ? "Saving..." : "Save Mock Test"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Configs",
            value: configs.length,
            icon: Layers,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Active Tests",
            value: activeConfigs.length,
            icon: Target,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Avg Questions",
            value:
              configs.length > 0
                ? Math.round(
                    configs.reduce((acc, c) => acc + c.question_count, 0) /
                      configs.length,
                  )
                : 0,
            icon: ListChecks,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Performance",
            value: "88%",
            icon: Settings,
            color: "text-slate-600",
            bg: "bg-slate-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-none border-2 border-[#000000] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white",
                  )}
                >
                  <stat.icon className={cn("h-5 w-5 text-[#000000]")} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <h3 className="text-xl font-black text-[#000000]">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Standard List View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#000000]">
            Configured Tests
          </h3>
          <span className="text-[10px] text-[#000000]/60 font-bold uppercase tracking-widest">
            {configs.length} items
          </span>
        </div>

        {configs.length === 0 ? (
          <div className="py-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center space-y-3 bg-muted/5">
            <Shuffle className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No mock tests configured yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {configs.map((config) => (
              <Card
                key={config.id}
                className="relative group border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all bg-white rounded-none flex items-center overflow-hidden"
              >
                <div
                  className={cn(
                    "w-2 self-stretch shrink-0 border-r-4 border-[#000000]",
                    config.is_active ? "bg-[#0075CF]" : "bg-[#E9E9E9]",
                  )}
                />

                <div className="flex-1 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "text-[9px] font-black tracking-widest h-5 px-2 uppercase rounded-none border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                          config.is_active
                            ? "bg-[#6BCB77] text-[#000000]"
                            : "bg-[#E9E9E9] text-[#000000]/40",
                        )}
                      >
                        {config.is_active ? "Active" : "Draft"}
                      </Badge>
                      {config.topics.length > 0 && (
                        <span className="text-[10px] text-[#000000]/60 font-black uppercase tracking-widest bg-[#E9E9E9] px-2 py-0.5 border-2 border-[#000000]">
                          {config.topics.slice(0, 2).join(", ")}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-black text-[#000000] uppercase tracking-wider">
                      {config.title}
                    </h4>
                    <div className="flex items-center gap-4 text-[#000000]/60 text-[10px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <ListChecks className="h-3.5 w-3.5" />{" "}
                        {config.question_count} Questions
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />{" "}
                        {config.duration_minutes}m
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 border-2 border-[#000000] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FD5A1A]/10 hover:text-[#FD5A1A] transition-all text-[#000000]/40"
                      onClick={() => deleteConfig.mutate(config.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button className="rounded-none px-6 h-10 gap-3 bg-[#0075CF] text-white border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase tracking-widest text-[10px]">
                      Launch Test <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
