export interface DbTopic {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface DbSubtopic {
  id: string;
  topic_id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface DbArticle {
  id: string;
  topic_id: string;
  subtopic_id: string;
  title: string;
  slug: string;
  premise: string;
  body: string;
  reading_target_seconds: number;
  word_count: number;
  key_ideas: string[];
  speaking_anchors: string[];
  reflection_question: string | null;
  speaking_prompt: string | null;
}

export interface TopicWithSubtopics extends DbTopic {
  subtopics: DbSubtopic[];
}

export interface SubtopicSelection {
  topicName: string;
  subtopicId: string;
  subtopicName: string;
}

export interface SessionContent {
  topicName: string;
  subtopicName: string;
  article: DbArticle;
}

export interface StructuredFeedbackItem {
  score: number;
  reasoning: string;
  suggestion: string;
}

export interface AnalysisResult {
  analysisId: string;
  sessionId: string;
  scores: {
    clarity: number;
    structure: number;
    depth: number;
    originality: number;
    overall: number;
  };
  feedback: string;
  structuredFeedback: {
    clarity: StructuredFeedbackItem;
    structure: StructuredFeedbackItem;
    depth: StructuredFeedbackItem;
    originality: StructuredFeedbackItem;
  };
  transcript: string;
  embeddingComparison: {
    pairsComputed: number;
    avgSimilarity: number | null;
    maxSimilarity: number | null;
  } | null;
}
