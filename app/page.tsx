"use client";

import { usePosts } from "@/hooks";
import { useAuthStore, useUIStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownAZ, ArrowUpAZ, ChevronDown } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { PostSort } from "@/types";
import { useState } from "react";

export default function Home() {
  const [sort, setSort] = useState<PostSort>("hot");
  const { posts, isLoading, error } = usePosts(sort);
  const { isAuthenticated } = useAuthStore();
  const { openCreatePost } = useUIStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight">Home Feed</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto h-8">
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuItem onClick={() => setSort("hot")}>
                Hot
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("new")}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("top")}>
                Top
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("rising")}>
                Rising
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isAuthenticated && (
          <Button onClick={openCreatePost}>Create Post</Button>
        )}
      </div>
      
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          Failed to load posts. Please try again later.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No posts found. Be the first to post!
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
