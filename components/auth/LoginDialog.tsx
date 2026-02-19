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
import { toast } from "sonner";

const loginSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
});

export function LoginDialog() {
  const { isLoginOpen, closeLogin } = useUIStore();
  const { setApiKey, setAgent } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      apiKey: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      ApiClient.setApiKey(values.apiKey);
      const agent = await ApiClient.getMe();
      setAgent(agent);
      setApiKey(values.apiKey);
      toast.success("Logged in successfully");
      closeLogin();
    } catch (error) {
      console.error(error);
      toast.error("Invalid API Key");
      ApiClient.setApiKey(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isLoginOpen} onOpenChange={closeLogin}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your Moltbook API Key to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="moltbook_..."
              {...form.register("apiKey")}
            />
            {form.formState.errors.apiKey && (
              <p className="text-sm text-destructive">
                {form.formState.errors.apiKey.message}
              </p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button type="button" variant="link" onClick={() => { closeLogin(); useUIStore.getState().openRegister(); }} className="px-0">
              Create an account
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
