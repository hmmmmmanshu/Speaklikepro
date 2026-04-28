import { useEffect, useState } from "react";
import { Mic, MicOff, ShieldAlert } from "lucide-react";
import { Waveform } from "./Waveform";
import { useRecorder } from "@/hooks/use-recorder";

const SPEAK_SECONDS = 3 * 60;

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};

export const SpeakingScreen = ({
  onComplete,
  onSkip,
}: {
  onComplete: (audioBlob?: Blob) => void;
  onSkip: () => void;
}) => {
  const { status, error, audioBlob, analyser, requestPermission, start, stop } =
    useRecorder();

  const [countdown, setCountdown] = useState(SPEAK_SECONDS);
  const isRecording = status === "recording";
  const hasError = status === "error";
  const isRequesting = status === "requesting";

  useEffect(() => {
    if (status === "idle") {
      requestPermission();
    }
  }, [status, requestPermission]);

  useEffect(() => {
    if (!isRecording) return;
    const id = setInterval(() => {
      setCountdown((r) => {
        if (r <= 1) {
          clearInterval(id);
          stop();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRecording, stop]);

  useEffect(() => {
    if (status === "stopped" && audioBlob) {
      const timer = setTimeout(() => onComplete(audioBlob), 400);
      return () => clearTimeout(timer);
    }
  }, [status, audioBlob, onComplete]);

  const handleMicClick = () => {
    if (isRecording) return;
    if (status === "ready") {
      start();
    } else if (hasError) {
      requestPermission();
    }
  };

  const handleFinishEarly = () => {
    stop();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 fade-in">
      <p className="text-[13px] tracking-[0.22em] uppercase text-whisper mb-4">
        {isRecording
          ? "Listening"
          : isRequesting
          ? "Requesting access"
          : hasError
          ? "Microphone blocked"
          : status === "ready"
          ? "Ready"
          : "Setting up"}
      </p>

      <h2 className="font-serif text-[28px] sm:text-[32px] text-ink text-center max-w-md leading-snug">
        {isRecording
          ? "Say it simply."
          : hasError
          ? "Microphone access needed."
          : "Think before you speak."}
      </h2>

      {hasError && (
        <div className="mt-6 max-w-sm text-center">
          <div className="flex items-center justify-center gap-2 text-red-600 mb-3">
            <ShieldAlert className="h-5 w-5" />
            <span className="text-sm font-medium">
              {error === "permission-denied"
                ? "Permission denied"
                : error === "not-supported"
                ? "Not supported on this browser"
                : error === "device-error"
                ? "No microphone found"
                : "Permission dismissed"}
            </span>
          </div>
          <p className="text-[13px] text-ink-soft leading-relaxed">
            {error === "permission-denied" ? (
              <>
                Click the <strong>lock icon</strong> in your browser's address
                bar, set Microphone to <strong>Allow</strong>, then reload the
                page.
              </>
            ) : error === "not-supported" ? (
              "Your browser doesn't support audio recording. Try Chrome, Edge, or Safari."
            ) : error === "device-error" ? (
              "No microphone detected. Please connect one and try again."
            ) : (
              "The permission prompt was dismissed. Tap the mic button to try again."
            )}
          </p>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center">
        <button
          onClick={handleMicClick}
          disabled={isRecording || isRequesting}
          className={`relative h-32 w-32 rounded-full flex items-center justify-center
                     transition-all duration-500
                     ${
                       hasError
                         ? "bg-red-100 text-red-600 hover:bg-red-200"
                         : isRecording
                         ? "bg-ink text-paper breathe cursor-not-allowed"
                         : "bg-ink text-paper hover:scale-[1.03]"
                     }
                     ${isRequesting ? "opacity-60 cursor-wait" : ""}`}
          style={{ transitionTimingFunction: "var(--transition-quiet)" }}
          aria-label={hasError ? "Retry microphone access" : "Record"}
        >
          {hasError ? (
            <MicOff className="h-8 w-8" strokeWidth={1.6} />
          ) : (
            <Mic className="h-8 w-8" strokeWidth={1.6} />
          )}
        </button>

        <div className="mt-12 h-12 w-64">
          <Waveform active={isRecording} analyser={analyser} />
        </div>

        <div className="mt-6 text-[13px] tabular-nums text-ink-soft tracking-wide">
          {fmt(countdown)}
        </div>
      </div>

      <p className="mt-20 text-[13px] text-whisper">
        {isRecording
          ? "No pause. No retry. Just speak."
          : hasError
          ? "Fix the issue above to continue."
          : isRequesting
          ? "Allow microphone access in the popup."
          : "Tap to begin."}
      </p>

      {isRecording ? (
        <button onClick={handleFinishEarly} className="mt-6 btn-ghost">
          Finish early
        </button>
      ) : (
        <button onClick={onSkip} className="mt-6 btn-ghost">
          Skip speaking
        </button>
      )}
    </main>
  );
};
