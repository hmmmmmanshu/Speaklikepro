import type { Topic } from "./topics";

const METRICS = [
  { label: "Clarity",         score: 82, note: "Your ideas land cleanly. A few sentences ran long." },
  { label: "Structure",       score: 74, note: "A clear opening. The middle could use a sharper turn." },
  { label: "Depth",           score: 68, note: "You touched the surface honestly. Push one layer further." },
  { label: "Original Thought", score: 71, note: "One genuine insight. Trust it next time, sooner." },
];

const TRANSCRIPT_PARTS: { text: string; kind: "normal" | "filler" | "strong" }[] = [
  { text: "So ", kind: "filler" },
  { text: "the idea here is that ", kind: "normal" },
  { text: "thinking slowly is not the same as thinking weakly", kind: "strong" },
  { text: ". ", kind: "normal" },
  { text: "Um, ", kind: "filler" },
  { text: "most of the time we reach for the first answer because it feels safe, ", kind: "normal" },
  { text: "you know, ", kind: "filler" },
  { text: "but the first answer is usually borrowed. ", kind: "normal" },
  { text: "Real understanding asks us to stay with a question a little longer than we want to", kind: "strong" },
  { text: ", and ", kind: "normal" },
  { text: "like, ", kind: "filler" },
  { text: "that extra minute is where the actual thinking begins.", kind: "normal" },
];

export const FeedbackScreen = ({
  topic,
  skipped = false,
  onRestart,
}: {
  topic: Topic;
  skipped?: boolean;
  onRestart: () => void;
}) => {
  if (skipped) {
    // Pull a few key ideas from the article body (paragraphs only, first 3)
    const keyIdeas = topic.article.body
      .filter((b) => b.type === "p")
      .slice(0, 3)
      .map((b) => b.text);

    return (
      <main className="min-h-screen px-6 py-20 fade-in">
        <div className="max-w-2xl mx-auto">
          <p className="text-[13px] tracking-[0.22em] uppercase text-whisper mb-5">
            {topic.label}
          </p>
          <h1 className="font-serif text-[40px] leading-tight text-ink">
            A quiet pause
          </h1>
          <p className="mt-3 text-[15px] text-whisper">
            You skipped speaking. Try next time for better feedback.
          </p>

          <section className="mt-14 border-y border-hairline divide-y divide-hairline">
            <div className="py-6 grid grid-cols-[1fr_auto] items-baseline">
              <div className="text-[15px] text-ink font-medium">Reading</div>
              <div className="font-serif text-[24px] text-ink leading-none">complete</div>
            </div>
            <div className="py-6 grid grid-cols-[1fr_auto] items-baseline">
              <div className="text-[15px] text-ink-soft">Speaking</div>
              <div className="text-[14px] text-whisper italic">not attempted</div>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-[13px] tracking-[0.18em] uppercase text-whisper mb-5">
              Key ideas
            </h2>
            <ul className="space-y-5">
              {keyIdeas.map((idea, i) => (
                <li
                  key={i}
                  className="prose-reading text-[17px] pl-5 border-l border-hairline fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {idea}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="text-[13px] tracking-[0.18em] uppercase text-whisper mb-5">
              A way to explain it
            </h2>
            <p className="prose-reading text-[18px] text-ink-soft">
              Open with one sentence that names the idea. Then offer a small,
              concrete example from your own life. End by saying what changes
              if the idea is true. Three movements. Nothing more.
            </p>
          </section>

          <div className="mt-20 flex items-center justify-center gap-6">
            <button onClick={onRestart} className="btn-quiet">Try again</button>
          </div>

          <p className="mt-10 text-center text-[13px] text-whisper italic">
            "Understanding shows when you speak."
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-20 fade-in">
      <div className="max-w-2xl mx-auto">
        <p className="text-[13px] tracking-[0.22em] uppercase text-whisper mb-5">
          {topic.label}
        </p>
        <h1 className="font-serif text-[40px] leading-tight text-ink">
          Here's how you did
        </h1>
        <p className="mt-3 text-[15px] text-whisper">Clarity is earned. Keep going.</p>

        {/* Metrics */}
        <section className="mt-14 divide-y divide-hairline border-y border-hairline">
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className="py-6 grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-[15px] text-ink font-medium">{m.label}</div>
              <div className="font-serif text-[28px] text-ink tabular-nums leading-none self-start">
                {m.score}
                <span className="text-whisper text-[15px] font-sans">/100</span>
              </div>
              <p className="text-[14px] text-ink-soft leading-relaxed col-span-2 max-w-lg">
                {m.note}
              </p>
            </div>
          ))}
        </section>

        {/* Transcript */}
        <section className="mt-16">
          <h2 className="text-[13px] tracking-[0.18em] uppercase text-whisper mb-5">
            Transcript
          </h2>
          <p className="prose-reading text-[18px]">
            {TRANSCRIPT_PARTS.map((p, i) => (
              <span
                key={i}
                className={
                  p.kind === "filler"
                    ? "text-hairline"
                    : p.kind === "strong"
                    ? "text-ink font-medium"
                    : "text-ink-soft"
                }
                style={p.kind === "filler" ? { color: "hsl(0 0% 78%)" } : undefined}
              >
                {p.text}
              </span>
            ))}
          </p>
          <div className="mt-6 flex gap-5 text-[12px] text-whisper">
            <span><span className="inline-block w-2 h-2 rounded-full mr-2 align-middle" style={{ background: "hsl(0 0% 78%)" }} />filler</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-ink" />strong sentence</span>
          </div>
        </section>

        <div className="mt-20 flex items-center justify-center gap-6">
          <button onClick={onRestart} className="btn-quiet">Think again</button>
        </div>

        <p className="mt-10 text-center text-[13px] text-whisper italic">
          "Clarity is earned."
        </p>
      </div>
    </main>
  );
};
