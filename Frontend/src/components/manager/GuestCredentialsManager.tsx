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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGuestCredentials,
  useCreateGuestCredential,
  useDeleteGuestCredential,
} from "@/hooks/useManagerData";
import { useAuth } from "@/hooks/useAuth";
import {
  Plus,
  UserPlus,
  Trash2,
  Key,
  Clock,
  Shield,
  Copy,
  Check,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { format, isPast } from "date-fns";

export function GuestCredentialsManager() {
  const { user } = useAuth();
  const { data: credentials = [], isLoading } = useGuestCredentials();
  const createCredential = useCreateGuestCredential();
  const deleteCredential = useDeleteGuestCredential();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newCredential, setNewCredential] = useState({
    username: "",
    password: "",
    display_name: "",
    access_level: "view_only",
    expires_at: "",
    max_sessions: 1,
  });

  const generateUsername = () => {
    const prefix = "guest_";
    const random = Math.random().toString(36).substring(2, 8);
    setNewCredential({ ...newCredential, username: prefix + random });
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCredential({ ...newCredential, password });
  };

  const handleCreate = async () => {
    if (
      !newCredential.username ||
      !newCredential.password ||
      !newCredential.display_name ||
      !newCredential.expires_at ||
      !user?.id
    )
      return;
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
      username: "",
      password: "",
      display_name: "",
      access_level: "view_only",
      expires_at: "",
      max_sessions: 1,
    });
    setIsAddOpen(false);
  };

  const copyCredentials = (username: string, password: string, id: string) => {
    navigator.clipboard.writeText(
      `Username: ${username}\nPassword: ${password}`,
    );
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeCredentials = credentials.filter(
    (c) => c.is_active && !isPast(new Date(c.expires_at)),
  );
  const expiredCredentials = credentials.filter(
    (c) => !c.is_active || isPast(new Date(c.expires_at)),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading credentials...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Inter']">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider">
            Guest Credentials
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest">
            Create and manage guest accounts
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FD5A1A] text-white border-2 border-[#000000] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none gap-2">
              <Plus className="h-4 w-4" />
              Create Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white border-4 border-[#000000] rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 font-['Inter']">
            <DialogHeader className="p-6 border-b-4 border-[#000000] bg-[#FFD166]">
              <DialogTitle className="text-2xl font-black text-[#000000] uppercase tracking-wider">
                Create Guest Credential
              </DialogTitle>
              <DialogDescription className="font-bold text-[#000000]/70 uppercase tracking-widest text-xs">
                Generate a temporary guest account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-6 bg-white">
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                  Display Name
                </Label>
                <Input
                  placeholder="e.g., Demo User"
                  className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
                  value={newCredential.display_name}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      display_name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                    Username
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateUsername}
                    className="h-6 text-[10px] font-black uppercase tracking-widest border-2 border-[#000000] rounded-none"
                  >
                    Generate
                  </Button>
                </div>
                <Input
                  className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
                  value={newCredential.username}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                    Password
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generatePassword}
                    className="h-6 text-[10px] font-black uppercase tracking-widest border-2 border-[#000000] rounded-none"
                  >
                    Generate
                  </Button>
                </div>
                <Input
                  type="text"
                  className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
                  value={newCredential.password}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                    Access Level
                  </Label>
                  <Select
                    value={newCredential.access_level}
                    onValueChange={(value) =>
                      setNewCredential({
                        ...newCredential,
                        access_level: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-[#000000] rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <SelectItem
                        value="demo"
                        className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
                      >
                        Demo
                      </SelectItem>
                      <SelectItem
                        value="view_only"
                        className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
                      >
                        View Only
                      </SelectItem>
                      <SelectItem
                        value="limited"
                        className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
                      >
                        Limited
                      </SelectItem>
                      <SelectItem
                        value="full"
                        className="font-bold cursor-pointer focus:bg-[#E9E9E9]"
                      >
                        Full Access
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                    Max Sessions
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
                    value={newCredential.max_sessions}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        max_sessions: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#000000] uppercase tracking-widest">
                  Expires At
                </Label>
                <Input
                  type="datetime-local"
                  className="bg-[#E9E9E9] border-2 border-[#000000] rounded-none font-bold text-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 transition-all placeholder:text-[#000000]/50"
                  value={newCredential.expires_at}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      expires_at: e.target.value,
                    })
                  }
                />
              </div>
            </div>
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
                disabled={createCredential.isPending}
              >
                {createCredential.isPending
                  ? "Creating..."
                  : "Create Credential"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Total Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {credentials.length}
            </div>
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
              {activeCredentials.length}
            </div>
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
              {expiredCredentials.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Credentials */}
      <Card className="bg-white rounded-none border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black text-[#000000] uppercase tracking-wider">
            <UserPlus className="h-6 w-6 text-[#0075CF]" />
            Active Guest Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeCredentials.length === 0 ? (
            <p className="text-center py-8 font-bold text-[#000000]/60 uppercase tracking-widest">
              No active guest accounts
            </p>
          ) : (
            <div className="space-y-3">
              {activeCredentials.map((cred) => (
                <div
                  key={cred.id}
                  className="flex items-center gap-4 p-4 rounded-none border-2 border-[#000000] bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E9E9E9] transition-colors"
                >
                  <div className="h-10 w-10 border-2 border-[#000000] bg-[#0075CF] flex items-center justify-center shrink-0">
                    <Key className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
                        {cred.display_name}
                      </h4>
                      <Badge className="bg-white text-[#000000] border-2 border-[#000000] font-black uppercase tracking-widest text-[10px]">
                        {cred.access_level}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
                      @{cred.username}
                    </p>
                  </div>
                  <div className="text-right text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expires {format(new Date(cred.expires_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    onClick={() =>
                      copyCredentials(
                        cred.username,
                        cred.password_hash,
                        cred.id,
                      )
                    }
                    className="bg-white text-[#000000] border-2 border-[#000000] rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ml-2"
                  >
                    {copiedId === cred.id ? (
                      <Check className="h-4 w-4 text-[#6BCB77]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => deleteCredential.mutate(cred.id)}
                    className="bg-white text-destructive border-2 border-destructive rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
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
