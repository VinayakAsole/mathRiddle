
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser, type LeaderboardEntry } from '@/context/UserContext';
import { Trophy, ArrowLeft, Timer, Infinity as InfinityIcon, ShieldQuestion } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const GameModeIcon = ({ mode }: { mode: LeaderboardEntry['mode'] }) => {
    switch (mode) {
        case 'Timed': return <Timer className="w-4 h-4 text-primary" title="Timed Mode" />;
        case 'Endless': return <InfinityIcon className="w-4 h-4 text-accent" title="Endless Mode" />;
        case 'Challenge': return <ShieldQuestion className="w-4 h-4 text-destructive" title="Challenge Mode" />;
        default: return null;
    }
};

function formatDuration(seconds: number) {
    if (seconds === 0) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { leaderboard } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 font-headline">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl">
        <CardHeader className="text-center relative">
          <Button variant="outline" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex justify-center items-center gap-2">
            <Trophy className="w-8 h-8 text-accent" />
            <CardTitle className="text-3xl font-bold tracking-tighter">Leaderboard</CardTitle>
          </div>
          <CardDescription>Top 20 Players - All Game Modes</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg max-h-96 overflow-y-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-12 text-center">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-center">Mode</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {isClient && leaderboard.length > 0 ? (
                        leaderboard.map((entry, index) => (
                        <TableRow key={`${entry.date}-${entry.name}-${index}`}>
                            <TableCell className="font-bold text-center">{index + 1}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell className="flex justify-center items-center">
                                <GameModeIcon mode={entry.mode} />
                            </TableCell>
                            <TableCell className="text-right font-semibold">{entry.points}</TableCell>
                            <TableCell className="text-right">{formatDuration(entry.time)}</TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                            No scores yet. Be the first!
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
