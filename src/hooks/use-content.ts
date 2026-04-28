import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TopicWithSubtopics, DbArticle } from "@/types/speakos";

export function useTopics() {
  return useQuery({
    queryKey: ["speakos", "topics"],
    queryFn: async (): Promise<TopicWithSubtopics[]> => {
      const { data: topics, error: topicErr } = await supabase
        .schema("speakos")
        .from("topics")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (topicErr) throw topicErr;

      const { data: subtopics, error: subErr } = await supabase
        .schema("speakos")
        .from("subtopics")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (subErr) throw subErr;

      return (topics ?? []).map((t) => ({
        ...t,
        subtopics: (subtopics ?? []).filter(
          (s: { topic_id: string }) => s.topic_id === t.id,
        ),
      }));
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useRandomArticle(subtopicId: string | null) {
  return useQuery({
    queryKey: ["speakos", "article", subtopicId],
    queryFn: async (): Promise<DbArticle> => {
      const { data, error } = await supabase
        .schema("speakos")
        .from("articles")
        .select(
          "id, topic_id, subtopic_id, title, slug, premise, body, reading_target_seconds, word_count, key_ideas, speaking_anchors, reflection_question, speaking_prompt",
        )
        .eq("subtopic_id", subtopicId!)
        .eq("status", "published");

      if (error) throw error;
      if (!data?.length) throw new Error("No articles available");

      return data[Math.floor(Math.random() * data.length)];
    },
    enabled: !!subtopicId,
    staleTime: 0,
  });
}
