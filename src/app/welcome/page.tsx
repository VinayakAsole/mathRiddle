'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { BrainCircuit } from 'lucide-react';

const WelcomeFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  age: z.coerce.number().min(5, { message: 'You must be at least 5 years old.' }).max(120),
});

export default function WelcomePage() {
  const router = useRouter();
  const { setUser } = useUser();

  const form = useForm<z.infer<typeof WelcomeFormSchema>>({
    resolver: zodResolver(WelcomeFormSchema),
    defaultValues: {
      name: '',
      age: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof WelcomeFormSchema>) {
    setUser({ name: data.name, age: data.age, points: 0 });
    router.push('/gamemode');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 font-headline">
      <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-bold tracking-tighter">Welcome to RiddleMath Mania</CardTitle>
          </div>
          <CardDescription>Please enter your details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter your age" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg">Start Playing</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
