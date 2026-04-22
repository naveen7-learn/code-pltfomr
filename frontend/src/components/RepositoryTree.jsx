import { ChevronRight, FileCode2, Folder } from "lucide-react";
import { motion } from "framer-motion";

export const RepositoryTree = ({ files, selectedPath, onSelect }) => (
  <div className="glass-panel h-full rounded-[28px] p-4">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Explorer</h3>
      <span className="text-xs text-slate-500">{files.length} nodes</span>
    </div>

    <div className="space-y-1 overflow-y-auto scrollbar-thin">
      {files.map((file) => (
        <motion.button
          key={file._id || file.path}
          whileHover={{ x: 4 }}
          onClick={() => file.type === "file" && onSelect(file)}
          className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm ${
            selectedPath === file.path ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300 hover:bg-white/5"
          }`}
        >
          {file.type === "folder" ? <Folder size={16} className="text-amber-300" /> : <FileCode2 size={16} className="text-cyan-300" />}
          <span className="truncate">{file.path}</span>
          <ChevronRight size={14} className="ml-auto text-slate-500" />
        </motion.button>
      ))}
    </div>
  </div>
);
