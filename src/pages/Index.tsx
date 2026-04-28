import { useEffect, useState } from "react";
import { TopicScreen } from "@/components/speakos/TopicScreen";
import { ReadingScreen } from "@/components/speakos/ReadingScreen";
import { SpeakingScreen } from "@/components/speakos/SpeakingScreen";
import { FeedbackScreen } from "@/components/speakos/FeedbackScreen";
import { ProcessingScreen } from "@/components/speakos/ProcessingScreen";
import { useRandomArticle } from "@/hooks/use-content";
import { useSession } from "@/hooks/use-session";
import type { SubtopicSelection, SessionContent } from "@/types/speakos";

type Stage = "topic" | "reading" | "speaking" | "processing" | "feedback";

const Index = () => {
  const [stage, setStage] = useState<Stage>("topic");
  const [selection, setSelection] = useState<SubtopicSelection | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const {
    data: article,
    isLoading: articleLoading,
  } = useRandomArticle(selection?.subtopicId ?? null);

  const session = useSession();

  useEffect(() => {
    document.title = "SpeakOS \u2014 Think clearly. Speak simply.";
    const meta =
      document.querySelector('meta[name="description"]') ??
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "SpeakOS is a calm space to read deeply, then explain ideas in your own words. Think clearly. Speak simply.",
    );
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  useEffect(() => {
    if (session.status === "complete") setStage("feedback");
  }, [session.status]);

  const content: SessionContent | null =
    selection && article
      ? {
          topicName: selection.topicName,
          subtopicName: selection.subtopicName,
          article,
        }
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage]);

  const handleRestart = () => {
    setSelection(null);
    setSkipped(false);
    setAudioBlob(null);
    session.reset();
    setStage("topic");
  };

  return (
    <div key={stage} className="bg-paper text-ink">
      {stage === "topic" && (
        <TopicScreen
          onSelect={(s) => {
            setSelection(s);
            setSkipped(false);
            setAudioBlob(null);
            session.reset();
            setStage("reading");
          }}
        />
      )}

      {stage === "reading" &&
        (articleLoading || !content ? (
          <main className="min-h-screen flex items-center justify-center fade-in">
            <p className="text-[15px] text-whisper animate-pulse">
              Loading article&hellip;
            </p>
          </main>
        ) : (
          <ReadingScreen
            content={content}
            onBack={() => {
              setSelection(null);
              setStage("topic");
            }}
            onComplete={() => setStage("speaking")}
          />
        ))}

      {stage === "speaking" && (
        <SpeakingScreen
          onComplete={(blob) => {
            if (blob && content) {
              setAudioBlob(blob);
              setSkipped(false);
              setStage("processing");
              session.processRecording(blob, content.article.id);
            }
          }}
          onSkip={() => {
            setSkipped(true);
            setStage("feedback");
          }}
        />
      )}

      {stage === "processing" && (
        <ProcessingScreen
          status={session.status}
          error={session.error}
          onRetry={() => {
            if (audioBlob && content) {
              session.processRecording(audioBlob, content.article.id);
            }
          }}
          onBack={handleRestart}
        />
      )}

      {stage === "feedback" && content && (
        <FeedbackScreen
          content={content}
          result={session.result}
          skipped={skipped}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
