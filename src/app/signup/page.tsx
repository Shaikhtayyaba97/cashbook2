"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer needed as the login page now handles both sign-in and sign-up.
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
