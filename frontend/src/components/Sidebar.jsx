import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Code2, FolderGit2, GitPullRequest, LayoutDashboard, PanelLeftClose, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { listItemIn } from "../animations/pageTransitions";

const links = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/dashboard", icon: FolderGit2 },
  { label: "Pull Requests", to: "/pull-requests", icon: GitPullRequest },
  { label: "Reviews", to: "/reviews", icon: Code2 },
  { label: "Insights", to: "/insights", icon: Sparkles }
];

export const Sidebar = ({ collapsed, onToggle }) => (
  <motion.aside
    animate={{ width: collapsed ? 72 : 272 }}
    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
    className="hidden border-r border-white/5 bg-white/[0.02] md:flex md:shrink-0"
  >
    <div className="flex h-full flex-col px-3 py-3">
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-3 text-left soft-breathe"
      >
        <div className="floating-orb flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 via-accent-500 to-cyan-400 shadow-[0_10px_30px_rgba(92,124,255,0.35)]">
          <span className="font-display text-sm font-bold text-white">CR</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="min-w-0 flex-1"
            >
              <p className="surface-label">Active workspace</p>
              <p className="truncate pt-1 text-sm font-semibold text-neutral-100">Code Review Studio</p>
            </motion.div>
          )}
        </AnimatePresence>
        {!collapsed && <PanelLeftClose size={16} className="text-neutral-500 transition-transform duration-200 group-hover:-translate-x-0.5" />}
      </motion.button>

      <div className="mt-6 px-2">
        {!collapsed && <p className="surface-label pb-3">Navigate</p>}
        <nav className="space-y-1.5">
          {links.map(({ label, to, icon: Icon }, index) => (
            <motion.div key={label} {...listItemIn} transition={{ ...listItemIn.transition, delay: 0.02 * index }}>
              <NavLink to={to}>
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ x: 2 }}
                    className={`nav-link-premium group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "border border-white/10 bg-white/[0.07] text-neutral-100 shadow-sm-glow"
                        : "border border-transparent text-neutral-400 hover:border-white/8 hover:bg-white/[0.04] hover:text-neutral-200"
                    }`}
                  >
                    <motion.div animate={{ rotate: isActive ? 0 : -2, scale: isActive ? 1.04 : 1 }} transition={{ duration: 0.22 }}>
                      <Icon size={18} className="shrink-0" />
                    </motion.div>
                    {!collapsed && (
                      <>
                        <span className="truncate">{label}</span>
                        <motion.span
                          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.7 }}
                          transition={{ duration: 0.18 }}
                          className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-300"
                        />
                        <ArrowUpRight size={14} className={`text-neutral-500 transition-all ${isActive ? "opacity-0" : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-60"}`} />
                      </>
                    )}
                  </motion.div>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>

      <div className="mt-auto rounded-[28px] border border-white/8 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4">
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div key="mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center">
              <Sparkles size={18} className="text-accent-300 floating-orb" />
            </motion.div>
          ) : (
            <motion.div key="full" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
              <p className="surface-label">Focus</p>
              <h3 className="pt-2 text-sm font-semibold text-neutral-100">Review velocity is up 18%</h3>
              <p className="pt-2 text-sm leading-6 text-neutral-400">Keep approvals moving with smaller, faster review batches and clearer ownership.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.aside>
);
