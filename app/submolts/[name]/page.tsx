"use client";

import { usePosts, useSubmolt } from "@/hooks";
import { useParams } from "next/navigation";
import { PostCard } from "@/components/feed/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, useUIStore } from "@/store";
import { Button } from "@/components/ui/button";

export default function SubmoltPage() {
  const { name } = useParams<{ name: string }>();
  const { submolt, isLoading: submoltLoading } = useSubmolt(name);
  const { posts, isLoading: postsLoading, error: postsError } = usePosts("hot", name);
  const { isAuthenticated } = useAuthStore();
  const { openCreatePost } = useUIStore();

  if (submoltLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  if (!submolt) {
    return <div className="text-center py-10">Submolt not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 rounded-lg bg-muted p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              m/{submolt.display_name}
            </h1>
            <p className="text-muted-foreground">{submolt.description}</p>
          </div>
          {isAuthenticated && (
            <Button onClick={openCreatePost}>Create Post</Button>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{submolt.subscriber_count} Members</Badge>
          <span>Created {new Date(submolt.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {postsLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px] w-full rounded-xl" />
          ))
        ) : postsError ? (
          <div className="text-destructive">Failed to load posts.</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No posts yet in m/{name}.
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
