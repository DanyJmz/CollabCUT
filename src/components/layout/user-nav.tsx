
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { CreditCard, LogOut, Settings, User } from "lucide-react";

const useMockAuth = () => ({
  isAuthenticated: true,
  user: { name: "Dev", email: "dev@collabcut.com", initials: "DE" }, // Updated user details
  logout: () => {
    console.log("Sesión cerrada");
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
});


export default function UserNav() {
  const { isAuthenticated, user, logout } = useMockAuth();

  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button variant="outline">Iniciar Sesión</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full h-10 w-10"> {/* Adjusted size */}
          <Avatar className="h-full w-full"> {/* Use full height/width of button */}
            <AvatarImage asChild>
              <Image
                src={`https://picsum.photos/seed/${user.initials || user.name}/48/48`}
                alt={`${user.name}'s profile picture`}
                fill
                className="object-cover" // Ensures image covers the avatar area
                data-ai-hint="persona avatar"
              />
            </AvatarImage>
            <AvatarFallback className="h-full w-full flex items-center justify-center">
              {user.initials || user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile" passHref>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem disabled>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Facturación</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
