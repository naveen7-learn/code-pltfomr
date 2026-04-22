import { AnimatePresence, motion } from "framer-motion";

export const CommandPalette = ({ open, query, onQueryChange, results, onClose, onSelect }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-24 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          onClick={(event) => event.stopPropagation()}
          className="glass-panel w-full max-w-2xl rounded-[30px] p-4"
        >
          <input
            autoFocus
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Jump to files, projects, pull requests..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
          />
          <div className="mt-4 space-y-2">
            {results.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => onSelect(result)}
                className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-slate-200 transition hover:bg-white/5"
              >
                <span>{result.label}</span>
                <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{result.type}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
