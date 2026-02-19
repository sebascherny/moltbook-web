"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Reply } from "lucide-react";
import { Comment as CommentType } from "@/types";
import { useAuthStore } from "@/store";
import { ApiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatScore } from "@/lib/utils";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface CommentProps {
  comment: CommentType;
  postId: string;
  depth?: number;
}

export function Comment({ comment, postId, depth = 0 }: CommentProps) {
  const { apiKey } = useAuthStore();
  const [vote, setVote] = useState(comment.user_vote);
  const [score, setScore] = useState(comment.score);
  const [isVoting, setIsVoting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const handleVote = async (direction: "up" | "down") => {
    if (!apiKey) {
      toast.error("Login to vote");
      return;
    }
    if (isVoting) return;
    setIsVoting(true);
    try {
      const result = await ApiClient.voteComment(comment.id, direction);
      setScore(result.score);
      setVote(result.action === "removed" ? null : (result.action === "upvoted" ? "up" : "down"));
    } catch (error) {
      console.error(error);
      toast.error("Failed to vote");
    } finally {
      setIsVoting(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmittingReply(true);
    try {
      await ApiClient.createComment(postId, replyContent, comment.id);
      setReplyContent("");
      setIsReplying(false);
      toast.success("Reply posted");
      // Ideally refresh comments
    } catch (error) {
      console.error(error);
      toast.error("Failed to reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className={`flex flex-col space-y-2 border-l-2 border-muted pl-4 ${depth > 0 ? "ml-4" : ""}`}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-foreground">u/{comment.author.name}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
        </div>
      </div>
      
      <div className="text-sm prose dark:prose-invert max-w-none">
        {comment.content}
      </div>

      <div className="flex items-center space-x-2 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 px-1 ${vote === "up" ? "text-orange-500" : "hover:text-orange-500"}`}
          onClick={() => handleVote("up")}
          disabled={isVoting}
        >
          <ArrowBigUp className="h-4 w-4" />
        </Button>
        <span className={`text-xs font-bold ${
          vote === "up" ? "text-orange-500" : vote === "down" ? "text-blue-500" : ""
        }`}>
          {formatScore(score)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 px-1 ${vote === "down" ? "text-blue-500" : "hover:text-blue-500"}`}
          onClick={() => handleVote("down")}
          disabled={isVoting}
        >
          <ArrowBigDown className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 text-xs"
          onClick={() => setIsReplying(!isReplying)}
        >
          <Reply className="mr-1 h-3 w-3" />
          Reply
        </Button>
      </div>

      {isReplying && (
        <div className="mt-2 space-y-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="min-h-[60px]"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
            <Button size="sm" onClick={handleReply} disabled={submittingReply}>Reply</Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-4">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
