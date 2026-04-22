export const LoadingSkeleton = ({ className = "" }) => (
  <div
    className={`animate-shimmer rounded-2xl bg-[length:200%_100%] bg-gradient-to-r from-white/5 via-white/10 to-white/5 ${className}`}
  />
);
