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
  const { data: topics, isLoading } = useTopics();
  const [active, setActive] = useState<TopicWithSubtopics | null>(null);

  return (
    <main className="min-h-screen px-6 py-20 fade-in relative">
      <img
        src="/Thoughtly.png"
        alt="SpeakOS logo"
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
                SpeakOS
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
          Pick a topic to start:
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-3 items-start fade-up relative z-10">
          {isLoading ? (
            <p className="text-[14px] text-whisper animate-pulse">
              Loading topics\u2026
            </p>
          ) : (
            (topics ?? []).map((c, i) => {
              const isActive = active?.id === c.id;

              return (
                <div
                  key={c.id}
                  className="flex flex-col items-center transition-all duration-500"
                >
                  <button
                    onClick={() => setActive(isActive ? null : c)}
                    className={cn(
                      "pill transition-all duration-300 z-20",
                      isActive
                        ? "bg-premium text-premium-foreground border-premium hover:bg-premium/90 shadow-md"
                        : "hover:border-ink/20",
                    )}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {c.name}
                  </button>

                  {isActive && (
                    <div className="flex flex-wrap justify-center gap-3 mt-4 animate-in slide-in-from-top-2 fade-in duration-300 max-w-[85vw] sm:max-w-[400px]">
                      {c.subtopics.map((s, j) => (
                        <button
                          key={s.id}
                          onClick={() =>
                            onSelect({
                              topicName: c.name,
                              subtopicId: s.id,
                              subtopicName: s.name,
                            })
                          }
                          className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-paper px-3.5 py-1.5 text-[12px] text-ink hover:border-premium hover:text-premium transition-all shadow-sm whitespace-nowrap"
                          style={{ animationDelay: `${j * 30}ms` }}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
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
