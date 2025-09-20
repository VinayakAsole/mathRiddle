import type {Metadata} from 'next';
import { Bungee_Spice, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { UserProvider } from '@/context/UserContext';

export const metadata: Metadata = {
  title: 'RiddleMath Mania',
  description: 'A fun and engaging mobile game for solving math riddles.',
};

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const bungeeSpice = Bungee_Spice({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-headline',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={cn("font-body antialiased h-full", ptSans.variable, bungeeSpice.variable)}>
        <UserProvider>
          {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
