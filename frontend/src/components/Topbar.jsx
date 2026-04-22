import { Bell, Command, Search } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export const Topbar = ({ onSearch, notifications, theme, onToggleTheme }) => (
  <div className="glass-panel flex items-center justify-between rounded-[28px] px-5 py-4">
    <button
      onClick={onSearch}
      className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
    >
      <Search size={16} />
      <span>Search projects, files, pull requests</span>
      <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
        <Command size={12} />K
      </span>
    </button>

    <div className="flex items-center gap-3">
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      <motion.button whileTap={{ scale: 0.94 }} className="glass-panel relative rounded-full p-3 text-slate-100">
        <Bell size={18} />
        {notifications.length > 0 && (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-emerald-300" />
        )}
      </motion.button>
    </div>
  </div>
);
