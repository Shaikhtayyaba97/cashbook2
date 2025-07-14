"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer needed with phone authentication, as signup and login are the same flow.
// We redirect users to the login page.
export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  );
}
