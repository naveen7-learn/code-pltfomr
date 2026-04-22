import { motion } from "framer-motion";
import { createLineDiff } from "../utils/diff";

const rowClass = {
  same: "bg-transparent text-neutral-300 light-mode:text-slate-700",
  added: "bg-emerald-500/10 text-emerald-200 light-mode:text-emerald-700",
  removed: "bg-rose-500/10 text-rose-200 light-mode:text-rose-700",
  modified: "bg-amber-500/10 text-amber-200 light-mode:text-amber-700"
};

export const DiffViewer = ({ file, onLineComment }) => {
  if (!file) {
    return null;
  }

  const rows = createLineDiff(file.before, file.after);

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.22 }} className="card overflow-hidden rounded-[28px]">
      <div className="border-b px-4 py-3 divider">
        <p className="font-medium text-neutral-100 light-mode:text-slate-950">{file.path}</p>
      </div>
      <div className="max-h-[420px] overflow-auto font-mono text-sm scrollbar-thin">
        {rows.map((row, index) => (
          <motion.button
            key={`${row.line}-${row.type}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.004, 0.18) }}
            onClick={() => onLineComment(row.line)}
            className={`grid w-full grid-cols-[72px_1fr_1fr] gap-4 px-4 py-2 text-left transition hover:bg-white/[0.04] light-mode:hover:bg-slate-50 ${rowClass[row.type]}`}
          >
            <span className="text-xs text-neutral-500 light-mode:text-slate-500">{row.line}</span>
            <span className="whitespace-pre-wrap">{row.left || " "}</span>
            <span className="whitespace-pre-wrap">{row.right || " "}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
