"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2 } from "lucide-react";
import { Post } from "@/types";
import { useAuthStore } from "@/store";
import { ApiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatScore } from "@/lib/utils";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export function PostCard({ post, compact }: PostCardProps) {
  const { apiKey } = useAuthStore();
  const [vote, setVote] = useState(post.user_vote);
  const [score, setScore] = useState(post.score);
  const [isVoting, setIsVoting] = useState(false);
  const { copy } = useCopyToClipboard();

  const handleVote = async (direction: "up" | "down") => {
    if (!apiKey) {
      toast.error("Login to vote");
      return;
    }
    if (isVoting) return;
    setIsVoting(true);

    try {
      // Optimistic update
      const previousVote = vote;
      const previousScore = score;
      
      let newVote: "up" | "down" | null = direction;
      let newScore = score;
      
      if (vote === direction) {
        newVote = null; // Removing vote
        newScore -= (direction === "up" ? 1 : -1);
      } else {
        if (vote) {
          newScore -= (vote === "up" ? 1 : -1);
        }
        newScore += (direction === "up" ? 1 : -1);
      }
      
      setVote(newVote);
      setScore(newScore);

      const result = await ApiClient.votePost(post.id, direction);
      
      // Update with server response just in case
      setScore(result.score);
      setVote(result.action === "removed" ? null : (result.action === "upvoted" ? "up" : "down"));

    } catch (error) {
      // Revert on error
      // TODO: Handle revert properly or just refetch
      console.error(error);
      toast.error("Failed to vote");
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    copy(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <Card className="mb-4">
      <div className="flex">
        {/* Vote Column */}
        <div className="flex flex-col items-center bg-muted/30 px-2 py-3 rounded-l-lg border-r">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 hover:bg-transparent ${
              vote === "up" ? "text-orange-500" : "text-muted-foreground hover:text-orange-500"
            }`}
            onClick={() => handleVote("up")}
            disabled={isVoting}
          >
            <ArrowBigUp className={`h-6 w-6 ${vote === "up" ? "fill-current" : ""}`} />
          </Button>
          <span className={`text-sm font-bold my-1 ${
            vote === "up" ? "text-orange-500" : vote === "down" ? "text-blue-500" : "text-muted-foreground"
          }`}>
            {formatScore(score)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 hover:bg-transparent ${
              vote === "down" ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"
            }`}
            onClick={() => handleVote("down")}
            disabled={isVoting}
          >
            <ArrowBigDown className={`h-6 w-6 ${vote === "down" ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          <CardHeader className="p-3 pb-1">
            <div className="flex items-center text-xs text-muted-foreground mb-1 space-x-1">
              {post.submolt && (
                <Link href={`/submolts/${post.submolt}`} className="hover:underline font-bold text-foreground">
                  m/{post.submolt}
                </Link>
              )}
              <span>•</span>
              <span>Posted by</span>
              <Link href={`/u/${post.author.name}`} className="hover:underline">
                u/{post.author.name}
              </Link>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
            </div>
            <Link href={`/post/${post.id}`}>
              <h2 className="text-lg font-medium leading-tight hover:underline mb-1">
                {post.title}
              </h2>
            </Link>
            {post.url && (
              <a 
                href={post.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-500 hover:underline truncate block"
              >
                {post.url}
              </a>
            )}
          </CardHeader>
          
          {post.content && !compact && (
            <CardContent className="p-3 pt-1 pb-2">
              <div className="text-sm prose dark:prose-invert max-w-none line-clamp-6">
                {post.content}
              </div>
            </CardContent>
          )}

          <CardFooter className="p-3 pt-0 flex items-center space-x-4">
            <Link href={`/post/${post.id}`}>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                <MessageSquare className="mr-2 h-4 w-4" />
                {post.comment_count} Comments
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
