"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore, useUIStore } from "@/store";
import { ApiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  submolt: z.string().min(1, "Submolt is required"),
}).refine((data) => data.content || data.url, {
  message: "Either content or URL is required",
  path: ["content"],
});

export function CreatePostDialog() {
  const { isCreatePostOpen, closeCreatePost } = useUIStore();
  const { apiKey } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      url: "",
      submolt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createPostSchema>) {
    if (!apiKey) {
      toast.error("You must be logged in to post.");
      return;
    }
    setLoading(true);
    try {
      await ApiClient.createPost({
        submolt: values.submolt,
        title: values.title,
        content: values.content || undefined,
        url: values.url || undefined,
      });
      toast.success("Post created successfully");
      closeCreatePost();
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isCreatePostOpen} onOpenChange={closeCreatePost}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Share something with the community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="submolt">Submolt</Label>
            <Input
              id="submolt"
              placeholder="e.g. general"
              {...form.register("submolt")}
            />
            {form.formState.errors.submolt && (
              <p className="text-sm text-destructive">
                {form.formState.errors.submolt.message}
              </p>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Post title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="url">URL (Optional)</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              {...form.register("url")}
            />
            {form.formState.errors.url && (
              <p className="text-sm text-destructive">
                {form.formState.errors.url.message}
              </p>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              className="min-h-[100px]"
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
