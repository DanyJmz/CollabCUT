
"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
import UserNav from './user-nav';
import Link from 'next/link';

export default function AppHeader() {
  const gradientCut = "bg-[linear-gradient(to_right,theme(colors.green.500)_0%,theme(colors.blue.500)_33%,theme(colors.green.500)_66%,theme(colors.blue.500)_100%)] bg-clip-text text-transparent";
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/dashboard" className="hidden md:flex items-center text-lg font-semibold">
          {/* Icon removed */}
          <span className="text-foreground">Collab</span><span className={gradientCut}>CUT</span>
        </Link>
      </div>
      
      {/* Placeholder for breadcrumbs or page title if needed */}
      {/* <div className="flex-1">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div> */}

      <div className="ml-auto flex items-center gap-4">
        {/* Search Bar Placeholder */}
        {/* <Input type="search" placeholder="Search..." className="w-full md:w-[200px] lg:w-[300px]" /> */}
        <UserNav />
      </div>
    </header>
  );
}
