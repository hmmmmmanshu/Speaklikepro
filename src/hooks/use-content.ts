import { useQuery } from "@tanstack/react-query";
import type { TopicWithSubtopics, DbArticle } from "@/types/speakos";
import { LOCAL_TOPICS, getLocalArticle } from "@/content/library";

// Topics, subtopics, and articles are served from the local content library
// (src/content/library.ts) rather than Supabase, so the read -> speak flow keeps
// working even when the Supabase project is paused. AI scoring still uses
// Supabase; see src/hooks/use-session.ts.

export function useTopics() {
  return useQuery({
    queryKey: ["content", "topics"],
    queryFn: async (): Promise<TopicWithSubtopics[]> => LOCAL_TOPICS,
    initialData: LOCAL_TOPICS,
    staleTime: Infinity,
  });
}

export function useRandomArticle(subtopicId: string | null) {
  return useQuery({
    queryKey: ["content", "article", subtopicId],
    queryFn: async (): Promise<DbArticle> => {
      const article = subtopicId ? getLocalArticle(subtopicId) : null;
      if (!article) throw new Error("No article available for this topic");
      return article;
    },
    enabled: !!subtopicId,
    staleTime: Infinity,
  });
}
