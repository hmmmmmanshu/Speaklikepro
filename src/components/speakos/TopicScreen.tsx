import { TOPICS, type Topic } from "./topics";

export const TopicScreen = ({ onSelect }: { onSelect: (t: Topic) => void }) => {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 fade-in">
      <div className="w-full max-w-3xl text-center">
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

        <p className="mt-16 text-[14px] text-whisper fade-up"
           style={{ animationDelay: "600ms" }}>
          Read deeply. Speak clearly. Improve over time.
        </p>
      </div>
    </main>
  );
};
