"use client";

import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="container mx-auto flex h-16 items-center justify-between px-0">
        <Logo />
        {/* Logout button removed as authentication is no longer used */}
      </div>
    </header>
  );
}
