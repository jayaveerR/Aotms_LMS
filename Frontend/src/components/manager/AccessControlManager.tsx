import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    useGuestCredentials,
    useUpdateGuestCredential,
    useCourses,
    type GuestCredential,
} from '@/hooks/useManagerData';
import {
    Shield, Lock, Unlock, Eye, EyeOff, Globe, Users,
    Settings, Search, CheckCircle, XCircle, Clock, KeyRound
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { format, isPast } from 'date-fns';

export function AccessControlManager() {
    const { data: credentials = [], isLoading: credsLoading } = useGuestCredentials();
    const { data: courses = [] } = useCourses();
    const updateCredential = useUpdateGuestCredential();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCred, setEditingCred] = useState<GuestCredential | null>(null);
    const [editForm, setEditForm] = useState({
        access_level: '',
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

    const filteredCredentials = credentials.filter(c =>
        c.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = credentials.filter(c => c.is_active && !isPast(new Date(c.expires_at))).length;
    const expiredCount = credentials.filter(c => isPast(new Date(c.expires_at))).length;
    const disabledCount = credentials.filter(c => !c.is_active).length;

    const accessLevelConfig: Record<string, { label: string; icon: typeof Shield; color: string; description: string }> = {
        demo: { label: 'Demo', icon: Eye, color: 'text-blue-500', description: 'View demo content only' },
        view_only: { label: 'View Only', icon: EyeOff, color: 'text-gray-500', description: 'Browse courses, no interaction' },
        limited: { label: 'Limited', icon: Lock, color: 'text-yellow-500', description: 'View + attempt select exams' },
        full: { label: 'Full Access', icon: Unlock, color: 'text-green-500', description: 'Full student-level access' },
    };

    const toggleCourseAccess = (courseId: string) => {
        setEditForm(prev => ({
            ...prev,
            allowed_courses: prev.allowed_courses.includes(courseId)
                ? prev.allowed_courses.filter(id => id !== courseId)
                : [...prev.allowed_courses, courseId],
        }));
    };

    if (credsLoading) {
        return <div className="flex items-center justify-center p-8">Loading access control data...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Access Control</h3>
                    <p className="text-sm text-muted-foreground">Manage and assign limited access to guest users</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search guests..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Guests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{credentials.length}</div>
                        <p className="text-xs text-muted-foreground">configured accounts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                        <p className="text-xs text-green-600">currently accessible</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Expired</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">{expiredCount}</div>
                        <p className="text-xs text-amber-500">past expiry date</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Disabled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{disabledCount}</div>
                        <p className="text-xs text-red-500">manually disabled</p>
                    </CardContent>
                </Card>
            </div>

            {/* Access Level Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Access Level Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-4">
                        {Object.entries(accessLevelConfig).map(([level, config]) => {
                            const count = credentials.filter(c => c.access_level === level).length;
                            const IconComp = config.icon;
                            return (
                                <div key={level} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <div className={`h-10 w-10 rounded-lg bg-background flex items-center justify-center`}>
                                        <IconComp className={`h-5 w-5 ${config.color}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{config.label}</span>
                                            <Badge variant="outline" className="text-xs">{count}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{config.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Guest Accounts List with Access Control */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary" />
                        Guest Access Permissions
                    </CardTitle>
                    <CardDescription>Click the settings icon to modify access levels and course permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredCredentials.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No guest accounts found</p>
                            <p className="text-sm">Create guest accounts from the Guest Credentials tab first</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredCredentials.map((cred) => {
                                const isExpired = isPast(new Date(cred.expires_at));
                                const levelConfig = accessLevelConfig[cred.access_level] || accessLevelConfig.view_only;
                                const LevelIcon = levelConfig.icon;

                                return (
                                    <div
                                        key={cred.id}
                                        className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${!cred.is_active || isExpired
                                            ? 'bg-muted/30 border-muted opacity-70'
                                            : 'bg-card hover:bg-muted/20'
                                            }`}
                                    >
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${cred.is_active && !isExpired ? 'bg-green-100 dark:bg-green-950/40' : 'bg-muted'
                                            }`}>
                                            {cred.is_active && !isExpired ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium truncate">{cred.display_name}</h4>
                                                <Badge variant="outline" className="gap-1 text-xs">
                                                    <LevelIcon className={`h-3 w-3 ${levelConfig.color}`} />
                                                    {levelConfig.label}
                                                </Badge>
                                                {isExpired && <Badge variant="destructive" className="text-xs">Expired</Badge>}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                <span>@{cred.username}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Expires {format(new Date(cred.expires_at), 'MMM d, yyyy')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Globe className="h-3 w-3" />
                                                    {cred.max_sessions || 1} session{(cred.max_sessions || 1) > 1 ? 's' : ''}
                                                </span>
                                                {(cred.allowed_courses?.length || 0) > 0 && (
                                                    <span>{cred.allowed_courses?.length} courses allowed</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-xs text-muted-foreground">Active</Label>
                                                <Switch
                                                    checked={cred.is_active !== false}
                                                    onCheckedChange={() => handleToggleActive(cred)}
                                                    disabled={updateCredential.isPending}
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(cred)}
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
            <Dialog open={!!editingCred} onOpenChange={(open) => !open && setEditingCred(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Edit Access — {editingCred?.display_name}
                        </DialogTitle>
                        <DialogDescription>
                            Configure access level and course permissions for this guest user
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-2">
                            <Label>Access Level</Label>
                            <Select
                                value={editForm.access_level}
                                onValueChange={(value) => setEditForm({ ...editForm, access_level: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(accessLevelConfig).map(([level, config]) => (
                                        <SelectItem key={level} value={level}>
                                            <span className="flex items-center gap-2">
                                                <config.icon className={`h-4 w-4 ${config.color}`} />
                                                {config.label} — {config.description}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Max Concurrent Sessions</Label>
                            <Input
                                type="number"
                                min={1}
                                max={10}
                                value={editForm.max_sessions}
                                onChange={(e) => setEditForm({ ...editForm, max_sessions: parseInt(e.target.value) || 1 })}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label>Account Active</Label>
                            <Switch
                                checked={editForm.is_active}
                                onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Allowed Courses</Label>
                            <p className="text-xs text-muted-foreground">
                                Select which courses this guest can access. If none selected, general access rules apply.
                            </p>
                            {courses.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No courses available</p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${editForm.allowed_courses.includes(course.id)
                                                ? 'bg-primary/5 border-primary/30'
                                                : 'bg-muted/20 hover:bg-muted/40'
                                                }`}
                                            onClick={() => toggleCourseAccess(course.id)}
                                        >
                                            <div className={`h-5 w-5 rounded border flex items-center justify-center ${editForm.allowed_courses.includes(course.id)
                                                ? 'bg-primary border-primary'
                                                : 'border-muted-foreground/30'
                                                }`}>
                                                {editForm.allowed_courses.includes(course.id) && (
                                                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{course.title}</p>
                                                {course.description && (
                                                    <p className="text-xs text-muted-foreground truncate">{course.description}</p>
                                                )}
                                            </div>
                                            {course.is_published ? (
                                                <Badge variant="outline" className="text-xs">Published</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs">Draft</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {editForm.allowed_courses.length > 0 && (
                                <p className="text-xs text-primary">{editForm.allowed_courses.length} course(s) selected</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingCred(null)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={updateCredential.isPending}>
                            {updateCredential.isPending ? 'Saving...' : 'Save Access Controls'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
