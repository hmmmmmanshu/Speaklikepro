/**
 * SpeakOS Content Publisher Agent — runnable pipeline + operating brief summary.
 *
 * Mission: generate ~3‑minute SpeakOS readings and publish idempotently to
 * `speakos.topics`, `speakos.subtopics`, `speakos.articles`, `speakos.article_chunks`
 * with `vector(1536)` embeddings (`text-embedding-3-small` @ 1536 dimensions).
 *
 * Requirements:
 * - Use service-role key (SUPABASE_SERVICE_ROLE_KEY). Never use anon writes for publishing.
 * - Writes are idempotent: upsert topics/subtopics/articles by slug; replace chunks per article_id.
 * - Do not touch session/analysis tables from this script.
 *
 * Environment:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY
 * Optional:
 *   OPENAI_CHAT_MODEL   (default gpt-4o-mini)
 *   OPENAI_EMBED_MODEL    (default text-embedding-3-small)
 *
 * Usage:
 *   npx tsx scripts/speakos/publish.ts
 *   npx tsx scripts/speakos/publish.ts --limit=3
 *   npx tsx scripts/speakos/publish.ts --only-subtopic=philosophy-slow
 *   npx tsx scripts/speakos/publish.ts --dry-run
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { SPEAKOS_TOPICS, slugifyArticle, type TopicSeed } from "./taxonomy";

const READING_TARGET_SECONDS = 180;
const MIN_WORDS = 420;
const MAX_WORDS = 520;
const IDEAL_MIN = 460;
const IDEAL_MAX = 490;
const CHUNK_MIN = 120;
const CHUNK_MAX = 220;
const EMBED_DIM = 1536;

const SOURCE_INSPIRATIONS = ["Aeon Essays", "Nautilus Magazine"];

const PROMPT_VERSION = "speakos-publish-v1";

type Slot = {
  topic: TopicSeed;
  subtopicSlug: string;
  subtopicName: string;
  ordinal: 1 | 2 | 3;
  slug: string;
  angle: "philosophical" | "practical" | "systems";
};

function parseArgs(argv: string[]) {
  let limit: number | undefined;
  let onlySubtopic: string | undefined;
  let dryRun = false;
  for (const a of argv) {
    if (a.startsWith("--limit=")) limit = Math.max(0, parseInt(a.slice("--limit=".length), 10) || 0);
    if (a.startsWith("--only-subtopic=")) onlySubtopic = a.slice("--only-subtopic=".length);
    if (a === "--dry-run") dryRun = true;
  }
  return { limit, onlySubtopic, dryRun };
}

function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function estimateTokensFromWords(words: number): number {
  return Math.max(1, Math.round(words * 1.3));
}

function splitRoughSentences(t: string): string[] {
  const parts =
    t.match(/[^.!?;\n]+[.!?;]|[^\n]+$|[^.!?;\n]{20,}/g)?.map((s) => s.trim()) ?? [];

  const sents = parts.filter(Boolean);
  return sents.length ? sents : [t];
}

/** Split body into coherent chunks (~120–220 words). Long bodies normally yield ≥2 chunks. */
function chunkArticleBody(body: string): string[] {
  const normalized = body.replace(/\r\n/g, "\n").trim();
  const wc = wordCount;

  const greedyMergeParts = (parts: string[]): string[] => {
    const out: string[] = [];
    let buf = "";
    const pushBuf = () => {
      const t = buf.trim();
      if (!t.length) return;
      out.push(t);
      buf = "";
    };

    for (const piece of parts) {
      const combined = `${buf}${buf.length ? "\n\n" : ""}${piece}`;
      if (!buf) {
        buf = piece;
        continue;
      }
      if (wc(combined) <= CHUNK_MAX) buf = combined;
      else {
        pushBuf();
        buf = piece;
      }
    }
    pushBuf();

    for (let i = out.length - 1; i >= 1; i--) {
      const prev = out[i - 1]!;
      const last = out[i]!;
      if (wc(last) >= 72) continue;
      const fused = `${prev}\n\n${last}`;
      if (wc(fused) <= CHUNK_MAX + 60) out.splice(i - 1, 2, fused);
    }

    return out;
  };

  let chunks = greedyMergeParts(
    normalized
      .split(/\n\s*\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
  );

  if (chunks.length < 2 && wc(normalized) > 320) {
    chunks = greedyMergeParts(splitRoughSentences(normalized.replace(/\s+/g, " ").trim()));
  }

  if (chunks.length < 2 && wc(normalized) > 210) {
    const midpoint = Math.floor(normalized.length / 2);
    const pivot = normalized.lastIndexOf(" ", midpoint);
    const cut = pivot > normalized.length * 0.35 ? pivot : midpoint;
    const head = normalized.slice(0, cut).trim();
    const tail = normalized.slice(cut).trim();
    if (wc(head) >= 52 && wc(tail) >= 52) chunks = [head, tail];
    else chunks = greedyMergeParts([normalized]);
  }

  if (!chunks.length) chunks = [normalized];
  return chunks;
}

type GeneratedArticle = {
  title: string;
  premise: string;
  body: string;
  key_ideas: [string, string, string];
  speaking_anchors: string[];
  reflection_question: string;
  speaking_prompt: string;
  difficulty: "easy" | "medium" | "hard";
};

function angleInstruction(angle: Slot["angle"]): string {
  switch (angle) {
    case "philosophical":
      return "Frame historically or conceptually; foreground definitions, tensions, paradoxes; avoid self-help tone.";
    case "practical":
      return "Anchor in behavior, decisions, and concrete micro-practices; still build an argument, not a checklist.";
    case "systems":
      return "Emphasize incentives, institutions, feedback loops, or trade-offs; end with a refined warning or trade-off, not cheerleading.";
    default:
      return "";
  }
}

async function generateArticle(
  openai: OpenAI,
  slot: Slot,
  chatModel: string
): Promise<GeneratedArticle> {
  const system = `You are the SpeakOS editorial engine. Output valid JSON only.
SpeakOS is a thinking + articulation trainer. The user flow is Read → Think → Speak → Reflect.
Tone: calm, dense, minimal jargon, intellectually honest, CEFR B2–C1. No hype, clickbait, or fluff.

JSON shape (exact keys):
{
  "title": string,
  "premise": string,
  "body": string,
  "key_ideas": string[3],
  "speaking_anchors": string[4–6 shorts],
  "reflection_question": string,
  "speaking_prompt": string,
  "difficulty": "easy"|"medium"|"hard"
}

Formatting:
- Title: 6–12 words.
- Body: Plain text with paragraphs separated by a blank line. ${MIN_WORDS}–${MAX_WORDS} words inclusive; ideal ${IDEAL_MIN}–${IDEAL_MAX}. Never exceed ${MAX_WORDS}.
Structure body as five paragraph groups conceptually matching: Hook; Core Idea 1; Core Idea 2; Core Idea 3 or counterpoint; Closing synthesis (NOT motivational fluff).
speaking_prompt must be literally: "Explain this idea in your own words in 60–120 seconds" or a close variant naming 60–120 seconds.
reflection_question must be non-obvious and test conceptual depth.

Topic: "${slot.topic.name}" — "${slot.topic.description ?? ""}"
Sub-topic: "${slot.subtopicName}" (${slot.ordinal} of 3 — vary angle versus siblings).
Variety cue: ${angleInstruction(slot.angle)}`;

  let lastErr: unknown;

  for (let attempt = 0; attempt < 5; attempt++) {
    const user = attempt === 0
      ? "Write ARTICLE ONE."
      : `Revise ONLY to fix length or JSON validity while preserving argumentative spine. Attempt ${attempt + 1}. Current word_count issue: tighten or expand body to lie ${MIN_WORDS}–${MAX_WORDS}; prefer ${IDEAL_MIN}–${IDEAL_MAX}.`;

    try {
      const res = await openai.chat.completions.create({
        model: chatModel,
        temperature: 0.72,
        max_tokens: 3200,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
      });

      const raw = res.choices[0]?.message?.content;
      if (!raw) throw new Error("Empty completion");

      const parsed = JSON.parse(raw) as GeneratedArticle;

      if (!parsed.speaking_anchors || parsed.speaking_anchors.length < 4) {
        throw new Error("speaking_anchors must have 4–6 entries");
      }
      if (!parsed.key_ideas || parsed.key_ideas.length !== 3) {
        throw new Error("key_ideas must have 3 strings");
      }

      const wc = wordCount(parsed.body ?? "");
      if (wc < MIN_WORDS || wc > MAX_WORDS) {
        lastErr = new Error(`word_count ${wc} outside ${MIN_WORDS}–${MAX_WORDS}`);
        continue;
      }

      const diff = parsed.difficulty;
      if (!["easy", "medium", "hard"].includes(diff ?? "")) {
        parsed.difficulty = "medium";
      }

      parsed.speaking_prompt =
        parsed.speaking_prompt?.includes("60")
          ? parsed.speaking_prompt
          : "Explain this idea in your own words in 60–120 seconds";

      parsed.speaking_anchors = parsed.speaking_anchors.slice(0, 6);

      return parsed;
    } catch (e) {
      lastErr = e;
      await sleep(400 * (attempt + 1));
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function embedBatch(openai: OpenAI, texts: string[], embedModel: string): Promise<number[][]> {
  let res;

  // text-embedding-3-* supports explicit dimensions; ada-002 is fixed at 1536.
  if (embedModel.includes("text-embedding-3")) {
    res = await openai.embeddings.create({
      model: embedModel,
      input: texts,
      dimensions: EMBED_DIM,
    });
  } else {
    res = await openai.embeddings.create({ model: embedModel, input: texts });
  }

  const out = res.data
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((d) => d.embedding);

  if (out.some((v) => v.length !== EMBED_DIM)) {
    throw new Error(`Embedding dimension mismatch (expected ${EMBED_DIM})`);
  }
  return out;
}

/** pgvector literal for REST / PostgREST (string brackets). Kept centralized for swaps to raw float[]. */
export function serializeVector(vector: number[]): string {
  return `[${vector.map((x) => (Number.isFinite(x) ? x : 0)).join(",")}]`;
}

async function upsertTopics(
  supabase: SupabaseClient | null,
  dryRun: boolean
): Promise<Map<string, string>> {
  const idBySlug = new Map<string, string>();

  if (dryRun) {
    SPEAKOS_TOPICS.forEach((t) => idBySlug.set(t.slug, "dry-topic-id"));
    return idBySlug;
  }

  if (!supabase) throw new Error("upsertTopics: supabase client required");

  for (const t of SPEAKOS_TOPICS) {
    const { data, error } = await supabase
      .schema("speakos")
      .from("topics")
      .upsert(
        {
          slug: t.slug,
          name: t.name,
          description: t.description,
          sort_order: t.sort_order,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select("id, slug")
      .single();

    if (error || !data) throw new Error(`topics upsert ${t.slug}: ${error?.message}`);

    idBySlug.set(data.slug!, data.id!);
  }

  return idBySlug;
}

async function upsertSubtopics(
  supabase: SupabaseClient | null,
  topicSlugToId: Map<string, string>,
  dryRun: boolean
): Promise<Map<string, { topicId: string; subtopicId: string }>> {
  const map = new Map<string, { topicId: string; subtopicId: string }>();

  if (dryRun) {
    SPEAKOS_TOPICS.forEach((t) =>
      t.subtopics.forEach((s) =>
        map.set(s.slug, { topicId: "dry-topic", subtopicId: "dry-subtopic" })
      )
    );
    return map;
  }

  if (!supabase) throw new Error("upsertSubtopics: supabase client required");

  for (const t of SPEAKOS_TOPICS) {
    const topicId = topicSlugToId.get(t.slug);
    if (!topicId) throw new Error(`missing topic id for ${t.slug}`);

    for (const s of t.subtopics) {
      const { data, error } = await supabase
        .schema("speakos")
        .from("subtopics")
        .upsert(
          {
            topic_id: topicId,
            slug: s.slug,
            name: s.name,
            sort_order: s.sort_order,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "topic_id,slug" }
        )
        .select("id, slug")
        .single();

      if (error || !data) throw new Error(`subtopics upsert ${t.slug}/${s.slug}: ${error?.message}`);
      map.set(s.slug, { topicId, subtopicId: data.id! });
    }
  }

  return map;
}

async function publishOneArticle(opts: {
  supabase: SupabaseClient | null;
  openai: OpenAI | null;
  slot: Slot;
  topicId: string;
  subtopicId: string;
  chatModel: string;
  embedModel: string;
  dryRun: boolean;
}): Promise<{
  slug: string;
  title: string;
  word_count: number;
  chunks: number;
  action: "dry-run" | "upserted";
  upsert_kind: "insert" | "update";
}> {
  const { supabase, openai, slot, topicId, subtopicId, chatModel, embedModel, dryRun } = opts;

  const meta = {
    publisher: "speakos/publish.ts",
    prompt_version: PROMPT_VERSION,
    chat_model: chatModel,
    embed_model: embedModel,
    slot: {
      ordinal: slot.ordinal,
      angle: slot.angle,
    },
    timestamp: new Date().toISOString(),
  };

  if (dryRun) {
    return {
      slug: slot.slug,
      title: "",
      word_count: 0,
      chunks: 0,
      action: "dry-run",
      upsert_kind: "insert",
    };
  }

  if (!supabase || !openai) throw new Error("publishOneArticle missing clients");

  const { data: prior } = await supabase
    .schema("speakos")
    .from("articles")
    .select("id")
    .eq("slug", slot.slug)
    .maybeSingle();

  const gen = await generateArticle(openai, slot, chatModel);
  let chunks = chunkArticleBody(gen.body);
  if (!chunks.length) chunks = [gen.body.trim()];

  const articleEmbedText = `${gen.title}\n\n${gen.premise}\n\n${gen.body}`;
  const [articleVec] = await embedBatch(openai, [articleEmbedText], embedModel);
  const chunkVecs = chunks.length ? await embedBatch(openai, chunks, embedModel) : [];

  const publishedAt = new Date().toISOString();
  const baseRow = {
    topic_id: topicId,
    subtopic_id: subtopicId,
    title: gen.title.trim(),
    slug: slot.slug,
    premise: gen.premise.trim(),
    body: gen.body.trim(),
    reading_target_seconds: READING_TARGET_SECONDS,
    word_count: wordCount(gen.body),
    difficulty: gen.difficulty,
    status: "published" as const,
    source_inspirations: SOURCE_INSPIRATIONS,
    key_ideas: gen.key_ideas,
    speaking_anchors: gen.speaking_anchors,
    reflection_question: gen.reflection_question.trim(),
    speaking_prompt: gen.speaking_prompt.trim(),
    article_embedding: serializeVector(articleVec),
    metadata: meta,
    published_at: publishedAt,
    updated_at: publishedAt,
  };

  const { data: art, error: uerr } = await supabase
    .schema("speakos")
    .from("articles")
    .upsert(baseRow, { onConflict: "slug" })
    .select("id")
    .single();

  if (uerr || !art?.id) throw new Error(`${slot.slug}: ${uerr?.message}`);

  const articleId = art.id as string;

  const { error: delErr } = await supabase
    .schema("speakos")
    .from("article_chunks")
    .delete()
    .eq("article_id", articleId);

  if (delErr) throw new Error(`delete chunks ${slot.slug}: ${delErr.message}`);

  const rows = chunks.map((text, chunk_index) => ({
    article_id: articleId,
    chunk_index,
    chunk_text: text,
    token_count: estimateTokensFromWords(wordCount(text)),
    embedding: serializeVector(chunkVecs[chunk_index]!),
  }));

  const { error: insErr } = await supabase.schema("speakos").from("article_chunks").insert(rows);
  if (insErr) throw new Error(`chunks ${slot.slug}: ${insErr.message}`);

  return {
    slug: slot.slug,
    title: gen.title,
    word_count: baseRow.word_count,
    chunks: chunks.length,
    action: "upserted",
    upsert_kind: prior?.id ? "update" : "insert",
  };
}

async function verifyIntegrity(supabase: SupabaseClient): Promise<{ ok: boolean; lines: string[] }> {
  const lines: string[] = [];

  const { count: tc } = await supabase.schema("speakos").from("topics").select("*", {
    count: "exact",
    head: true,
  });

  const { count: sc } = await supabase.schema("speakos").from("subtopics").select("*", {
    count: "exact",
    head: true,
  });

  const { data: subRows } = await supabase.schema("speakos").from("subtopics").select(`id, slug`);

  lines.push(`topics: ${tc ?? "?"} rows`);
  lines.push(`subtopics: ${sc ?? "?"} rows`);

  if (!subRows?.length) {
    lines.push("FAIL: no subtopics");
    return { ok: false, lines };
  }

  let allOk = true;

  const { data: articles } = await supabase
    .schema("speakos")
    .from("articles")
    .select(`id, slug, title, word_count, reading_target_seconds, status, article_embedding, subtopic_id`);

  function embOk(v: unknown): boolean {
    if (Array.isArray(v)) return v.length === EMBED_DIM;
    if (typeof v === "string") {
      const trimmed = v.trim();
      return trimmed.startsWith("[") && trimmed.endsWith("]") && trimmed.length > EMBED_DIM / 10;
    }
    return Boolean(v);
  }

  const articleIds = articles?.map((a) => a.id) ?? [];
  let chunkRows: { article_id: string | null; embedding: unknown }[] = [];

  if (articleIds.length) {
    const { data } = await supabase
      .schema("speakos")
      .from("article_chunks")
      .select("article_id, embedding")
      .in("article_id", articleIds);

    chunkRows = data ?? [];
  }

  const countBySub = new Map<string, number>();

  subRows.forEach((st) => countBySub.set(st.id!, 0));
  for (const a of articles ?? []) {
    if (!a.subtopic_id) continue;
    countBySub.set(a.subtopic_id, (countBySub.get(a.subtopic_id) ?? 0) + 1);
  }

  const slugBySid = new Map(subRows.map((r) => [r.id!, r.slug!]));

  for (const [sid, n] of countBySub) {
    if (n < 3) allOk = false;
    lines.push(
      `[subtopic ${slugBySid.get(sid) ?? sid}] articles: ${n} ${n < 3 ? "(need ≥3)" : "OK"}`
    );
  }

  for (const a of articles ?? []) {
    if (!embOk(a.article_embedding)) {
      lines.push(`FAIL: article ${a.slug}: invalid or missing article_embedding`);
      allOk = false;
    }

    const myChunks = chunkRows.filter((c) => c.article_id === a.id);
    if (myChunks.length < 2) {
      lines.push(`FAIL: article ${a.slug}: fewer than 2 chunks (${myChunks.length})`);
      allOk = false;
    }

    const badChunk = myChunks.filter((c) => !embOk(c.embedding));
    if (badChunk.length > 0) {
      lines.push(`FAIL: article ${a.slug}: ${badChunk.length} chunk(s) missing embeddings`);
      allOk = false;
    }

    if (a.reading_target_seconds !== READING_TARGET_SECONDS) {
      lines.push(`FAIL: ${a.slug} reading_target_seconds != ${READING_TARGET_SECONDS}`);
      allOk = false;
    }

    if (a.status !== "published") {
      lines.push(`FAIL: ${a.slug} status ${a.status}`);
      allOk = false;
    }
  }

  if (allOk) lines.push("OK: checks passed");

  return { ok: allOk, lines };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildSlots(args: ReturnType<typeof parseArgs>): Slot[] {
  const slots: Slot[] = [];

  const angleCycle: Slot["angle"][] = ["philosophical", "practical", "systems"];

  for (const t of SPEAKOS_TOPICS) {
    for (const s of t.subtopics) {
      if (args.onlySubtopic && s.slug !== args.onlySubtopic) continue;

      for (let o = 1; o <= 3; o++) {
        slots.push({
          topic: t,
          subtopicSlug: s.slug,
          subtopicName: s.name,
          ordinal: o as 1 | 2 | 3,
          slug: slugifyArticle(s.slug, o as 1 | 2 | 3),
          angle: angleCycle[o - 1]!,
        });
      }
    }
  }

  return typeof args.limit === "number" && args.limit >= 1 ? slots.slice(0, args.limit) : slots;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
  const OPENAI_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini";
  const OPENAI_EMBED_MODEL = process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small";

  console.log("[speakos:publish] starting");
  console.log(`[speakos:publish] dryRun=${args.dryRun} limit=${args.limit ?? "none"} onlySubtopic=${args.onlySubtopic ?? "none"}`);

  if (
    !args.dryRun &&
    (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY || OPENAI_API_KEY === "")
  ) {
    console.error(
      "Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or OPENAI_API_KEY (non-empty)."
    );
    process.exitCode = 1;
    return;
  }

  const slots = buildSlots(args);
  const supabase: SupabaseClient | null =
    args.dryRun
      ? null
      : createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
  const openai: OpenAI | null =
    args.dryRun || !OPENAI_API_KEY ? null : new OpenAI({ apiKey: OPENAI_API_KEY });

  const topicIds = await upsertTopics(supabase, args.dryRun);
  const subMap = await upsertSubtopics(supabase, topicIds, args.dryRun);

  let created = 0;
  let updated = 0;
  let totalChunksWritten = 0;
  const failures: { slug?: string; reason: string }[] = [];
  const samples: Array<Record<string, string | number>> = [];

  for (const slot of slots) {
    const entry = subMap.get(slot.subtopicSlug);
    if (!entry) {
      failures.push({ slug: slot.slug, reason: "subtopic not found after taxonomy upsert" });
      continue;
    }

    try {
      await sleep(200);
      const r = await publishOneArticle({
        supabase,
        openai,
        slot,
        topicId: entry.topicId,
        subtopicId: entry.subtopicId,
        chatModel: OPENAI_CHAT_MODEL,
        embedModel: OPENAI_EMBED_MODEL,
        dryRun: args.dryRun,
      });

      if (r.action === "upserted") {
        if (r.upsert_kind === "insert") created++;
        else updated++;
        totalChunksWritten += r.chunks;
        samples.push({
          slug: slot.slug,
          title: String(r.title),
          topic: slot.topic.slug,
          subtopic: slot.subtopicSlug,
          word_count: r.word_count,
        });
      }
    } catch (e) {
      failures.push({
        slug: slot.slug,
        reason: e instanceof Error ? e.message : String(e),
      });
      console.error(`[FAIL] ${slot.slug}: ${failures.at(-1)?.reason}`);
    }
  }

  const reportSamples = samples.slice(0, 14);

  let verifyLines: string[] = [];
  let verifyOk = true;
  if (!args.dryRun && failures.length === 0 && slots.length && supabase) {
    try {
      const v = await verifyIntegrity(supabase);
      verifyLines = v.lines;
      verifyOk = v.ok;
    } catch (e) {
      verifyLines = [`verification threw: ${e instanceof Error ? e.message : String(e)}`];
      verifyOk = false;
    }
  }

  console.log("\n=== SpeakOS Publisher Report ===");
  console.log(`topics processed: ${SPEAKOS_TOPICS.length}`);
  console.log(
    `subtopics processed: ${SPEAKOS_TOPICS.reduce((n, t) => n + t.subtopics.length, 0)}`
  );
  console.log(`articles upsert attempted: ${slots.length}`);
  console.log(`articles inserts (estimated): ${created}`);
  console.log(`articles updates (estimated): ${updated}`);
  console.log(`chunks inserted this run (sum of chunk rows written): ${totalChunksWritten}`);
  console.log(`failed: ${failures.length}`);
  console.log(`sample rows:\n${JSON.stringify(reportSamples, null, 2)}`);
  console.log("\nverification:\n", verifyLines.join("\n"));

  if (failures.length) console.log("\nfailures:", JSON.stringify(failures.slice(0, 30), null, 2));

  if ((failures.length > 0 || !verifyOk) && !args.dryRun) {
    process.exitCode = 1;
  }

  console.log("\n[done]");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
