import { useState, useCallback } from "react";
import { getAnonymousId } from "@/lib/anonymous-id";
import type { AnalysisResult } from "@/types/speakos";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export type SessionStatus =
  | "idle"
  | "uploading"
  | "transcribing"
  | "analyzing"
  | "complete"
  | "error";

export function useSession() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const processRecording = useCallback(
    async (audioBlob: Blob, articleId: string) => {
      setStatus("uploading");
      setError(null);
      setResult(null);

      try {
        const anonymousId = getAnonymousId();
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("article_id", articleId);
        formData.append("anonymous_id", anonymousId);

        await new Promise((r) => setTimeout(r, 800));
        setStatus("transcribing");

        const transcribeRes = await fetch(
          `${SUPABASE_URL}/functions/v1/transcribe-audio`,
          { method: "POST", body: formData },
        );

        if (!transcribeRes.ok) {
          const err = await transcribeRes.json().catch(() => ({}));
          throw new Error(
            err.error || `Transcription failed (${transcribeRes.status})`,
          );
        }

        const transcribeData = await transcribeRes.json();
        const sessionId = transcribeData.session_id as string;

        setStatus("analyzing");
        const analyzeRes = await fetch(
          `${SUPABASE_URL}/functions/v1/analyze-session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
          },
        );

        if (!analyzeRes.ok) {
          const err = await analyzeRes.json().catch(() => ({}));
          throw new Error(
            err.error || `Analysis failed (${analyzeRes.status})`,
          );
        }

        const analyzeData = await analyzeRes.json();

        setResult({
          analysisId: analyzeData.analysis_id,
          sessionId,
          scores: analyzeData.scores,
          feedback: analyzeData.feedback,
          structuredFeedback: analyzeData.structured_feedback,
          transcript: transcribeData.transcript as string,
          embeddingComparison: analyzeData.embedding_comparison
            ? {
                pairsComputed:
                  analyzeData.embedding_comparison.pairs_computed,
                avgSimilarity:
                  analyzeData.embedding_comparison.avg_similarity,
                maxSimilarity:
                  analyzeData.embedding_comparison.max_similarity,
              }
            : null,
        });
        setStatus("complete");
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setResult(null);
  }, []);

  return { status, error, result, processRecording, reset };
}
