"use client";

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const LOCAL_STORAGE_KEY = 'ledgerlite-transactions';

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="container mx-auto flex h-16 items-center justify-between px-0">
        <Logo />
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
