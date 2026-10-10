import { useState, useCallback } from "react";
import { getAnonymousId } from "@/lib/anonymous-id";
import type { AnalysisResult } from "@/types/speakos";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

export type SessionStatus =
  | "idle"
  | "uploading"
  | "transcribing"
  | "analyzing"
  | "complete"
  // Backend is unreachable (e.g. the Supabase project is paused). Distinct from
  // "error": nothing the user did is wrong, so we degrade gracefully instead of
  // showing a scary retry prompt.
  | "unavailable"
  | "error";

// A 5xx, a 404 (function not deployed), or no response at all means the scoring
// backend is down rather than the request being bad.
function isBackendDown(status: number): boolean {
  return status === 0 || status === 404 || status >= 500;
}

export function useSession() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const processRecording = useCallback(
    async (audioBlob: Blob, articleId: string) => {
      setStatus("uploading");
      setError(null);
      setResult(null);

      if (!SUPABASE_URL) {
        // No backend configured — treat scoring as unavailable, not an error.
        setStatus("unavailable");
        return;
      }

      try {
        const anonymousId = getAnonymousId();
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("article_id", articleId);
        formData.append("anonymous_id", anonymousId);

        await new Promise((r) => setTimeout(r, 800));
        setStatus("transcribing");

        let transcribeRes: Response;
        try {
          transcribeRes = await fetch(
            `${SUPABASE_URL}/functions/v1/transcribe-audio`,
            { method: "POST", body: formData },
          );
        } catch {
          // Network error / DNS / CORS — the backend never answered.
          setStatus("unavailable");
          return;
        }

        if (!transcribeRes.ok) {
          if (isBackendDown(transcribeRes.status)) {
            setStatus("unavailable");
            return;
          }
          const err = await transcribeRes.json().catch(() => ({}));
          throw new Error(
            err.error || `Transcription failed (${transcribeRes.status})`,
          );
        }

        const transcribeData = await transcribeRes.json();
        const sessionId = transcribeData.session_id as string;

        setStatus("analyzing");

        let analyzeRes: Response;
        try {
          analyzeRes = await fetch(
            `${SUPABASE_URL}/functions/v1/analyze-session`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_id: sessionId }),
            },
          );
        } catch {
          setStatus("unavailable");
          return;
        }

        if (!analyzeRes.ok) {
          if (isBackendDown(analyzeRes.status)) {
            setStatus("unavailable");
            return;
          }
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
