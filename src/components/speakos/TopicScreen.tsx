import { useState } from "react";
import { TOPICS, type Topic } from "./topics";

const FAQS = [
  {
    q: "What is this?",
    a: "A space to practice thinking and speaking clearly. You read, then explain.",
  },
  {
    q: "Why does this matter?",
    a: "Understanding is often an illusion. Speaking forces clarity.",
  },
  {
    q: "Do I need to be good at speaking?",
    a: "No. This is where you improve.",
  },
  {
    q: "How does it work?",
    a: "Read for a few minutes. Then speak without notes. Reflect and improve.",
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
          className="text-whisper text-[18px] leading-none transition-transform duration-500 ml-4"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
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

export const TopicScreen = ({ onSelect }: { onSelect: (t: Topic) => void }) => {
  return (
    <main className="min-h-screen px-6 py-20 fade-in">
      <div className="w-full max-w-3xl mx-auto text-center">
        <p className="text-[13px] tracking-[0.22em] uppercase text-whisper mb-10 fade-up">
          SpeakOS
        </p>

        <h1 className="font-serif text-[40px] sm:text-[52px] leading-[1.15] text-ink fade-up"
            style={{ animationDelay: "80ms" }}>
          I want to learn to think
          <br className="hidden sm:block" />
          {" "}and speak about
        </h1>

        <div className="mt-14 flex flex-wrap justify-center gap-3 fade-up"
             style={{ animationDelay: "200ms" }}>
          {TOPICS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className="pill fade-up"
              style={{ animationDelay: `${260 + i * 50}ms` }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Quiet context */}
        <section
          className="mt-24 max-w-xl mx-auto fade-up"
          style={{ animationDelay: "600ms" }}
        >
          <p className="text-[15px] leading-[1.8] text-whisper">
            Most people consume more than they can express.
            <br />
            We read, scroll, and move on — without ever testing our understanding.
          </p>
          <p className="mt-6 text-[15px] leading-[1.8] text-whisper">
            SpeakOS helps you slow down.
            <br />
            Read something deeply, then explain it in your own words.
          </p>
          <p className="mt-10 text-[14px] text-hairline italic" style={{ color: "hsl(0 0% 72%)" }}>
            Clarity comes from articulation.
          </p>
        </section>

        {/* FAQ */}
        <section
          className="mt-32 max-w-xl mx-auto text-left fade-up"
          style={{ animationDelay: "700ms" }}
        >
          <p className="text-[12px] tracking-[0.22em] uppercase text-whisper mb-4 text-center">
            Questions
          </p>
          <div className="divide-y divide-hairline">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </section>

        <p className="mt-24 text-[13px] text-whisper fade-up"
           style={{ animationDelay: "800ms" }}>
          Read deeply. Speak clearly. Improve over time.
        </p>
      </div>
    </main>
  );
};
