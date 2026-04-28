import { useEffect, useRef } from "react";

const BARS = 24;
const MIN_H = 4;
const MAX_H = 44;

export const Waveform = ({
  active,
  analyser,
}: {
  active: boolean;
  analyser: AnalyserNode | null;
}) => {
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active || !analyser) {
      barsRef.current.forEach((el) => {
        if (el) el.style.height = `${MIN_H}px`;
      });
      return;
    }

    const binCount = analyser.frequencyBinCount;
    const data = new Uint8Array(binCount);
    const step = Math.max(1, Math.floor(binCount / BARS));

    const draw = () => {
      analyser.getByteFrequencyData(data);

      for (let i = 0; i < BARS; i++) {
        const el = barsRef.current[i];
        if (!el) continue;

        const bin = Math.min(i * step, binCount - 1);
        const raw = data[bin] / 255;
        const h = MIN_H + raw * (MAX_H - MIN_H);
        el.style.height = `${h}px`;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, analyser]);

  return (
    <div className="flex items-center justify-center gap-[5px] h-12">
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            barsRef.current[i] = el;
          }}
          className="w-[3px] rounded-full bg-ink/70"
          style={{
            height: `${MIN_H}px`,
            transition: "height 60ms linear",
          }}
        />
      ))}
    </div>
  );
};
