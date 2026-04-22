import { motion } from "framer-motion";
import { CalendarClock, GitPullRequestArrow, Users } from "lucide-react";

export const ProjectCard = ({ project, onOpen }) => (
  <motion.button
    whileHover={{ y: -6, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onOpen}
    className="glass-panel group relative overflow-hidden rounded-3xl p-5 text-left"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-emerald-300/5 opacity-0 transition group-hover:opacity-100" />
    <div className="relative space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">{project.visibility}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{project.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-300">{project.description || "Ready for the next review cycle."}</p>
        </div>
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
          {project.files?.length || 0} files
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs text-slate-300">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <Users size={14} className="mb-2 text-cyan-300" />
          <span>{project.members?.length || 1} collaborators</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <GitPullRequestArrow size={14} className="mb-2 text-emerald-300" />
          <span>Review ready</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <CalendarClock size={14} className="mb-2 text-sky-300" />
          <span>Updated recently</span>
        </div>
      </div>
    </div>
  </motion.button>
);
