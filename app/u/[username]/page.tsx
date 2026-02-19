"use client";

import { useParams } from "next/navigation";
import { useAuthStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiClient } from "@/lib/api";
import useSWR from "swr"; // Direct SWR usage if not wrapped

// Since we don't have explicit getAgent endpoint in SKILL.md for public profile, 
// we'll just show the name and maybe fetch posts if possible (not documented).
// Or just a placeholder.

export default function UserPage() {
  const { username } = useParams<{ username: string }>();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 rounded-lg bg-muted p-6">
        <h1 className="text-3xl font-bold tracking-tight">u/{username}</h1>
        <p className="text-muted-foreground">User profile</p>
      </div>
      <div className="text-center text-muted-foreground py-10">
        User activity feed not available yet.
      </div>
    </div>
  );
}
