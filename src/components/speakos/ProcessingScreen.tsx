import type { SessionStatus } from "@/hooks/use-session";

const STATUS_COPY: Record<
  SessionStatus,
  { title: string; subtitle: string }
> = {
  idle: { title: "Preparing\u2026", subtitle: "" },
  uploading: {
    title: "Uploading your recording\u2026",
    subtitle: "This will take a moment.",
  },
  transcribing: {
    title: "Listening to you\u2026",
    subtitle: "Converting speech to text.",
  },
  analyzing: {
    title: "Thinking about what you said\u2026",
    subtitle: "Comparing your response to the article.",
  },
  complete: { title: "Done!", subtitle: "" },
  error: { title: "Something went wrong", subtitle: "" },
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

      {msg.subtitle && (
        <p className="mt-4 text-[15px] text-whisper text-center">
          {msg.subtitle}
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
