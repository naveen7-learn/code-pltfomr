import { motion, AnimatePresence } from "framer-motion";
import { FolderGit2, LayoutDashboard, Search, Sparkles, Workflow } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/dashboard", icon: FolderGit2 },
  { label: "Reviews", to: "/dashboard", icon: Workflow },
  { label: "Search", to: "/dashboard", icon: Search }
];

export const Sidebar = ({ collapsed, onToggle }) => (
  <motion.aside
    animate={{ width: collapsed ? 88 : 280 }}
    className="glass-panel hidden h-[calc(100vh-2rem)] shrink-0 rounded-[30px] p-4 md:flex md:flex-col"
  >
    <button
      onClick={onToggle}
      className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left"
    >
      <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-300 p-3 text-slate-950">
        <Sparkles size={18} />
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
            <p className="text-sm text-slate-400">Workspace</p>
            <p className="font-semibold text-white">CodeFlow Review</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>

    <nav className="space-y-2">
      {links.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={label}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
              isActive ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <Icon size={18} />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  </motion.aside>
);
