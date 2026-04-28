import { useEffect, useMemo, useState } from "react";
import type { SessionContent } from "@/types/speakos";

const READ_SECONDS = 3 * 60;

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};

function parseBody(body: string): { type: "p"; text: string }[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((text) => ({ type: "p" as const, text }));
}

export const ReadingScreen = ({
  content,
  onComplete,
  onBack,
}: {
  content: SessionContent;
  onComplete: () => void;
  onBack: () => void;
}) => {
  const [remaining, setRemaining] = useState(READ_SECONDS);
  const [done, setDone] = useState(false);

  const paragraphs = useMemo(
    () => parseBody(content.article.body),
    [content.article.body],
  );

  const readingTime = `${Math.ceil(content.article.word_count / 200)} min read`;

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [done]);

  const progress = 1 - remaining / READ_SECONDS;

  return (
    <main className="min-h-screen bg-paper fade-in">
      <header className="fixed top-0 inset-x-0 z-20 bg-paper/85 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="btn-ghost">
            &larr; Back
          </button>
          <div className="text-[13px] tabular-nums text-ink-soft tracking-wide">
            {fmt(remaining)}
          </div>
        </div>
        <div className="h-px bg-hairline" />
      </header>

      <article
        className={`max-w-2xl mx-auto px-6 pt-32 pb-40 transition-all duration-700 ${
          done ? "blur-md scale-[0.99] opacity-60" : ""
        }`}
        style={{ transitionTimingFunction: "var(--transition-quiet)" }}
      >
        <p className="text-[13px] tracking-[0.18em] uppercase text-whisper mb-5">
          {content.subtopicName} &middot; {readingTime}
        </p>
        <h1 className="font-serif text-[36px] sm:text-[44px] leading-[1.15] text-ink mb-12">
          {content.article.title}
        </h1>

        {content.article.premise && (
          <p className="text-[17px] text-ink-soft italic leading-relaxed mb-10">
            {content.article.premise}
          </p>
        )}

        <div className="prose-reading">
          {paragraphs.map((b, i) => (
            <p key={i}>{b.text}</p>
          ))}
        </div>

        {!done && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => {
                setDone(true);
                setTimeout(onComplete, 500);
              }}
              className="inline-flex items-center justify-center rounded-full border border-hairline bg-paper px-7 py-3 text-[14px] text-ink-soft hover:text-ink hover:border-ink/30 hover:-translate-y-px transition-all duration-300"
              style={{ transitionTimingFunction: "var(--transition-quiet)" }}
            >
              I've read enough
            </button>
          </div>
        )}
      </article>

      <div className="fixed bottom-0 inset-x-0 z-20">
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="flex items-center justify-between text-[12px] text-whisper mb-2 tracking-wide">
            <span>Reading</span>
            <span className="tabular-nums">
              {fmt(READ_SECONDS - remaining)} / 3:00
            </span>
          </div>
          <div className="h-[2px] bg-hairline rounded-full overflow-hidden">
            <div
              className="h-full bg-ink transition-all duration-1000 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>

      {done && (
        <div className="fixed inset-0 z-30 flex items-center justify-center px-6 fade-blur-in">
          <div className="text-center max-w-md">
            <h2 className="font-serif text-[34px] leading-tight text-ink">
              Now, explain this in your own words.
            </h2>
            <p className="mt-4 text-[15px] text-whisper">
              No notes. Just clarity.
            </p>
            <button onClick={onComplete} className="btn-quiet mt-10">
              Start Speaking
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
