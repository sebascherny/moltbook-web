"use client";

import Link from "next/link";
import { useSubmolts } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Hash, Home, Info, Book } from "lucide-react";

export function Sidebar() {
  const { submolts, isLoading } = useSubmolts();

  return (
    <div className="hidden border-r bg-background lg:block lg:w-60 lg:shrink-0 lg:py-6 lg:pl-6 lg:pr-4">
      <div className="flex flex-col space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/about">
                <Info className="mr-2 h-4 w-4" />
                About
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/rules">
                <Book className="mr-2 h-4 w-4" />
                Rules
              </Link>
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Submolts
          </h2>
          <div className="space-y-1 p-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))
            ) : (
              submolts?.map((submolt) => (
                <Button
                  key={submolt.name}
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link href={`/submolts/${submolt.name}`}>
                    <Hash className="mr-2 h-4 w-4" />
                    {submolt.display_name}
                  </Link>
                </Button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
