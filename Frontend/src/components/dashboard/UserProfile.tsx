
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ProfileData {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    bio: string | null;
    phone: string | null;
    location: string | null;
    skills: string[];
}

const API_URL = 'http://localhost:5000/api';

export function UserProfile() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        id: '',
        full_name: '',
        email: '',
        avatar_url: '',
        bio: '',
        phone: '',
        location: '',
        skills: []
    });

    const fetchProfile = useCallback(async () => {
        try {
            if (!user) return;
            const token = localStorage.getItem('access_token');

            const res = await fetch(`${API_URL}/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch profile');

            const result = await res.json();
            const data = result.profile;
            const userData = result.user;

            // Merge with user metadata for fallback
            setProfile({
                id: user.id,
                full_name: data.full_name || userData?.user_metadata?.full_name || '',
                email: userData?.email || '',
                avatar_url: data.avatar_url || userData?.user_metadata?.avatar_url || '',
                // These fields might not exist in the schema yet, handle gracefully
                bio: (data as Record<string, unknown>).bio as string || '',
                phone: (data as Record<string, unknown>).phone as string || '',
                location: (data as Record<string, unknown>).location as string || '',
                skills: (data as Record<string, unknown>).skills as string[] || []
            });
        } catch (error: unknown) {
            console.error('Error fetching profile:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            toast({
                title: 'Error loading profile',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user, fetchProfile]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            const updates = {
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
                // Add extra fields if schema supports them
                // bio: profile.bio,
                // phone: profile.phone,
                // location: profile.location,
                // skills: profile.skills
            };

            const res = await fetch(`${API_URL}/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Update failed');
            }

            toast({
                title: 'Success',
                description: 'Profile updated successfully',
            });
        } catch (error: unknown) {
            console.error('Error updating profile:', error);
            const errorMessage = error instanceof Error ? error.message : 'Update failed';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Profile Card */}
                <Card className="md:col-span-4 h-fit">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 relative group">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                                <AvatarImage src={profile.avatar_url || ''} />
                                <AvatarFallback className="text-2xl">{profile.full_name?.[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardTitle>{profile.full_name}</CardTitle>
                        <CardDescription>{profile.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground text-center">
                            Student • Joined {new Date().getFullYear()}
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                <Card className="md:col-span-8">
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                        <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={profile.full_name || ''}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={profile.email || ''}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio (Coming Soon)</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us about yourself..."
                                    value={profile.bio || ''}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    disabled // Disabled until schema update
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
