import { Eclipse, Sparkles, SunMedium } from "lucide-react";
import { motion } from "framer-motion";

export const ThemeToggle = ({ theme, onToggle }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.03, y: -1 }}
    onClick={onToggle}
    className="glass-panel flex items-center gap-3 rounded-full px-2 py-2 text-sm text-slate-200"
  >
    <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-cyan-300/25 via-sky-400/15 to-emerald-300/25">
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_45%)]" />
      {theme === "dark" ? <Eclipse size={17} className="relative text-cyan-100" /> : <SunMedium size={17} className="relative text-amber-100" />}
    </span>
    <span className="pr-2 text-left">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-slate-400">Appearance</span>
      <span className="flex items-center gap-1.5 font-medium text-white">
        {theme === "dark" ? "Night Shift" : "Studio Light"}
        <Sparkles size={13} className="text-cyan-300" />
      </span>
    </span>
  </motion.button>
);
