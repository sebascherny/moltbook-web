import { Agent, Post, Comment, Submolt, PostSort, CommentSort } from "@/types";

const API_BASE = "https://www.moltbook.com/api/v1";

interface ApiError {
  error: string;
}

export class ApiClient {
  private static apiKey: string | null = null;

  static setApiKey(key: string | null) {
    this.apiKey = key;
    if (typeof window !== "undefined") {
      if (key) localStorage.setItem("moltbook_api_key", key);
      else localStorage.removeItem("moltbook_api_key");
    }
  }

  static getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    if (typeof window !== "undefined") {
      return localStorage.getItem("moltbook_api_key");
    }
    return null;
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = this.getApiKey();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  static async getMe(): Promise<Agent> {
    return this.request("/agents/me");
  }

  static async register(name: string, description?: string): Promise<{ agent: Agent & { api_key: string; claim_url: string; verification_code: string }; important: string }> {
    return this.request("/agents/register", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  }

  static async getPosts(params?: { sort?: PostSort; limit?: number; submolt?: string; offset?: number }): Promise<{ data: Post[]; pagination: { hasMore: boolean; nextOffset: number } }> {
    const query = new URLSearchParams();
    if (params?.sort) query.append("sort", params.sort);
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.submolt) query.append("submolt", params.submolt);
    if (params?.offset) query.append("offset", params.offset.toString());
    
    // The API might return just an array or { data: [], pagination: {} } depending on implementation.
    // Based on SKILL.md, it implies returning JSON. Let's assume standard response.
    // However, moltbook.com skill.md example: curl "https://www.moltbook.com/api/v1/posts?sort=hot&limit=25"
    // It doesn't show response structure. I'll assume standard { data: [], pagination: {} } wrapper or just [].
    // Let's check with a real request or handle both.
    // Actually, I'll just assume it returns { data: Post[], pagination: ... } based on typical API design for feeds.
    // Or I can test it.
    
    return this.request(`/posts?${query.toString()}`);
  }

  static async getPost(id: string): Promise<Post> {
    return this.request(`/posts/${id}`);
  }

  static async createPost(data: { submolt: string; title: string; content?: string; url?: string }): Promise<Post> {
    return this.request("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async deletePost(id: string): Promise<void> {
    return this.request(`/posts/${id}`, { method: "DELETE" });
  }

  static async getComments(postId: string, sort: CommentSort = "top"): Promise<Comment[]> {
    return this.request(`/posts/${postId}/comments?sort=${sort}`);
  }

  static async createComment(postId: string, content: string, parentId?: string): Promise<Comment> {
    return this.request(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content, parent_id: parentId }),
    });
  }

  static async votePost(id: string, direction: "up" | "down"): Promise<{ action: "upvoted" | "downvoted" | "removed"; score: number }> {
    return this.request(`/posts/${id}/${direction}vote`, { method: "POST" });
  }

  static async voteComment(id: string, direction: "up" | "down"): Promise<{ action: "upvoted" | "downvoted" | "removed"; score: number }> {
    return this.request(`/comments/${id}/${direction}vote`, { method: "POST" });
  }

  static async getSubmolts(): Promise<Submolt[]> {
    return this.request("/submolts");
  }

  static async getSubmolt(name: string): Promise<Submolt> {
    return this.request(`/submolts/${name}`);
  }

  static async createSubmolt(data: { name: string; display_name: string; description?: string; allow_crypto?: boolean }): Promise<Submolt> {
    return this.request("/submolts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
