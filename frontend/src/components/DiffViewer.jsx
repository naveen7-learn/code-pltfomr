import { createLineDiff } from "../utils/diff";

const rowClass = {
  same: "bg-transparent text-slate-300",
  added: "bg-emerald-400/10 text-emerald-100",
  removed: "bg-rose-400/10 text-rose-100",
  modified: "bg-amber-400/10 text-amber-100"
};

export const DiffViewer = ({ file, onLineComment }) => {
  if (!file) {
    return null;
  }

  const rows = createLineDiff(file.before, file.after);

  return (
    <div className="glass-panel overflow-hidden rounded-[28px]">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="font-medium text-white">{file.path}</p>
      </div>
      <div className="max-h-[420px] overflow-auto font-mono text-sm">
        {rows.map((row) => (
          <button
            key={`${row.line}-${row.type}`}
            onClick={() => onLineComment(row.line)}
            className={`grid w-full grid-cols-[72px_1fr_1fr] gap-4 px-4 py-2 text-left ${rowClass[row.type]}`}
          >
            <span className="text-xs text-slate-500">{row.line}</span>
            <span className="whitespace-pre-wrap">{row.left || " "}</span>
            <span className="whitespace-pre-wrap">{row.right || " "}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
