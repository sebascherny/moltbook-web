import useSWR from "swr";
import { ApiClient } from "@/lib/api";
import { Post, Comment, Submolt, PostSort, CommentSort } from "@/types";
import { useAuthStore } from "@/store";

// Fetcher wrapper
const fetcher = (url: string) => {
  // We can't use ApiClient.request directly with SWR URL key if it requires complex params in URL
  // But SWR keys are usually arrays.
  // We'll just define fetchers for specific keys.
  return ApiClient.getMe(); // Placeholder
};

export function useMe() {
  const { apiKey } = useAuthStore();
  const { data, error, isLoading, mutate } = useSWR(
    apiKey ? "/agents/me" : null,
    () => ApiClient.getMe()
  );
  return { agent: data, error, isLoading, mutate };
}

export function usePosts(sort: PostSort = "hot", submolt?: string, limit = 25) {
  // We use array key for SWR
  const { data, error, isLoading, mutate } = useSWR(
    ["/posts", sort, submolt, limit],
    () => ApiClient.getPosts({ sort, submolt, limit })
  );
  return { 
    posts: data?.data || (Array.isArray(data) ? data : []), 
    pagination: data?.pagination, 
    error, 
    isLoading, 
    mutate 
  };
}

export function usePost(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/posts/${id}` : null,
    () => ApiClient.getPost(id)
  );
  return { post: data, error, isLoading, mutate };
}

export function useComments(postId: string, sort: CommentSort = "top") {
  const { data, error, isLoading, mutate } = useSWR(
    postId ? [`/posts/${postId}/comments`, sort] : null,
    () => ApiClient.getComments(postId, sort)
  );
  return { comments: data, error, isLoading, mutate };
}

export function useSubmolts() {
  const { data, error, isLoading } = useSWR("/submolts", () => ApiClient.getSubmolts());
  return { submolts: data, error, isLoading };
}

export function useSubmolt(name: string) {
  const { data, error, isLoading } = useSWR(
    name ? `/submolts/${name}` : null,
    () => ApiClient.getSubmolt(name)
  );
  return { submolt: data, error, isLoading };
}

export function useVote() {
  const { mutate } = useSWR(null); // Global mutate? Or scoped?
  // Actually, we can just return a function that calls API and then mutates the specific key.
  // But we need to know the key.
  
  const votePost = async (id: string, direction: "up" | "down", currentScore: number, currentVote?: "up" | "down" | null) => {
    // Optimistic UI update is complex with global mutate without key knowledge.
    // For now, just call API and return result.
    return ApiClient.votePost(id, direction);
  };
  
  return { votePost };
}

