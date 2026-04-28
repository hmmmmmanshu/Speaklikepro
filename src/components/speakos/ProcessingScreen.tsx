import { useEffect, useState } from "react";
import type { SessionStatus } from "@/hooks/use-session";

const STATUS_COPY: Record<
  SessionStatus,
  { title: string; subtitles: string[] }
> = {
  idle: { title: "Preparing\u2026", subtitles: [""] },
  uploading: {
    title: "Sending your recording\u2026",
    subtitles: ["This will take a moment."],
  },
  transcribing: {
    title: "Processing your words\u2026",
    subtitles: [
      "Converting speech to text.",
      "Picking up every sentence.",
      "Almost done transcribing.",
    ],
  },
  analyzing: {
    title: "Thinking about what you said\u2026",
    subtitles: [
      "Comparing your ideas to the article.",
      "Scoring clarity, structure, and depth.",
      "Building your feedback report.",
    ],
  },
  complete: { title: "Done!", subtitles: [""] },
  error: { title: "Something went wrong", subtitles: [""] },
};

export const ProcessingScreen = ({
  status,
  error,
  onRetry,
  onBack,
}: {
  status: SessionStatus;
  error: string | null;
  onRetry: () => void;
  onBack: () => void;
}) => {
  const msg = STATUS_COPY[status];
  const isError = status === "error";

  const [subIdx, setSubIdx] = useState(0);

  useEffect(() => {
    setSubIdx(0);
  }, [status]);

  useEffect(() => {
    if (msg.subtitles.length <= 1) return;
    const id = setInterval(() => {
      setSubIdx((i) => (i + 1) % msg.subtitles.length);
    }, 4000);
    return () => clearInterval(id);
  }, [status, msg.subtitles.length]);

  const subtitle = msg.subtitles[subIdx] ?? "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 fade-in">
      {!isError && (
        <div className="mb-12 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-ink/30 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      )}

      <h2 className="font-serif text-[28px] sm:text-[32px] text-ink text-center max-w-md leading-snug">
        {msg.title}
      </h2>

      {subtitle && (
        <p
          key={`${status}-${subIdx}`}
          className="mt-4 text-[15px] text-whisper text-center fade-in"
        >
          {subtitle}
        </p>
      )}

      {isError && error && (
        <p className="mt-6 text-[14px] text-red-500 text-center max-w-md">
          {error}
        </p>
      )}

      {isError && (
        <div className="mt-10 flex gap-4">
          <button onClick={onRetry} className="btn-quiet">
            Try again
          </button>
          <button onClick={onBack} className="btn-ghost">
            Pick a new topic
          </button>
        </div>
      )}
    </main>
  );
};
