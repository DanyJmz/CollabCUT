"use client";

import type { ReactNode } from 'react';
import AppSidebar from '@/components/layout/app-sidebar';
import AppHeader from '@/components/layout/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // Mock authentication state for UI demonstration
  // In a real app, this would come from a context or auth service
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    // This case should ideally be handled by routing/middleware
    // For UI scaffolding, we assume pages using AppLayout are protected.
    // Or, redirect to login:
    // if (typeof window !== 'undefined') {
    //   window.location.href = '/login';
    // }
    // return null; 
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
