import { AnimatePresence, motion } from "framer-motion";
import { Command, CornerDownLeft, Search } from "lucide-react";

const itemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }
  })
};

export const CommandPalette = ({ open, query, onQueryChange, results, onClose, onSelect }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-950/60 p-4 pt-24 backdrop-blur-xl light-mode:bg-slate-200/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -26, opacity: 0, scale: 0.975 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(event) => event.stopPropagation()}
          className="card w-full max-w-2xl overflow-hidden rounded-[28px]"
        >
          <div className="flex items-center gap-3 border-b px-5 py-4 divider">
            <motion.div
              initial={{ rotate: -8, scale: 0.92 }}
              animate={{ rotate: 0, scale: 1 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] light-mode:bg-accent-50"
            >
              <Search size={18} className="text-accent-300 light-mode:text-accent-600" />
            </motion.div>
            <input
              autoFocus
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search projects, files, pull requests..."
              className="flex-1 bg-transparent text-base text-neutral-100 outline-none placeholder:text-neutral-500 light-mode:text-slate-950 light-mode:placeholder:text-slate-400"
            />
            <div className="hidden items-center gap-2 rounded-full border border-white/8 px-3 py-1 text-xs text-neutral-500 light-mode:border-slate-300/80 md:inline-flex">
              <Command size={12} />
              Close
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-2 scrollbar-thin">
            {results.length > 0 ? (
              results.map((result, index) => (
                <motion.button
                  key={`${result.type}-${result.id}`}
                  custom={index}
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  whileHover={{ y: -1, scale: 1.002 }}
                  onClick={() => onSelect(result)}
                  className="command-result flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/[0.05] light-mode:hover:bg-slate-100"
                >
                  <div>
                    <span className="block font-medium text-neutral-200 light-mode:text-slate-900">{result.label}</span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-neutral-500 light-mode:text-slate-500">{result.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 light-mode:text-slate-500">
                    <CornerDownLeft size={14} />
                    Open
                  </div>
                </motion.button>
              ))
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-neutral-300 light-mode:text-slate-800">No results found</p>
                <p className="mt-2 text-sm text-neutral-500 light-mode:text-slate-500">Try a project name, file, or pull request.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
