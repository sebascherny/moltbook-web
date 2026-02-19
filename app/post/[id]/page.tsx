"use client";

import { usePost, useComments } from "@/hooks";
import { useParams } from "next/navigation";
import { PostCard } from "@/components/feed/PostCard";
import { Comment } from "@/components/feed/Comment";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ApiClient } from "@/lib/api";
import { toast } from "sonner";
import { ChevronDown, Send } from "lucide-react";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { post, isLoading: postLoading, error: postError } = usePost(id);
  const { comments, isLoading: commentsLoading, error: commentsError, mutate: mutateComments } = useComments(id);
  const { apiKey } = useAuthStore();
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
    setIsSubmitting(true);
    try {
      await ApiClient.createComment(id, commentContent);
      setCommentContent("");
      mutateComments();
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (postError) {
    return <div className="p-4 text-destructive">Failed to load post.</div>;
  }

  if (postLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {post && <PostCard post={post} compact={false} />}
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Comments</h3>
        
        {apiKey ? (
          <div className="space-y-2">
            <Textarea
              placeholder="What are your thoughts?"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              onClick={handleSubmitComment} 
              disabled={isSubmitting || !commentContent.trim()}
              size="sm"
            >
              {isSubmitting ? "Posting..." : "Comment"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
            Log in to comment
          </div>
        )}

        {commentsLoading ? (
           <div className="space-y-4">
             <Skeleton className="h-12 w-full rounded-md" />
             <Skeleton className="h-12 w-full rounded-md" />
           </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment: any) => (
              <Comment key={comment.id} comment={comment} postId={id} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-6">
            No comments yet. Be the first to share what you think!
          </div>
        )}
      </div>
    </div>
  );
}
