import { Bell, ChevronDown, Command, Search, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../context/AuthContext"; // 🆕 Import Auth Hook

export const Topbar = ({ onSearch, notifications, theme, onToggleTheme }) => {
  const { logout, user } = useAuth(); // 🆕 Get Logout function
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="border-b border-white/5 bg-neutral-950/55 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500 md:inline-flex"
          >
            Collaboration Hub
          </motion.div>
          <motion.button
            whileHover={{ y: -1, scale: 1.005 }}
            whileTap={{ scale: 0.99 }}
            onClick={onSearch}
            className="group ghost-button flex min-w-[220px] items-center gap-3 rounded-full px-4 py-2.5 text-sm text-neutral-400 shadow-sm-glow"
          >
            <motion.div whileHover={{ rotate: 6 }} transition={{ duration: 0.2 }}>
              <Search size={16} className="text-neutral-500 transition-colors group-hover:text-neutral-300" />
            </motion.div>
            <span className="text-neutral-400 transition-colors group-hover:text-neutral-200">Search reviews, files, people</span>
            <span className="ml-auto flex items-center gap-1 rounded-full border border-white/8 px-2 py-0.5 text-[11px] text-neutral-500">
              <Command size={12} />K
            </span>
          </motion.button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <motion.button
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="ghost-button relative h-10 w-10 rounded-full p-0 text-neutral-300 light-mode:text-neutral-700"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {notifications.length > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-accent-400 animate-pulse-soft" />}
          </motion.button>

          {/* 🆕 PROFILE DROPDOWN CONTAINER */}
          <div className="relative">
            <motion.button 
              whileHover={{ y: -1 }} 
              onClick={() => setShowDropdown(!showDropdown)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Small delay to allow click
              className="ghost-button hidden items-center gap-3 rounded-full px-3 py-2 text-left md:inline-flex"
            >
              <div className="floating-orb flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-cyan-400 text-xs font-bold text-white">
                {user?.name?.charAt(0) || "CR"}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-100 light-mode:text-neutral-900">{user?.name || "Design Ops"}</p>
                <p className="text-xs text-neutral-500">Workspace</p>
              </div>
              <ChevronDown size={15} className={`text-neutral-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* 🆕 DROPDOWN MENU */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 p-1.5 shadow-2xl z-50"
                >
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Logout Session
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
