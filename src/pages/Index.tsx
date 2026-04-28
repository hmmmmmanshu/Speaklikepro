import { useEffect, useState } from "react";
import { TopicScreen } from "@/components/speakos/TopicScreen";
import { ReadingScreen } from "@/components/speakos/ReadingScreen";
import { SpeakingScreen } from "@/components/speakos/SpeakingScreen";
import { FeedbackScreen } from "@/components/speakos/FeedbackScreen";
import type { Topic } from "@/components/speakos/topics";

type Stage = "topic" | "reading" | "speaking" | "feedback";

const Index = () => {
  const [stage, setStage] = useState<Stage>("topic");
  const [topic, setTopic] = useState<Topic | null>(null);

  useEffect(() => {
    document.title = "SpeakOS — Think clearly. Speak simply.";
    const meta =
      document.querySelector('meta[name="description"]') ??
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "SpeakOS is a calm space to read deeply, then explain ideas in your own words. Think clearly. Speak simply."
    );
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  return (
    <div key={stage} className="bg-paper text-ink">
      {stage === "topic" && (
        <TopicScreen
          onSelect={(t) => {
            setTopic(t);
            setStage("reading");
          }}
        />
      )}
      {stage === "reading" && topic && (
        <ReadingScreen
          topic={topic}
          onBack={() => setStage("topic")}
          onComplete={() => setStage("speaking")}
        />
      )}
      {stage === "speaking" && (
        <SpeakingScreen onComplete={() => setStage("feedback")} />
      )}
      {stage === "feedback" && topic && (
        <FeedbackScreen
          topic={topic}
          onRestart={() => {
            setTopic(null);
            setStage("topic");
          }}
        />
      )}
    </div>
  );
};

export default Index;
