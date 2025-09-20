
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { BrainCircuit, CheckCircle2, Heart, Home, Infinity, Lightbulb, Loader2, Store, Timer, Trophy, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getHintAction } from "@/app/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { riddles } from "@/lib/riddles";
import { cn } from "@/lib/utils";

const AnswerFormSchema = z.object({
  answer: z.coerce.number({
    invalid_type_error: "Please enter a number.",
  }),
});

type GameMode = "Timed" | "Endless" | "Challenge";
type GameStatus = 'playing' | 'completed';

const TOTAL_LEVELS = 50;
const HINT_COST = 10;

export default function GamePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, selectedGameMode, addPoints, resetProgressForMode, spendPoints } = useUser();
  const gameMode = selectedGameMode;
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | "timesup" | null>(null);
  
  const [hintsRemaining, setHintsRemaining] = useState(5);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [isHintLoading, startHintTransition] = useTransition();

  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const startTimeRef = useRef<number | null>(null);
  const [completionTime, setCompletionTime] = useState<string | null>(null);

  const form = useForm<z.infer<typeof AnswerFormSchema>>({
    resolver: zodResolver(AnswerFormSchema),
    defaultValues: {
      answer: undefined,
    },
  });
  
  useEffect(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
  }, []);

  useEffect(() => {
    if (!user.name || !gameMode) {
      router.push('/welcome');
    } else {
      setIsLoading(false);
    }
  }, [user.name, gameMode, router]);


  const currentRiddle = riddles[currentLevel % riddles.length];

  const goToNextLevel = () => {
    if (currentLevel + 1 < TOTAL_LEVELS) {
        setCurrentLevel(prev => prev + 1);
    } else {
        handleGameCompletion();
    }
  };

  const resetLevel = () => {
    setFeedback(null);
    form.reset({ answer: undefined });
    form.clearErrors("answer");
    setCurrentHint(null);
    setHintLevel(0);
    if(gameMode === 'Timed') setTimeLeft(60);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameMode === 'Timed' && gameStatus === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (gameMode === 'Timed' && gameStatus === 'playing' && timeLeft === 0 && feedback === null) {
      setFeedback('timesup');
      setTimeout(() => {
        goToNextLevel();
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameMode, gameStatus, currentLevel, feedback]);

  useEffect(() => {
    if (isLoading) return;
    resetLevel();
  }, [currentLevel, gameMode, isLoading]);
  
  const handlePlayAgain = () => {
    resetProgressForMode(gameMode!);
    setCurrentLevel(0);
    setUnlockedLevels(1);
    setLives(3);
    setTimeLeft(60);
    setGameStatus('playing');
    startTimeRef.current = Date.now();
    setCompletionTime(null);
    router.push('/gamemode');
  };
  
  const handleGameCompletion = () => {
    setGameStatus('completed');
    if (startTimeRef.current) {
      const endTime = Date.now();
      const duration = Math.round((endTime - startTimeRef.current) / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      setCompletionTime(`${minutes}m ${seconds}s`);
    }
    toast({
      title: "Congratulations!",
      description: `You've completed all the riddles!`,
    });
  }

  async function onSubmit(data: z.infer<typeof AnswerFormSchema>) {
    if(feedback !== null || gameStatus !== 'playing') return;

    if (data.answer === currentRiddle.answer) {
      setFeedback("correct");
      addPoints(10);
      toast({
        title: "Correct! +10 points",
        description: "On to the next challenge!",
      });
      setTimeout(() => {
        setUnlockedLevels(prev => Math.max(prev, currentLevel + 2));
        goToNextLevel();
      }, 1500);
    } else {
      setFeedback("incorrect");
      if(gameMode === 'Challenge') {
        setLives(l => l - 1);
        if(lives - 1 <= 0) {
          toast({
            title: "Game Over",
            description: "You've run out of lives.",
            variant: "destructive",
          });
           setTimeout(() => handlePlayAgain(), 2000);
           return;
        }
      } else if (gameMode === 'Timed') {
        setTimeout(() => {
          goToNextLevel();
        }, 2000);
        return;
      }
      form.setError("answer", { message: "Not quite, try again!" });
      setTimeout(() => {
        setFeedback(null);
        form.clearErrors("answer");
      }, 2000);
    }
  }

  function handleGetHint() {
    if (hintsRemaining <= 0) {
      toast({
        title: "No hints left!",
        description: "Visit the store to buy more hints.",
        variant: "destructive"
      });
      return;
    }
    
    if (hintLevel >= 3) {
       toast({
        title: "Max hints reached!",
        description: "You've already received the most specific hint for this riddle.",
      });
      return;
    }

    startHintTransition(async () => {
      const newHintLevel = hintLevel + 1;
      const result = await getHintAction({ riddle: currentRiddle.riddle, hintLevel: newHintLevel });
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        setCurrentHint(result.hint!);
        setHintLevel(newHintLevel);
        setHintsRemaining(h => h - 1);
      }
    });
  }
  
  function handleBuyHint() {
    if (user.points >= HINT_COST) {
      spendPoints(HINT_COST);
      setHintsRemaining(h => h + 1);
      toast({
        title: "Hint purchased!",
        description: `You have ${hintsRemaining + 1} hints remaining.`,
      });
    } else {
      toast({
        title: "Not enough points!",
        description: `You need ${HINT_COST} points to buy a hint.`,
        variant: "destructive",
      });
    }
  }


  const getLevelStatus = (levelIndex: number) => {
    if (levelIndex < currentLevel) return "solved";
    if (levelIndex === currentLevel) return "current";
    if (levelIndex < unlockedLevels) return "unlocked";
    return "locked";
  };
  
  const levelStatusStyles = {
    solved: "bg-accent text-accent-foreground",
    current: "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary ring-offset-background",
    unlocked: "bg-secondary",
    locked: "bg-muted/50 text-muted-foreground",
  };

  const getFeedbackIcon = () => {
    if (feedback === 'correct') {
      return <CheckCircle2 className="w-24 h-24 text-accent animate-bounce-in" />;
    }
    if (feedback === 'incorrect') {
      return <XCircle className="w-24 h-24 text-destructive animate-shake" />;
    }
    if (feedback === 'timesup') {
      return (
        <div className="text-center text-destructive animate-shake">
          <Timer className="w-24 h-24 mx-auto"/>
          <p className="text-2xl font-bold mt-2">Time's Up!</p>
        </div>
      );
    }
    return null;
  };
  
  const gameModeIcons: {[key in GameMode]: React.ReactNode} = {
    Timed: <Timer className="w-4 h-4" />,
    Endless: <Infinity className="w-4 h-4" />,
    Challenge: <Trophy className="w-4 h-4" />,
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="mt-4">Loading Game...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 font-headline">
      <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardHeader className="text-center relative">
           <Link href="/gamemode" className="absolute left-4 top-4">
            <Button variant="outline" size="icon"><Home className="w-4 h-4"/></Button>
           </Link>
          <div className="flex justify-center items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-bold tracking-tighter">RiddleMath Mania</CardTitle>
          </div>
          <CardDescription>Level {currentLevel + 1} of {TOTAL_LEVELS} | {user.name}: {user.points} Points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-center text-muted-foreground">Level Progress</p>
            <div className="grid grid-cols-10 gap-1.5 justify-center">
              {Array.from({ length: TOTAL_LEVELS }).map((_, index) => {
                const status = getLevelStatus(index);
                const isClickable = (status === 'unlocked' || status === 'current') && gameStatus === 'playing';
                return (
                  <div
                    key={index}
                    onClick={() => isClickable && setCurrentLevel(index)}
                    className={cn(
                      "flex items-center justify-center text-xs font-bold h-7 w-7 rounded-md transition-all duration-300",
                      levelStatusStyles[status],
                      isClickable && 'cursor-pointer hover:scale-110'
                    )}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-muted-foreground">
              {gameMode && gameModeIcons[gameMode]}
              <span className="font-semibold">{gameMode} Mode</span>
            </div>
          </div>
          
          <div className="relative min-h-[200px] flex items-center justify-center rounded-lg bg-muted/50 p-4">
            {feedback ? (
              <div className="absolute inset-0 flex items-center justify-center z-10">{getFeedbackIcon()}</div>
            ) : gameStatus === 'completed' ? (
              <div className="text-center space-y-4">
                <Trophy className="w-24 h-24 text-accent mx-auto" />
                <h2 className="text-2xl font-bold">You did it!</h2>
                <p>You completed all {TOTAL_LEVELS} riddles.</p>
                {completionTime && <p>Total Time: <span className="font-bold">{completionTime}</span></p>}
                <p>Total Points: <span className="font-bold">{user.points}</span></p>
                <Button onClick={handlePlayAgain}>Play Again</Button>
              </div>
            ) : (
              <div className={cn("text-center space-y-4 transition-opacity duration-300", feedback && "opacity-0")}>
                {gameMode === 'Timed' && <div className="absolute top-2 right-2 text-lg font-bold text-primary">{timeLeft}s</div>}
                {gameMode === 'Challenge' && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 text-lg font-bold text-destructive">
                    {Array.from({length: lives}).map((_, i) => <Heart key={i} className="w-5 h-5 fill-current"/>)}
                  </div>
                )}
                <p className="text-xl font-semibold text-center text-card-foreground px-4">{currentRiddle.riddle}</p>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 justify-center">
                    <FormField
                      control={form.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <FormControl>
                            <Input 
                              {...field}
                              type="number"
                              placeholder="Your answer"
                              className={cn(
                                "text-center text-lg h-12",
                                feedback === 'incorrect' && 'border-destructive animate-shake'
                              )}
                              onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
                            />
                          </FormControl>
                          <FormMessage className="text-center" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="h-12 bg-accent hover:bg-accent/90">Submit</Button>
                  </form>
                </Form>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Button onClick={handleGetHint} variant="outline" className="w-full" disabled={isHintLoading || !!feedback || gameStatus === 'completed'}>
                {isHintLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Get a Hint ({hintsRemaining} left)
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" disabled={!!feedback || gameStatus === 'completed'}>
                    <Store className="w-4 h-4"/>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hint Store</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have {user.points} points. Would you like to buy a hint for {HINT_COST} points?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBuyHint}>Buy Hint</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {currentHint && (
              <div className="p-3 bg-secondary rounded-md text-sm text-secondary-foreground text-center animate-fade-in">
                {currentHint}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground justify-center">
          <p>Solve the riddle to unlock the next level!</p>
        </CardFooter>
      </Card>
    </div>
  );
}

    

    