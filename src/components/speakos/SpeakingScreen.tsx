import { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import { Waveform } from "./Waveform";

const SPEAK_SECONDS = 3 * 60;

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};

export const SpeakingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [recording, setRecording] = useState(false);
  const [remaining, setRemaining] = useState(SPEAK_SECONDS);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setTimeout(onComplete, 400);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [recording, onComplete]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 fade-in">
      <p className="text-[13px] tracking-[0.22em] uppercase text-whisper mb-4">
        {recording ? "Listening" : "Ready"}
      </p>

      <h2 className="font-serif text-[28px] sm:text-[32px] text-ink text-center max-w-md leading-snug">
        {recording ? "Say it simply." : "Think before you speak."}
      </h2>

      <div className="mt-16 flex flex-col items-center">
        <button
          onClick={() => !recording && setRecording(true)}
          disabled={recording}
          className={`relative h-32 w-32 rounded-full bg-ink text-paper flex items-center justify-center
                     transition-all duration-500 ${recording ? "breathe cursor-not-allowed" : "hover:scale-[1.03]"}`}
          style={{ transitionTimingFunction: "var(--transition-quiet)" }}
          aria-label="Record"
        >
          <Mic className="h-8 w-8" strokeWidth={1.6} />
        </button>

        <div className="mt-12 h-12 w-64">
          <Waveform active={recording} />
        </div>

        <div className="mt-6 text-[13px] tabular-nums text-ink-soft tracking-wide">
          {fmt(remaining)}
        </div>
      </div>

      <p className="mt-20 text-[13px] text-whisper">
        {recording ? "No pause. No retry. Just speak." : "Tap to begin."}
      </p>

      {recording && (
        <button
          onClick={onComplete}
          className="mt-6 btn-ghost"
        >
          Finish early
        </button>
      )}
    </main>
  );
};
