import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMockTestConfigs, useCreateMockTestConfig, useDeleteMockTestConfig } from '@/hooks/useManagerData';
import { useAuth } from '@/hooks/useAuth';
import { Plus, FileText, Trash2, Clock, ListChecks, Shuffle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export function MockTestManager() {
  const { user } = useAuth();
  const { data: configs = [], isLoading } = useMockTestConfigs();
  const createConfig = useCreateMockTestConfig();
  const deleteConfig = useDeleteMockTestConfig();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newConfig, setNewConfig] = useState({
    title: '',
    description: '',
    topics: '',
    question_count: 30,
    duration_minutes: 60,
    easy_percent: 30,
    medium_percent: 50,
    hard_percent: 20,
    is_active: true,
  });

  const handleCreate = async () => {
    if (!newConfig.title.trim() || !user?.id) return;
    await createConfig.mutateAsync({
      title: newConfig.title,
      description: newConfig.description || null,
      course_id: null,
      topics: newConfig.topics.split(',').map(t => t.trim()).filter(Boolean),
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
      title: '',
      description: '',
      topics: '',
      question_count: 30,
      duration_minutes: 60,
      easy_percent: 30,
      medium_percent: 50,
      hard_percent: 20,
      is_active: true,
    });
    setIsAddOpen(false);
  };

  const activeConfigs = configs.filter(c => c.is_active);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading mock tests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Mock Test Configuration</h3>
          <p className="text-sm text-muted-foreground">Configure practice tests for students</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Mock Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Mock Test</DialogTitle>
              <DialogDescription>Configure a new practice test</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g., JavaScript Fundamentals Test"
                  value={newConfig.title}
                  onChange={(e) => setNewConfig({ ...newConfig, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Test description (optional)"
                  value={newConfig.description}
                  onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Topics (comma-separated)</Label>
                <Input
                  placeholder="e.g., Variables, Functions, Arrays"
                  value={newConfig.topics}
                  onChange={(e) => setNewConfig({ ...newConfig, topics: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Questions</Label>
                  <Input
                    type="number"
                    min={5}
                    value={newConfig.question_count}
                    onChange={(e) => setNewConfig({ ...newConfig, question_count: parseInt(e.target.value) || 30 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input
                    type="number"
                    min={10}
                    value={newConfig.duration_minutes}
                    onChange={(e) => setNewConfig({ ...newConfig, duration_minutes: parseInt(e.target.value) || 60 })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Difficulty Mix</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Easy</span>
                    <span className="text-sm font-medium">{newConfig.easy_percent}%</span>
                  </div>
                  <Slider
                    value={[newConfig.easy_percent]}
                    max={100}
                    step={5}
                    onValueChange={([value]) => setNewConfig({ ...newConfig, easy_percent: value })}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-accent">Medium</span>
                    <span className="text-sm font-medium">{newConfig.medium_percent}%</span>
                  </div>
                  <Slider
                    value={[newConfig.medium_percent]}
                    max={100}
                    step={5}
                    onValueChange={([value]) => setNewConfig({ ...newConfig, medium_percent: value })}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-destructive">Hard</span>
                    <span className="text-sm font-medium">{newConfig.hard_percent}%</span>
                  </div>
                  <Slider
                    value={[newConfig.hard_percent]}
                    max={100}
                    step={5}
                    onValueChange={([value]) => setNewConfig({ ...newConfig, hard_percent: value })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={newConfig.is_active}
                  onCheckedChange={(checked) => setNewConfig({ ...newConfig, is_active: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createConfig.isPending}>
                {createConfig.isPending ? 'Creating...' : 'Create Mock Test'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Configs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeConfigs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {configs.length > 0 ? Math.round(configs.reduce((acc, c) => acc + c.question_count, 0) / configs.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Mock Test Configurations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {configs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Shuffle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No mock tests configured yet</p>
              <p className="text-sm">Create a mock test configuration to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((config) => (
                <div key={config.id} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{config.title}</h4>
                      <Badge variant={config.is_active ? 'default' : 'secondary'}>
                        {config.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteConfig.mutate(config.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {config.description && (
                    <p className="text-sm text-muted-foreground mb-3">{config.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <ListChecks className="h-4 w-4 text-muted-foreground" />
                      {config.question_count} questions
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {config.duration_minutes} min
                    </div>
                    {config.topics.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {config.topics.slice(0, 3).map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{topic}</Badge>
                        ))}
                        {config.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{config.topics.length - 3}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
