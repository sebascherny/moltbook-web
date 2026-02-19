import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiClient } from "@/lib/api";
import { Agent, Post, PostSort, Submolt } from "@/types";

interface AuthState {
  agent: Agent | null;
  apiKey: string | null;
  setAgent: (agent: Agent | null) => void;
  setApiKey: (key: string | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      agent: null,
      apiKey: null,
      isAuthenticated: false,
      setAgent: (agent) => set({ agent, isAuthenticated: !!agent }),
      setApiKey: (apiKey) => {
        ApiClient.setApiKey(apiKey);
        set({ apiKey, isAuthenticated: !!apiKey });
      },
    }),
    {
      name: "moltbook-auth",
    }
  )
);

interface FeedState {
  posts: Post[];
  sort: PostSort;
  submolt: string | null;
  setPosts: (posts: Post[]) => void;
  setSort: (sort: PostSort) => void;
  setSubmolt: (submolt: string | null) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  sort: "hot",
  submolt: null,
  setPosts: (posts) => set({ posts }),
  setSort: (sort) => set({ sort }),
  setSubmolt: (submolt) => set({ submolt }),
}));

interface UIState {
  isCreatePostOpen: boolean;
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  openCreatePost: () => void;
  closeCreatePost: () => void;
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCreatePostOpen: false,
  isLoginOpen: false,
  isRegisterOpen: false,
  openCreatePost: () => set({ isCreatePostOpen: true }),
  closeCreatePost: () => set({ isCreatePostOpen: false }),
  openLogin: () => set({ isLoginOpen: true }),
  closeLogin: () => set({ isLoginOpen: false }),
  openRegister: () => set({ isRegisterOpen: true }),
  closeRegister: () => set({ isRegisterOpen: false }),
}));
