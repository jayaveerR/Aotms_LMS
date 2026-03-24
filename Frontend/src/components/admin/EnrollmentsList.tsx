import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Search, 
  BookOpen, 
  Calendar, 
  CreditCard,
  Globe,
  RefreshCw,
  Mail,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Fingerprint,
  Loader2,
  Trash2
} from "lucide-react";
import { CourseEnrollment } from "@/hooks/useCourses";

interface EnrollmentsListProps {
  enrollments: CourseEnrollment[];
  loading: boolean;
  onUpdateStatus?: (id: string, status: 'active' | 'rejected') => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function EnrollmentsList({ enrollments, loading, onUpdateStatus, onDelete }: EnrollmentsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: 'active' | 'rejected') => {
    if (!onUpdateStatus) return;
    setProcessingId(id);
    try {
      await onUpdateStatus(id, status);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    setProcessingId(id);
    try {
      await onDelete(id);
    } finally {
      setProcessingId(null);
    }
  };

  // Get unique courses for filter
  const courses = [...new Set(enrollments.map(e => e.course_name).filter(Boolean))];

  const filteredEnrollments = enrollments.filter(e => {
    const matchesSearch = 
      e.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.user_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === "all" || e.course_name === filterCourse;
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 gap-1"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{enrollments.length}</p>
                <p className="text-xs text-muted-foreground font-medium">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
                <p className="text-xs text-muted-foreground font-medium">Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {new Set(enrollments.map(e => e.user_id)).size}
                </p>
                <p className="text-xs text-muted-foreground font-medium">Unique Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{enrollments.reduce((acc, e) => acc + parseInt(e.price?.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground font-medium">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, course or UUID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full sm:w-40">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Student Enrollments
          </CardTitle>
          <CardDescription>
            {filteredEnrollments.length} of {enrollments.length} enrollments
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No enrollments found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">UUID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-primary">
                                {enrollment.user_name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {enrollment.user_name || 'Unknown'}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="truncate">{enrollment.user_email}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md w-fit border border-border/50">
                            <Fingerprint className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                            {enrollment.user_id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="px-4 py-3 relative max-w-[200px]">
                          <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary break-words whitespace-normal text-left">
                            {enrollment.course_name}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold text-green-700">
                            {enrollment.price}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(enrollment.status || 'pending')}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> {formatDate(enrollment.enrollment_date).split(',')[0]}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> {formatDate(enrollment.enrollment_date).split(',')[1]}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {(enrollment.status === 'pending' || !enrollment.status) && onUpdateStatus && (
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                disabled={processingId === enrollment.id}
                                className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleUpdateStatus(enrollment.id, 'active')}
                              >
                                {processingId === enrollment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                disabled={processingId === enrollment.id}
                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleUpdateStatus(enrollment.id, 'rejected')}
                              >
                                Reject
                              </Button>
                              {onDelete && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 ml-1"
                                  onClick={() => handleDelete(enrollment.id)}
                                  disabled={processingId === enrollment.id}
                                  title="Delete Enrollment"
                                >
                                  {processingId === enrollment.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          )}
                          {enrollment.status === 'active' && (
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" disabled className="h-8 text-green-600 font-semibold opacity-100 bg-green-50">
                                Approved
                              </Button>
                              {onDelete && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                                  onClick={() => handleDelete(enrollment.id)}
                                  disabled={processingId === enrollment.id}
                                  title="Delete Enrollment"
                                >
                                  {processingId === enrollment.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          )}
                          {enrollment.status === 'rejected' && onDelete && (
                            <div className="flex items-center gap-2">
                               <Button size="sm" variant="ghost" disabled className="h-8 text-red-600 font-semibold opacity-100 bg-red-50">
                                Rejected
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                                onClick={() => handleDelete(enrollment.id)}
                                disabled={processingId === enrollment.id}
                                title="Delete Enrollment"
                              >
                                {processingId === enrollment.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden bg-slate-50/50">
                {filteredEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="bg-white border rounded-2xl p-4 shadow-sm space-y-4 relative overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <span className="text-sm font-bold text-primary">
                            {enrollment.user_name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {enrollment.user_name}
                          </h4>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{enrollment.user_email}</span>
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 mt-1">
                        {getStatusBadge(enrollment.status || 'pending')}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Course</p>
                        <p className="text-xs font-semibold text-slate-800 line-clamp-2">{enrollment.course_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Amount</p>
                        <span className="text-sm font-black text-green-600 block">{enrollment.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5 font-mono bg-slate-50 border border-slate-200 px-2 py-1 rounded truncate max-w-[45%]">
                        <Fingerprint className="h-3 w-3 shrink-0 opacity-50" />
                        <span className="truncate text-[10px]">{enrollment.user_id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium shrink-0">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {formatDate(enrollment.enrollment_date).split(',')[0]}
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      {(enrollment.status === 'pending' || !enrollment.status) && onUpdateStatus && (
                        <div className="flex items-center justify-end gap-2 w-full">
                          <Button 
                            variant="ghost"
                            disabled={processingId === enrollment.id}
                            className="flex-1 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold"
                            onClick={() => handleUpdateStatus(enrollment.id, 'rejected')}
                          >
                            Reject
                          </Button>
                          <Button 
                            variant="default"
                            disabled={processingId === enrollment.id}
                            className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-sm"
                            onClick={() => handleUpdateStatus(enrollment.id, 'active')}
                          >
                            {processingId === enrollment.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Approve"}
                          </Button>
                          {onDelete && (
                            <Button
                              variant="ghost"
                              className="h-9 w-9 p-0 shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100"
                              onClick={() => handleDelete(enrollment.id)}
                              disabled={processingId === enrollment.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {enrollment.status === 'active' && onDelete && (
                        <div className="flex justify-end gap-2 text-right">
                          <Button 
                            variant="outline" 
                            className="flex-1 h-9 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold w-full"
                            onClick={() => handleDelete(enrollment.id)}
                            disabled={processingId === enrollment.id}
                          >
                            {processingId === enrollment.id ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 mr-2" />} Delete Access
                          </Button>
                        </div>
                      )}

                      {enrollment.status === 'rejected' && onDelete && (
                        <div className="flex justify-end gap-2 text-right">
                          <Button 
                            variant="outline" 
                            className="flex-1 h-9 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold w-full"
                            onClick={() => handleDelete(enrollment.id)}
                            disabled={processingId === enrollment.id}
                          >
                            {processingId === enrollment.id ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 mr-2" />} Remove Record
                          </Button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
