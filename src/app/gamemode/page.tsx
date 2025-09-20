'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';
import { BrainCircuit, Infinity, Timer, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';

type GameMode = "Timed" | "Endless" | "Challenge";

const gameModeIcons = {
  Timed: <Timer className="w-8 h-8" />,
  Endless: <Infinity className="w-8 h-8" />,
  Challenge: <Trophy className="w-8 h-8" />,
};

const gameModeDescriptions = {
  Timed: "Solve riddles against the clock. How many can you get in 60 seconds?",
  Endless: "Relax and solve riddles at your own pace. No timers, no pressure.",
  Challenge: "Test your skills with 3 lives. Make a mistake and you lose a life.",
}

export default function GameModePage() {
  const router = useRouter();
  const { user, setSelectedGameMode } = useUser();

  const handleModeSelect = (mode: GameMode) => {
    setSelectedGameMode(mode);
    router.push('/game');
  };

  if (!user.name) {
    // Redirect if user data is not set
    if (typeof window !== 'undefined') {
      router.push('/welcome');
    }
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 font-headline">
      <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2">
                <BrainCircuit className="w-8 h-8 text-primary" />
                <CardTitle className="text-3xl font-bold tracking-tighter">Select a Game Mode</CardTitle>
            </div>
          <CardDescription>Welcome, {user.name}! You have {user.points} points. Choose how you want to play.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(['Timed', 'Endless', 'Challenge'] as GameMode[]).map(mode => (
            <Button key={mode} variant="outline" className="w-full h-auto min-h-24 justify-start p-6 text-left" onClick={() => handleModeSelect(mode)}>
                <div className="flex items-center gap-4 w-full">
                    {gameModeIcons[mode]}
                    <div className="flex flex-col">
                        <p className="font-bold text-lg">{mode}</p>
                        <p className="text-sm text-muted-foreground whitespace-normal">{gameModeDescriptions[mode]}</p>
                    </div>
                </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
