import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLeaderboard, useVerifyLeaderboardEntry } from '@/hooks/useManagerData';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Medal, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react';

export function LeaderboardManager() {
  const { user } = useAuth();
  const { data: leaderboard = [], isLoading } = useLeaderboard();
  const verifyEntry = useVerifyLeaderboardEntry();

  const handleVerify = async (id: string) => {
    if (!user?.id) return;
    await verifyEntry.mutateAsync({ id, verified_by: user.id });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="font-bold text-muted-foreground">#{rank}</span>;
  };

  const verifiedCount = leaderboard.filter(e => e.is_verified).length;
  const unverifiedCount = leaderboard.filter(e => !e.is_verified).length;

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Leaderboard Management</h3>
          <p className="text-sm text-muted-foreground">Verify and manage student rankings</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            {verifiedCount} Verified
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Shield className="h-3 w-3" />
            {unverifiedCount} Pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard.length}</div>
            <p className="text-xs text-muted-foreground">on the leaderboard</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard.length > 0 ? leaderboard[0]?.total_score || 0 : 0}
            </div>
            <p className="text-xs text-muted-foreground">points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboard.length > 0 
                ? Math.round(leaderboard.reduce((acc, e) => acc + (e.average_percentage || 0), 0) / leaderboard.length) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Student Rankings
          </CardTitle>
          <CardDescription>Click to verify student scores</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No leaderboard entries yet</p>
              <p className="text-sm">Students will appear here after completing exams</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                    idx < 3 ? 'bg-accent/10' : 'bg-muted/50'
                  }`}
                >
                  <div className="w-10 flex items-center justify-center">
                    {getRankIcon(idx + 1)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{entry.student_name}</h4>
                      {entry.is_verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{entry.exams_completed || 0} exams</span>
                      <span>{entry.average_percentage || 0}% avg</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{entry.total_score || 0}</div>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                  {!entry.is_verified && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleVerify(entry.id)}
                      disabled={verifyEntry.isPending}
                    >
                      <Shield className="h-4 w-4" />
                      Verify
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
