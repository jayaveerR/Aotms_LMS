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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useExamRules,
  useCreateExamRule,
  useUpdateExamRule,
  useDeleteExamRule,
  useExams,
} from "@/hooks/useManagerData";
import {
  Plus,
  Settings,
  Trash2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Shuffle,
  Eye,
  Shield,
  BookCheck,
  Pencil,
  Gavel,
} from "lucide-react";
import { Label } from "@/components/ui/label";

export function ExamRulesManager() {
  const { data: rules = [], isLoading } = useExamRules();
  const { data: exams = [] } = useExams();
  const createRule = useCreateExamRule();
  const updateRule = useUpdateExamRule();
  const deleteRule = useDeleteExamRule();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [ruleForm, setRuleForm] = useState({
    exam_id: "" as string | null,
    duration_minutes: 60,
    max_attempts: 1,
    negative_marking_value: 0,
    passing_percentage: 40,
    shuffle_questions: true,
    shuffle_options: false,
    show_results_immediately: true,
    allow_review: true,
    proctoring_enabled: false,
  });

  const resetForm = () => {
    setRuleForm({
      exam_id: null,
      duration_minutes: 60,
      max_attempts: 1,
      negative_marking_value: 0,
      passing_percentage: 40,
      shuffle_questions: true,
      shuffle_options: false,
      show_results_immediately: true,
      allow_review: true,
      proctoring_enabled: false,
    });
  };

  const handleCreate = async () => {
    await createRule.mutateAsync({
      exam_id: ruleForm.exam_id || null,
      exam_schedule_id: null,
      duration_minutes: ruleForm.duration_minutes,
      max_attempts: ruleForm.max_attempts,
      negative_marking_value: ruleForm.negative_marking_value,
      passing_percentage: ruleForm.passing_percentage,
      shuffle_questions: ruleForm.shuffle_questions,
      shuffle_options: ruleForm.shuffle_options,
      show_results_immediately: ruleForm.show_results_immediately,
      allow_review: ruleForm.allow_review,
      proctoring_enabled: ruleForm.proctoring_enabled,
    });
    resetForm();
    setIsAddOpen(false);
  };

  const handleUpdate = async () => {
    if (!editingRule) return;
    await updateRule.mutateAsync({
      id: editingRule,
      exam_id: ruleForm.exam_id || null,
      duration_minutes: ruleForm.duration_minutes,
      max_attempts: ruleForm.max_attempts,
      negative_marking_value: ruleForm.negative_marking_value,
      passing_percentage: ruleForm.passing_percentage,
      shuffle_questions: ruleForm.shuffle_questions,
      shuffle_options: ruleForm.shuffle_options,
      show_results_immediately: ruleForm.show_results_immediately,
      allow_review: ruleForm.allow_review,
      proctoring_enabled: ruleForm.proctoring_enabled,
    });
    setEditingRule(null);
    resetForm();
  };

  const openEdit = (rule: (typeof rules)[0]) => {
    setEditingRule(rule.id);
    setRuleForm({
      exam_id: rule.exam_id,
      duration_minutes: rule.duration_minutes,
      max_attempts: rule.max_attempts,
      negative_marking_value: rule.negative_marking_value,
      passing_percentage: rule.passing_percentage,
      shuffle_questions: rule.shuffle_questions,
      shuffle_options: rule.shuffle_options,
      show_results_immediately: rule.show_results_immediately,
      allow_review: rule.allow_review,
      proctoring_enabled: rule.proctoring_enabled,
    });
  };

  const getExamTitle = (examId: string | null) => {
    if (!examId) return "Global (All Exams)";
    const exam = exams.find((e) => e.id === examId);
    return exam?.title || `Exam #${examId.slice(0, 8)}`;
  };

  // Stats
  const globalRules = rules.filter((r) => !r.exam_id);
  const examSpecificRules = rules.filter((r) => r.exam_id);
  const proctoringEnabled = rules.filter((r) => r.proctoring_enabled);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading exam rules...
      </div>
    );
  }

  const RuleFormContent = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-5 p-6 max-h-[60vh] overflow-y-auto bg-white">
      {/* Exam Selection */}
      <div className="space-y-2">
        <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
          Apply To
        </Label>
        <Select
          value={ruleForm.exam_id || "global"}
          onValueChange={(value) =>
            setRuleForm({
              ...ruleForm,
              exam_id: value === "global" ? null : value,
            })
          }
        >
          <SelectTrigger className="w-full bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-0">
            <SelectValue placeholder="Select exam or global" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-[#000000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <SelectItem
              value="global"
              className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
            >
              🌐 Global (All Exams)
            </SelectItem>
            {exams.map((exam) => (
              <SelectItem
                key={exam.id}
                value={exam.id}
                className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
              >
                📝 {exam.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
          Global rules apply to all exams unless overridden by exam-specific
          rules
        </p>
      </div>

      {/* Duration & Attempts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-black text-[#000000] uppercase tracking-widest">
            <Clock className="h-4 w-4" />
            Duration (minutes)
          </Label>
          <Input
            type="number"
            min={5}
            max={360}
            className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
            value={ruleForm.duration_minutes}
            onChange={(e) =>
              setRuleForm({
                ...ruleForm,
                duration_minutes: parseInt(e.target.value) || 60,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-black text-[#000000] uppercase tracking-widest">
            <RotateCcw className="h-4 w-4" />
            Max Attempts
          </Label>
          <Input
            type="number"
            min={1}
            max={10}
            className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
            value={ruleForm.max_attempts}
            onChange={(e) =>
              setRuleForm({
                ...ruleForm,
                max_attempts: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>
      </div>

      {/* Marks */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-black text-[#000000] uppercase tracking-widest">
            <AlertTriangle className="h-4 w-4 text-[#FD5A1A]" />
            Negative Marking
          </Label>
          <Input
            type="number"
            min={0}
            max={5}
            step={0.25}
            className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
            value={ruleForm.negative_marking_value}
            onChange={(e) =>
              setRuleForm({
                ...ruleForm,
                negative_marking_value: parseFloat(e.target.value) || 0,
              })
            }
          />
          <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
            Points deducted per wrong answer (0 = no penalty)
          </p>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-black text-[#000000] uppercase tracking-widest">
            <BookCheck className="h-4 w-4 text-[#6BCB77]" />
            Passing Percentage
          </Label>
          <Input
            type="number"
            min={0}
            max={100}
            className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
            value={ruleForm.passing_percentage}
            onChange={(e) =>
              setRuleForm({
                ...ruleForm,
                passing_percentage: parseInt(e.target.value) || 40,
              })
            }
          />
        </div>
      </div>

      {/* Toggle Settings */}
      <div className="space-y-4 border-4 border-[#000000] rounded-none p-4 bg-[#E9E9E9]">
        <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
          Exam Behavior
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-[#000000]/80 uppercase tracking-widest">
              <Shuffle className="h-4 w-4 text-[#000000]" />
              Shuffle Questions
            </Label>
            <Switch
              checked={ruleForm.shuffle_questions}
              onCheckedChange={(checked) =>
                setRuleForm({ ...ruleForm, shuffle_questions: checked })
              }
              className="border-2 border-[#000000] data-[state=checked]:bg-[#6BCB77]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-[#000000]/80 uppercase tracking-widest">
              <Shuffle className="h-4 w-4 text-[#000000]" />
              Shuffle Options
            </Label>
            <Switch
              checked={ruleForm.shuffle_options}
              onCheckedChange={(checked) =>
                setRuleForm({ ...ruleForm, shuffle_options: checked })
              }
              className="border-2 border-[#000000] data-[state=checked]:bg-[#6BCB77]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-[#000000]/80 uppercase tracking-widest">
              <Eye className="h-4 w-4 text-[#000000]" />
              Show Results Immediately
            </Label>
            <Switch
              checked={ruleForm.show_results_immediately}
              onCheckedChange={(checked) =>
                setRuleForm({ ...ruleForm, show_results_immediately: checked })
              }
              className="border-2 border-[#000000] data-[state=checked]:bg-[#6BCB77]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-[#000000]/80 uppercase tracking-widest">
              <BookCheck className="h-4 w-4 text-[#000000]" />
              Allow Review After Submission
            </Label>
            <Switch
              checked={ruleForm.allow_review}
              onCheckedChange={(checked) =>
                setRuleForm({ ...ruleForm, allow_review: checked })
              }
              className="border-2 border-[#000000] data-[state=checked]:bg-[#6BCB77]"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-[#FD5A1A] uppercase tracking-widest">
              <Shield className="h-4 w-4 text-[#FD5A1A]" />
              Enable Proctoring
            </Label>
            <Switch
              checked={ruleForm.proctoring_enabled}
              onCheckedChange={(checked) =>
                setRuleForm({ ...ruleForm, proctoring_enabled: checked })
              }
              className="border-2 border-[#000000] data-[state=checked]:bg-[#FD5A1A]"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 font-['Inter']">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider">
            Exam Rules Configuration
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest">
            Configure duration, negative marking, attempts & behavior
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#FD5A1A] text-white border-2 border-[#000000] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none gap-2"
              onClick={() => resetForm()}
            >
              <Plus className="h-4 w-4" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-white border-4 border-[#000000] rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 font-['Inter']">
            <DialogHeader className="p-6 border-b-4 border-[#000000] bg-[#FFD166]">
              <DialogTitle className="text-2xl font-black text-[#000000] uppercase tracking-wider">
                Create Exam Rule
              </DialogTitle>
              <DialogDescription className="font-bold text-[#000000]/70 uppercase tracking-widest text-xs">
                Define rules for a specific exam or all exams globally
              </DialogDescription>
            </DialogHeader>
            <RuleFormContent />
            <DialogFooter className="p-6 border-t-4 border-[#000000] bg-[#E9E9E9] flex sm:justify-between items-center w-full">
              <Button
                className="bg-white text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all w-full sm:w-auto"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#6BCB77] text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full sm:w-auto mt-2 sm:mt-0"
                onClick={handleCreate}
                disabled={createRule.isPending}
              >
                {createRule.isPending ? "Creating..." : "Create Rule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Total Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {rules.length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Global Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#0075CF]">
              {globalRules.length}
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              apply to all exams
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Exam-Specific
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#6BCB77]">
              {examSpecificRules.length}
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              override global
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Proctoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#FD5A1A]">
              {proctoringEnabled.length}
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              proctoring enabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <Card className="bg-white rounded-none border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black text-[#000000] uppercase tracking-wider">
            <Gavel className="h-6 w-6 text-[#0075CF]" />
            Configured Rules
          </CardTitle>
          <CardDescription className="font-bold text-[#000000]/60 uppercase tracking-widest text-xs">
            Each rule defines behavior settings for exam(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-12 text-[#000000]/50">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50 text-[#000000]" />
              <p className="font-bold uppercase tracking-widest">
                No exam rules configured
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Create global or exam-specific rules to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-none border-2 border-[#000000] bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 border-2 border-[#000000] flex items-center justify-center shrink-0 ${rule.exam_id ? "bg-[#6BCB77]" : "bg-[#0075CF]"}`}
                      >
                        {rule.exam_id ? (
                          <Gavel className="h-5 w-5 text-white" />
                        ) : (
                          <Settings className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
                          {getExamTitle(rule.exam_id)}
                        </h4>
                        <Badge
                          className={`text-[10px] font-black uppercase tracking-widest border-2 border-[#000000] rounded-none ${rule.exam_id ? "bg-white text-[#000000]" : "bg-[#E9E9E9] text-[#000000]"}`}
                        >
                          {rule.exam_id ? "Exam-Specific" : "Global"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Button
                        size="icon"
                        onClick={() => openEdit(rule)}
                        className="bg-white text-[#000000] border-2 border-[#000000] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => deleteRule.mutate(rule.id)}
                        className="bg-white text-destructive border-2 border-destructive rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="flex items-center gap-2 p-2 border-2 border-[#000000] bg-[#E9E9E9]">
                      <Clock className="h-4 w-4 text-[#000000] flex-shrink-0" />
                      <div>
                        <p className="font-black text-[#000000] text-sm">
                          {rule.duration_minutes}m
                        </p>
                        <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                          Duration
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 border-2 border-[#000000] bg-[#E9E9E9]">
                      <RotateCcw className="h-4 w-4 text-[#000000] flex-shrink-0" />
                      <div>
                        <p className="font-black text-[#000000] text-sm">
                          {rule.max_attempts}
                        </p>
                        <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                          Attempts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 border-2 border-[#000000] bg-[#E9E9E9]">
                      <AlertTriangle
                        className={`h-4 w-4 flex-shrink-0 ${rule.negative_marking_value > 0 ? "text-[#FD5A1A]" : "text-[#000000]/60"}`}
                      />
                      <div>
                        <p className="font-black text-[#000000] text-sm">
                          {rule.negative_marking_value > 0
                            ? `-${rule.negative_marking_value}`
                            : "None"}
                        </p>
                        <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                          Neg. Mark
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 border-2 border-[#000000] bg-[#E9E9E9]">
                      <BookCheck className="h-4 w-4 text-[#000000] flex-shrink-0" />
                      <div>
                        <p className="font-black text-[#000000] text-sm">
                          {rule.passing_percentage}%
                        </p>
                        <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                          Pass %
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 border-2 border-[#000000] bg-[#E9E9E9]">
                      <Shield
                        className={`h-4 w-4 flex-shrink-0 ${rule.proctoring_enabled ? "text-[#FD5A1A]" : "text-[#000000]/60"}`}
                      />
                      <div>
                        <p className="font-black text-[#000000] text-sm">
                          {rule.proctoring_enabled ? "On" : "Off"}
                        </p>
                        <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                          Proctor
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {rule.shuffle_questions && (
                      <Badge className="bg-white text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none text-[10px] gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Shuffle className="h-3 w-3" /> Shuffle Q
                      </Badge>
                    )}
                    {rule.shuffle_options && (
                      <Badge className="bg-white text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none text-[10px] gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Shuffle className="h-3 w-3" /> Shuffle Opt
                      </Badge>
                    )}
                    {rule.show_results_immediately && (
                      <Badge className="bg-[#6BCB77] text-white border-2 border-[#000000] font-black uppercase tracking-widest rounded-none text-[10px] gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Eye className="h-3 w-3 text-[#000000]" />{" "}
                        <span className="text-[#000000]">Instant Results</span>
                      </Badge>
                    )}
                    {rule.allow_review && (
                      <Badge className="bg-[#0075CF] text-white border-2 border-[#000000] font-black uppercase tracking-widest rounded-none text-[10px] gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <BookCheck className="h-3 w-3" /> Review
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingRule}
        onOpenChange={(open) => !open && setEditingRule(null)}
      >
        <DialogContent className="sm:max-w-lg bg-white border-4 border-[#000000] rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 font-['Inter']">
          <DialogHeader className="p-6 border-b-4 border-[#000000] bg-[#FFD166]">
            <DialogTitle className="text-2xl font-black text-[#000000] uppercase tracking-wider">
              Edit Exam Rule
            </DialogTitle>
            <DialogDescription className="font-bold text-[#000000]/70 uppercase tracking-widest text-xs">
              Update the rule configuration
            </DialogDescription>
          </DialogHeader>
          <RuleFormContent isEdit />
          <DialogFooter className="p-6 border-t-4 border-[#000000] bg-[#E9E9E9] flex sm:justify-between items-center w-full">
            <Button
              className="bg-white text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all w-full sm:w-auto"
              onClick={() => setEditingRule(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#6BCB77] text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all w-full sm:w-auto mt-2 sm:mt-0"
              onClick={handleUpdate}
              disabled={updateRule.isPending}
            >
              {updateRule.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
