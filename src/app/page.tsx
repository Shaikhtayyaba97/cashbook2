"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function HomePage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      // Still checking for user state, show loading
      return;
    }
    if (user) {
      // User is logged in, redirect to dashboard
      router.replace('/dashboard');
    } else {
      // User is not logged in, redirect to login
      router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
