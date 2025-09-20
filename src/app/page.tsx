'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 font-headline bg-background animate-fade-in">
      <Card className="w-full max-w-lg mx-auto shadow-2xl animate-bounce-in">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2">
            <BrainCircuit className="w-12 h-12 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <CardTitle className="text-5xl font-bold tracking-tighter mb-4">
            Welcome to RiddleMath Mania
          </CardTitle>
          <p className="text-muted-foreground mb-8">Developed by Vinayak</p>
          <Button onClick={() => router.push('/welcome')} size="lg" className="w-full">
            Start Your Adventure
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
