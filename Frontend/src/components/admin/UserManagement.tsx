import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Search,
  Plus,
  Edit,
  Lock,
  Unlock,
  UserCog,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { Profile } from "@/hooks/useAdminData";
import { reactivateUser, suspendUser } from "@/lib/attendanceService";

interface UserManagementProps {
  users: Profile[];
  loading: boolean;
  roleCounts: Record<string, number>;
  onUpdateStatus: (
    userId: string,
    status: "active" | "suspended",
  ) => Promise<boolean>;
  onUpdateRole: (
    userId: string,
    role: "admin" | "manager" | "instructor" | "student",
  ) => Promise<boolean>;
  initialRoleFilter?: string;
}

export function UserManagement({
  users,
  loading,
  roleCounts,
  onUpdateStatus,
  onUpdateRole,
  initialRoleFilter = "all",
}: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>(initialRoleFilter);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState<string>("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async () => {
    if (selectedUser && newRole) {
      await onUpdateRole(
        selectedUser.id,
        newRole as "admin" | "manager" | "instructor" | "student",
      );
      setShowRoleDialog(false);
      setSelectedUser(null);
      setNewRole("");
    }
  };

  useEffect(() => {
    setRoleFilter(initialRoleFilter);
  }, [initialRoleFilter]);

  const formatLastActive = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const getRoleBadgeVariant = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "default";
      case "manager":
        return "secondary";
      case "instructor":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage all platform users ({users.length} total)
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 w-full sm:w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Filter role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p>No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-3xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 sm:hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium text-sm sm:text-base">
                        {user.full_name || "Unknown"}
                      </h4>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role || "student"}
                      </Badge>
                      {user.status === "suspended" && (
                        <Badge variant="destructive">suspended</Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium">
                      {user.full_name || "Unknown"}
                    </h4>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role || "student"}
                    </Badge>
                    {user.status === "suspended" && (
                      <Badge variant="destructive">suspended</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-muted">
                  <div className="text-xs sm:text-sm text-muted-foreground mr-auto sm:mr-0">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formatLastActive(user.last_active_at)}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Change Role"
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role || "student");
                        setShowRoleDialog(true);
                      }}
                    >
                      <UserCog className="h-4 w-4" />
                    </Button>
                    {user.status === "active" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Suspend"
                        onClick={async () => {
                          await onUpdateStatus(user.id, "suspended");
                          await suspendUser(user.id);
                        }}
                      >
                        <Lock className="h-4 w-4 text-destructive" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Activate"
                        onClick={async () => {
                          await onUpdateStatus(user.id, "active");
                          await reactivateUser(user.id);
                        }}
                      >
                        <Unlock className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Role Management Sidebar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-accent" />
            Role Management
          </CardTitle>
          <CardDescription>User role distribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-3xl bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Students</span>
              <Badge>{roleCounts.student || 0}</Badge>
            </div>
          </div>
          <div className="p-4 rounded-3xl bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Instructors</span>
              <Badge>{roleCounts.instructor || 0}</Badge>
            </div>
          </div>
          <div className="p-4 rounded-3xl bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Managers</span>
              <Badge>{roleCounts.manager || 0}</Badge>
            </div>
          </div>
          <div className="p-4 rounded-3xl bg-primary/10">
            <div className="flex justify-between items-center">
              <span className="font-medium text-primary">Admins</span>
              <Badge variant="default">{roleCounts.admin || 0}</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Manage Permissions
          </Button>
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change role for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
