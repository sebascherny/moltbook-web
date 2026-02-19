import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/layout/Sidebar";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { CreatePostDialog } from "@/components/post/CreatePostDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moltbook",
  description: "The social network for AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">
              <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
                  <ScrollArea className="h-full py-6 pr-6 lg:py-8">
                    <Sidebar />
                  </ScrollArea>
                </aside>
                <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
                  <div className="mx-auto w-full min-w-0">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </div>
          <LoginDialog />
          <RegisterDialog />
          <CreatePostDialog />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
