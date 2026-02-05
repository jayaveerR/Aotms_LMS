import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGuestCredentials, useCreateGuestCredential, useDeleteGuestCredential } from '@/hooks/useManagerData';
import { useAuth } from '@/hooks/useAuth';
import { Plus, UserPlus, Trash2, Key, Clock, Shield, Copy, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { format, isPast } from 'date-fns';

export function GuestCredentialsManager() {
  const { user } = useAuth();
  const { data: credentials = [], isLoading } = useGuestCredentials();
  const createCredential = useCreateGuestCredential();
  const deleteCredential = useDeleteGuestCredential();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newCredential, setNewCredential] = useState({
    username: '',
    password: '',
    display_name: '',
    access_level: 'view_only',
    expires_at: '',
    max_sessions: 1,
  });

  const generateUsername = () => {
    const prefix = 'guest_';
    const random = Math.random().toString(36).substring(2, 8);
    setNewCredential({ ...newCredential, username: prefix + random });
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCredential({ ...newCredential, password });
  };

  const handleCreate = async () => {
    if (!newCredential.username || !newCredential.password || !newCredential.display_name || !newCredential.expires_at || !user?.id) return;
    await createCredential.mutateAsync({
      username: newCredential.username,
      password_hash: newCredential.password, // In production, hash this
      display_name: newCredential.display_name,
      access_level: newCredential.access_level,
      expires_at: new Date(newCredential.expires_at).toISOString(),
      max_sessions: newCredential.max_sessions,
      allowed_courses: [],
      is_active: true,
      created_by: user.id,
    });
    setNewCredential({
      username: '',
      password: '',
      display_name: '',
      access_level: 'view_only',
      expires_at: '',
      max_sessions: 1,
    });
    setIsAddOpen(false);
  };

  const copyCredentials = (username: string, password: string, id: string) => {
    navigator.clipboard.writeText(`Username: ${username}\nPassword: ${password}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeCredentials = credentials.filter(c => c.is_active && !isPast(new Date(c.expires_at)));
  const expiredCredentials = credentials.filter(c => !c.is_active || isPast(new Date(c.expires_at)));

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading credentials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Guest Credentials</h3>
          <p className="text-sm text-muted-foreground">Create and manage guest accounts</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Guest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Guest Credential</DialogTitle>
              <DialogDescription>Generate a temporary guest account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  placeholder="e.g., Demo User"
                  value={newCredential.display_name}
                  onChange={(e) => setNewCredential({ ...newCredential, display_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Username</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={generateUsername}>
                    Generate
                  </Button>
                </div>
                <Input
                  value={newCredential.username}
                  onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={generatePassword}>
                    Generate
                  </Button>
                </div>
                <Input
                  type="text"
                  value={newCredential.password}
                  onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <Select
                    value={newCredential.access_level}
                    onValueChange={(value) => setNewCredential({ ...newCredential, access_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Demo</SelectItem>
                      <SelectItem value="view_only">View Only</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="full">Full Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Sessions</Label>
                  <Input
                    type="number"
                    min={1}
                    value={newCredential.max_sessions}
                    onChange={(e) => setNewCredential({ ...newCredential, max_sessions: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expires At</Label>
                <Input
                  type="datetime-local"
                  value={newCredential.expires_at}
                  onChange={(e) => setNewCredential({ ...newCredential, expires_at: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createCredential.isPending}>
                {createCredential.isPending ? 'Creating...' : 'Create Credential'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credentials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCredentials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{expiredCredentials.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Active Guest Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeCredentials.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No active guest accounts</p>
          ) : (
            <div className="space-y-3">
              {activeCredentials.map((cred) => (
                <div key={cred.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{cred.display_name}</h4>
                      <Badge variant="outline">{cred.access_level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">@{cred.username}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expires {format(new Date(cred.expires_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyCredentials(cred.username, cred.password_hash, cred.id)}
                  >
                    {copiedId === cred.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteCredential.mutate(cred.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
