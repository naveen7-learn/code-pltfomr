import { ChevronRight, FileCode2, Folder } from "lucide-react";
import { motion } from "framer-motion";

export const RepositoryTree = ({ files, selectedPath, onSelect }) => (
  <div className="card h-full rounded-[28px] p-4">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="surface-label">Explorer</h3>
      <span className="text-xs text-neutral-500 light-mode:text-slate-500">{files.length} nodes</span>
    </div>

    <div className="space-y-1 overflow-y-auto scrollbar-thin">
      {files.map((file) => (
        <motion.button
          key={file._id || file.path}
          whileHover={{ x: 4 }}
          onClick={() => file.type === "file" && onSelect(file)}
          className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm transition ${
            selectedPath === file.path
              ? "border border-accent-400/20 bg-accent-500/10 text-accent-100 light-mode:text-accent-700"
              : "border border-transparent text-neutral-300 hover:bg-white/[0.04] light-mode:text-slate-700 light-mode:hover:bg-slate-100"
          }`}
        >
          {file.type === "folder" ? (
            <Folder size={16} className="text-amber-300 light-mode:text-amber-600" />
          ) : (
            <FileCode2 size={16} className="text-accent-300 light-mode:text-accent-600" />
          )}
          <span className="truncate">{file.path}</span>
          <ChevronRight size={14} className="ml-auto text-neutral-500 light-mode:text-slate-500" />
        </motion.button>
      ))}
    </div>
  </div>
);
