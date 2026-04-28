import type { SessionContent, AnalysisResult } from "@/types/speakos";

export const FeedbackScreen = ({
  content,
  result,
  skipped = false,
  onRestart,
}: {
  content: SessionContent;
  result: AnalysisResult | null;
  skipped?: boolean;
  onRestart: () => void;
}) => {
  if (skipped) {
    const keyIdeas = content.article.key_ideas ?? [];

    return (
      <main className="min-h-screen px-6 py-20 fade-in">
        <div className="max-w-2xl mx-auto">
          <p className="text-[13px] tracking-[0.22em] uppercase text-whisper mb-5">
            {content.subtopicName}
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
              <div className="font-serif text-[24px] text-ink leading-none">
                complete
              </div>
            </div>
            <div className="py-6 grid grid-cols-[1fr_auto] items-baseline">
              <div className="text-[15px] text-ink-soft">Speaking</div>
              <div className="text-[14px] text-whisper italic">
                not attempted
              </div>
            </div>
          </section>

          {keyIdeas.length > 0 && (
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
          )}

          {content.article.speaking_prompt && (
            <section className="mt-16">
              <h2 className="text-[13px] tracking-[0.18em] uppercase text-whisper mb-5">
                A way to explain it
              </h2>
              <p className="prose-reading text-[18px] text-ink-soft">
                {content.article.speaking_prompt}
              </p>
            </section>
          )}

          <div className="mt-20 flex items-center justify-center gap-6">
            <button onClick={onRestart} className="btn-quiet">
              Try again
            </button>
          </div>

          <p className="mt-10 text-center text-[13px] text-whisper italic">
            &ldquo;Understanding shows when you speak.&rdquo;
          </p>
        </div>
      </main>
    );
  }

  if (!result) return null;

  const metrics = [
    {
      label: "Clarity",
      score: result.scores.clarity,
      note: result.structuredFeedback.clarity.reasoning,
      suggestion: result.structuredFeedback.clarity.suggestion,
    },
    {
      label: "Structure",
      score: result.scores.structure,
      note: result.structuredFeedback.structure.reasoning,
      suggestion: result.structuredFeedback.structure.suggestion,
    },
    {
      label: "Depth",
      score: result.scores.depth,
      note: result.structuredFeedback.depth.reasoning,
      suggestion: result.structuredFeedback.depth.suggestion,
    },
    {
      label: "Original Thought",
      score: result.scores.originality,
      note: result.structuredFeedback.originality.reasoning,
      suggestion: result.structuredFeedback.originality.suggestion,
    },
  ];

  return (
    <main className="min-h-screen px-6 py-20 fade-in">
      <div className="max-w-2xl mx-auto">
        <p className="text-[13px] tracking-[0.22em] uppercase text-whisper mb-5">
          {content.subtopicName}
        </p>
        <h1 className="font-serif text-[40px] leading-tight text-ink">
          Here&rsquo;s how you did
        </h1>
        <p className="mt-3 text-[15px] text-whisper">{result.feedback}</p>

        {/* Overall score */}
        <div className="mt-10 flex items-baseline gap-3">
          <span className="font-serif text-[56px] text-ink tabular-nums leading-none">
            {Math.round(result.scores.overall)}
          </span>
          <span className="text-[15px] text-whisper">/100 overall</span>
        </div>

        {/* Individual scores */}
        <section className="mt-10 divide-y divide-hairline border-y border-hairline">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="py-6 grid grid-cols-[1fr_auto] gap-x-8 gap-y-1 fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-[15px] text-ink font-medium">{m.label}</div>
              <div className="font-serif text-[28px] text-ink tabular-nums leading-none self-start">
                {Math.round(m.score)}
                <span className="text-whisper text-[15px] font-sans">
                  /100
                </span>
              </div>
              <p className="text-[14px] text-ink-soft leading-relaxed col-span-2 max-w-lg">
                {m.note}
              </p>
              {m.suggestion && (
                <p className="text-[13px] text-premium leading-relaxed col-span-2 max-w-lg mt-1">
                  &rarr; {m.suggestion}
                </p>
              )}
            </div>
          ))}
        </section>

        {/* Transcript */}
        <section className="mt-16">
          <h2 className="text-[13px] tracking-[0.18em] uppercase text-whisper mb-5">
            Your transcript
          </h2>
          <p className="prose-reading text-[17px] text-ink-soft leading-relaxed">
            {result.transcript}
          </p>
        </section>

        {/* Reflection */}
        {content.article.reflection_question && (
          <section className="mt-16 p-6 bg-ink/[0.02] rounded-lg border border-hairline">
            <h2 className="text-[13px] tracking-[0.18em] uppercase text-whisper mb-3">
              Something to think about
            </h2>
            <p className="prose-reading text-[17px] text-ink italic">
              {content.article.reflection_question}
            </p>
          </section>
        )}

        <div className="mt-20 flex items-center justify-center gap-6">
          <button onClick={onRestart} className="btn-quiet">
            Think again
          </button>
        </div>

        <p className="mt-10 text-center text-[13px] text-whisper italic">
          &ldquo;Clarity is earned.&rdquo;
        </p>
      </div>
    </main>
  );
};
