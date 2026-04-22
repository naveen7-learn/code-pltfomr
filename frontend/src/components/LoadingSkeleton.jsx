export const LoadingSkeleton = ({ className = "" }) => (
  <div
    className={`animate-shimmer rounded-[28px] border border-white/8 bg-[length:200%_100%] bg-gradient-to-r from-white/[0.03] via-white/[0.09] to-white/[0.03] light-mode:border-slate-300/70 light-mode:from-slate-100 light-mode:via-white light-mode:to-slate-100 ${className}`}
  />
);
