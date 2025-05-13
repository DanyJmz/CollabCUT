
"use client";

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { NAV_LINKS_MAIN, NAV_LINKS_USER, NAV_LINKS_AUTH } from '@/lib/constants';
import type { NavItem } from '@/lib/constants';
import { usePathname } from 'next/navigation';

const useMockAuth = () => ({ isAuthenticated: true, logout: () => {
  console.log("Sesión cerrada");
  if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
} });

export default function AppSidebar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useMockAuth();
  
  const renderNavItem = (item: NavItem, index: number) => (
    <SidebarMenuItem key={`${item.label}-${index}`}>
      <Link href={item.href} passHref legacyBehavior>
        <SidebarMenuButton
          isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
          tooltip={item.tooltip}
          aria-label={item.label}
        >
          <item.icon />
          <span>{item.label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );

  return (
    <Sidebar side="left" collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center font-semibold group-data-[collapsible=icon]:justify-center">
          {/* Icon removed */}
          <span className="text-lg group-data-[collapsible=icon]:hidden">
            <span className="text-sidebar-foreground">Collab</span>
            <span className="text-sidebar-foreground">CUT</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {(isAuthenticated ? NAV_LINKS_MAIN : []).map(renderNavItem)}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarSeparator className="my-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:my-2" />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          {(isAuthenticated ? NAV_LINKS_USER : NAV_LINKS_AUTH).map(renderNavItem)}
          {isAuthenticated && (
             <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} tooltip="Cerrar Sesión" aria-label="Cerrar Sesión">
                  <LogOut />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
