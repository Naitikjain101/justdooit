export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-muted ${className}`}
      style={{ position: "relative" }}
    >
      <div className="shimmer absolute inset-0" />
      <style>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            color-mix(in oklab, var(--background) 60%, transparent) 50%,
            transparent 100%
          );
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
