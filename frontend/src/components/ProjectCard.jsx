import { motion } from "framer-motion";
import { Calendar, GitBranch, Users } from "lucide-react";

export const ProjectCard = ({ project, onOpen }) => (
  <motion.button
    whileHover={{ y: -4, scale: 1.012 }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.22 }}
    onClick={onOpen}
    className="card-interactive group relative overflow-hidden p-6 text-left"
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(92,124,255,0.14),transparent_28%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    <div className="relative space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="surface-label text-accent-300">{project.visibility || "Private"}</p>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-neutral-100 light-mode:text-neutral-900 line-clamp-1">
            {project.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-400 light-mode:text-neutral-600 line-clamp-2">
            {project.description || "Ready for review"}
          </p>
        </div>
        <motion.div whileHover={{ y: -1 }} className="shrink-0 rounded-full border border-accent-400/20 bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-200">
          {project.files?.length || 0} files
        </motion.div>
      </div>

      <div className="border-t divider" />

      <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 light-mode:text-neutral-600">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-neutral-600 transition-transform duration-200 group-hover:-translate-y-0.5 light-mode:text-neutral-400" />
          <span>{project.members?.length || 1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GitBranch size={14} className="text-neutral-600 transition-transform duration-200 group-hover:-translate-y-0.5 light-mode:text-neutral-400" />
          <span>{project.pullRequests?.length || 0}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Calendar size={14} className="text-neutral-600 transition-transform duration-200 group-hover:-translate-y-0.5 light-mode:text-neutral-400" />
          <span>Updated now</span>
        </div>
      </div>
    </div>
  </motion.button>
);
