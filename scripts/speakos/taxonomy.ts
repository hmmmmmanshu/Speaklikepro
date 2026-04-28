/**
 * SpeakOS curriculum taxonomy aligned with src/components/speakos/topics.ts
 * Stable slugs for speakos.topics / speakos.subtopics.
 */
export type SubtopicSeed = {
  slug: string;
  name: string;
  /** One-line pedagogical cue for prompts */
  blurb?: string;
  sort_order: number;
};

export type TopicSeed = {
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  subtopics: SubtopicSeed[];
};

/** Order matches PRODUCT category order */
export const SPEAKOS_TOPICS: TopicSeed[] = [
  {
    slug: "philosophy",
    name: "Philosophy",
    description: "Clarity through argument, restraint, and questions that refuse tidy closure.",
    sort_order: 10,
    subtopics: [
      { slug: "philosophy-slow", name: "Thinking slowly", sort_order: 10 },
      { slug: "philosophy-stoicism", name: "Stoicism", sort_order: 20 },
      { slug: "philosophy-meaning", name: "Meaning", sort_order: 30 },
      { slug: "philosophy-ethics", name: "Ethics", sort_order: 40 },
    ],
  },
  {
    slug: "technology",
    name: "Technology",
    description: "Tools, cognition, and the infrastructures that shape attention and trust.",
    sort_order: 20,
    subtopics: [
      { slug: "tech-tools", name: "Good tools", sort_order: 10 },
      { slug: "tech-ai", name: "Artificial intelligence", sort_order: 20 },
      { slug: "tech-internet", name: "The internet", sort_order: 30 },
      { slug: "tech-privacy", name: "Privacy", sort_order: 40 },
    ],
  },
  {
    slug: "films",
    name: "Films",
    description: "Stories, directing, and cinema as disciplined attention.",
    sort_order: 30,
    subtopics: [
      { slug: "films-storytelling", name: "Storytelling", sort_order: 10 },
      { slug: "films-directors", name: "Directors", sort_order: 20 },
      { slug: "films-cinema", name: "The art of cinema", sort_order: 30 },
    ],
  },
  {
    slug: "science",
    name: "Science",
    description: "Doubt, evidence, strangeness beneath the ordinary, living systems and climate stakes.",
    sort_order: 40,
    subtopics: [
      { slug: "science-doubt", name: "The role of doubt", sort_order: 10 },
      { slug: "science-physics", name: "Physics", sort_order: 20 },
      { slug: "science-biology", name: "Biology", sort_order: 30 },
      { slug: "science-climate", name: "Climate", sort_order: 40 },
    ],
  },
  {
    slug: "startups",
    name: "Startups",
    description: "Tempo, product judgment, and what founders carry under noise.",
    sort_order: 50,
    subtopics: [
      { slug: "startups-patience", name: "Patience and speed", sort_order: 10 },
      { slug: "startups-product", name: "Building product", sort_order: 20 },
      { slug: "startups-founders", name: "Founders", sort_order: 30 },
    ],
  },
  {
    slug: "politics",
    name: "Politics",
    description: "Democracy, power, discourse, and the quiet obligations of citizenship.",
    sort_order: 60,
    subtopics: [
      { slug: "politics-democracy", name: "Democracy", sort_order: 10 },
      { slug: "politics-power", name: "Power", sort_order: 20 },
      { slug: "politics-discourse", name: "Public discourse", sort_order: 30 },
      { slug: "politics-citizenship", name: "Citizenship", sort_order: 40 },
    ],
  },
  {
    slug: "psychology",
    name: "Psychology",
    description: "Narratives, attention, and how environments reshape habits.",
    sort_order: 70,
    subtopics: [
      { slug: "psychology-stories", name: "The stories we tell", sort_order: 10 },
      { slug: "psychology-attention", name: "Attention", sort_order: 20 },
      { slug: "psychology-habits", name: "Habits", sort_order: 30 },
    ],
  },
  {
    slug: "economics",
    name: "Economics",
    description: "Prices, markets, and what widening gaps slowly break.",
    sort_order: 80,
    subtopics: [
      { slug: "economics-prices", name: "Prices", sort_order: 10 },
      { slug: "economics-markets", name: "Markets", sort_order: 20 },
      { slug: "economics-inequality", name: "Inequality", sort_order: 30 },
    ],
  },
];

export function slugifyArticle(subtopicSlug: string, ordinal: 1 | 2 | 3): string {
  return `${subtopicSlug}-training-${ordinal}`;
}
