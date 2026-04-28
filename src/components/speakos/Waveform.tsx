const BARS = 24;

export const Waveform = ({ active }: { active: boolean }) => {
  return (
    <div className="flex items-center justify-center gap-[5px] h-12">
      {Array.from({ length: BARS }).map((_, i) => {
        const delay = (i % 6) * 90;
        const base = 6 + ((i * 37) % 18);
        return (
          <span
            key={i}
            className="w-[3px] rounded-full bg-ink/70"
            style={{
              height: active ? `${base + 6}px` : "6px",
              animation: active
                ? `wave 900ms ease-in-out ${delay}ms infinite alternate`
                : undefined,
              transition: "height 400ms var(--transition-quiet)",
            }}
          />
        );
      })}
      <style>{`
        @keyframes wave {
          0%   { transform: scaleY(0.4); }
          100% { transform: scaleY(1.6); }
        }
      `}</style>
    </div>
  );
};
