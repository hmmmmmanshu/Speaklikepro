import { useState } from "react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { useTopics } from "@/hooks/use-content";
import type { SubtopicSelection, TopicWithSubtopics } from "@/types/speakos";

const FAQS = [
  {
    q: "Why this tool?",
    a: "Because you read 100 articles a week and can\u2019t explain a single one of them. We mistake recognizing information for actually understanding it. If you\u2019ve ever felt like you lack depth in your favorite topics, this is the cure.",
  },
  {
    q: "Is this a public speaking app?",
    a: "No. This is a thinking app. Public speaking apps care about your hand gestures and filler words. We care about whether your brain actually holds original, structured thoughts.",
  },
  {
    q: "Who is this for?",
    a: 'Founders who need to pitch clearly, students who need to defend their ideas, people preparing for dates who want to sound interesting, and anyone tired of having a brain full of bookmarks but a mouth full of "umms" and "likes."',
  },
  {
    q: "How does the AI judge me?",
    a: "It doesn\u2019t care about your accent or if you stuttered once. It listens for structure, depth of understanding, and originality. Did you just memorize the article, or did you actually synthesize the ideas?",
  },
  {
    q: "Why only 3 minutes?",
    a: "Constraints breed clarity. If you can\u2019t explain a concept in 3 minutes, you don\u2019t understand it well enough. We force you to get to the point.",
  },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left group"
        aria-expanded={open}
      >
        <span className="text-[15px] text-ink-soft group-hover:text-ink transition-colors duration-300">
          {q}
        </span>
        <span
          className="text-whisper text-[18px] leading-none transition-all duration-500 ml-4 group-hover:text-premium"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            color: open ? "hsl(var(--premium))" : undefined,
            transitionTimingFunction: "var(--transition-quiet)",
          }}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-all duration-500"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionTimingFunction: "var(--transition-quiet)",
        }}
      >
        <div className="overflow-hidden">
          <p className="pt-3 text-[14px] text-whisper leading-relaxed max-w-xl">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TopicScreen = ({
  onSelect,
}: {
  onSelect: (s: SubtopicSelection) => void;
}) => {
  const { data: topics } = useTopics();
  const [active, setActive] = useState<TopicWithSubtopics | null>(null);

  return (
    <main className="min-h-screen px-6 py-20 fade-in relative">
      <img
        src="/comprehendly.png"
        alt="Comprehendly logo"
        className="absolute top-6 left-6 h-10 w-auto object-contain fade-up"
      />

      <div className="w-full max-w-3xl mx-auto text-center">
        <div className="mb-10 flex justify-center fade-up">
          <div
            className={cn(
              "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span className="text-[13px] tracking-[0.22em] uppercase">
                Comprehendly
              </span>
            </AnimatedShinyText>
          </div>
        </div>

        <h1
          className="font-serif text-[40px] sm:text-[52px] leading-[1.15] text-ink fade-up"
          style={{ animationDelay: "80ms" }}
        >
          Read. Speak.
          <br className="hidden sm:block" />{" "}
          <span className="text-premium">Build Depth.</span>
        </h1>

        <div
          className="w-12 h-1 bg-premium/60 mx-auto mt-8 rounded-full fade-up"
          style={{ animationDelay: "130ms" }}
        />

        <p
          className="mt-12 max-w-xl mx-auto text-[15px] leading-[1.8] text-whisper fade-up"
          style={{ animationDelay: "180ms" }}
        >
          Read a topic for{" "}
          <span className="text-premium font-medium">3 minutes</span>. Speak
          about it for{" "}
          <span className="text-premium font-medium">3 minutes</span>. Test your
          understanding, expose your blind spots, and build true{" "}
          <span className="text-ink">clarity</span> over time.
        </p>

        <p
          className="mt-8 text-[14px] text-ink font-medium tracking-wide fade-up"
          style={{ animationDelay: "220ms" }}
        >
          Pick a subject to start:
        </p>

        {/* Subject cloud \u2014 stays stable; subtopics open in the panel below */}
        <div
          className="mt-10 flex flex-wrap justify-center gap-2.5 fade-up relative z-10"
          style={{ animationDelay: "260ms" }}
        >
          {(topics ?? []).map((c, i) => {
            const isActive = active?.id === c.id;

            return (
              <button
                key={c.id}
                onClick={() => setActive(isActive ? null : c)}
                aria-pressed={isActive}
                className={cn(
                  "pill transition-all duration-300",
                  isActive
                    ? "bg-premium text-premium-foreground border-premium hover:bg-premium/90 shadow-md"
                    : "hover:border-ink/20",
                )}
                style={{ animationDelay: `${260 + i * 30}ms` }}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Subtopic panel \u2014 reserved space keeps the cloud from jumping */}
        <div className="mt-9 min-h-[148px] flex items-start justify-center px-2">
          {active ? (
            <div key={active.id} className="w-full max-w-md fade-blur-in">
              {active.description && (
                <p className="font-serif italic text-[16px] text-ink-soft leading-relaxed mb-6">
                  {active.description}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-2.5">
                {active.subtopics.map((s, j) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      onSelect({
                        topicName: active.name,
                        subtopicId: s.id,
                        subtopicName: s.name,
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-paper px-4 py-2 text-[13px] text-ink shadow-sm transition-all duration-300 hover:border-premium hover:text-premium hover:-translate-y-px whitespace-nowrap fade-up"
                    style={{
                      animationDelay: `${j * 45}ms`,
                      transitionTimingFunction: "var(--transition-quiet)",
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-whisper fade-in">
              Choose a subject, then a question to speak on.
            </p>
          )}
        </div>

        <p
          className="mt-16 text-[14px] italic fade-up"
          style={{ animationDelay: "500ms" }}
        >
          <span className="text-premium">Clarity</span>{" "}
          <span className="text-whisper">comes from</span>{" "}
          <span className="text-premium">articulation</span>.
        </p>

        <section
          className="mt-24 max-w-xl mx-auto text-left fade-up"
          style={{ animationDelay: "600ms" }}
        >
          <p className="text-[12px] tracking-[0.22em] uppercase text-premium mb-4 text-center font-medium">
            Questions
          </p>
          <div className="divide-y divide-hairline">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </section>

        <p
          className="mt-24 text-[13px] text-whisper fade-up"
          style={{ animationDelay: "700ms" }}
        >
          Read deeply. Speak clearly. Improve over time.
        </p>
      </div>
    </main>
  );
};
