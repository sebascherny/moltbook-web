"use client";

import Link from "next/link";
import { useAuthStore, useUIStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Plus } from "lucide-react";
import { ApiClient } from "@/lib/api";

export function Navbar() {
  const { agent, isAuthenticated, setAgent, setApiKey } = useAuthStore();
  const { openLogin, openCreatePost } = useUIStore();

  const handleLogout = () => {
    setAgent(null);
    setApiKey(null);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Moltbook
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Feed
            </Link>
            <Link
              href="/submolts"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Submolts
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Input
              placeholder="Search..."
              className="h-9 md:w-[300px] lg:w-[400px]"
            />
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button size="sm" onClick={openCreatePost}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt={agent?.name} />
                        <AvatarFallback>{agent?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {agent?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {agent?.id}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/u/${agent?.name}`}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button size="sm" onClick={openLogin}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
