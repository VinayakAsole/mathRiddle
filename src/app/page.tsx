'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, setUser } = useUser();
  const router = useRouter();

  if (user.name) {
    router.push('/gamemode');
    return null;
  }
  
  router.push('/welcome');
  return null;
}
