import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, TrendingUp } from "lucide-react";
import { fetchProjects, createProject } from "../services/projectService";
import { ProjectCard } from "../components/ProjectCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Timeline } from "../components/Timeline";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { staggerContainer } from "../animations/pageTransitions";

export const DashboardPage = ({ onSearchIndex, onNotify }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects()
      .then((result) => {
        setProjects(result);
        onSearchIndex(
          result.map((project) => ({
            id: project._id,
            type: "project",
            label: project.name,
            to: `/projects/${project._id}`
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [onSearchIndex]);

  const recentActivity = useMemo(
    () => projects.flatMap((project) => project.activity || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [projects]
  );

  const handleCreateProject = async (payload) => {
    const project = await createProject(payload);
    setProjects((current) => [project, ...current]);
    onNotify({
      id: crypto.randomUUID(),
      title: "Project created",
      body: `${project.name} is ready for collaborators.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-panel rounded-[32px] p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">Code review command center</p>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white">Ship polished code faster.</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Review diffs, collaborate inline, and keep every project moving with fast visual feedback and realtime updates.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-5 py-4 font-medium text-slate-950"
            >
              <Plus size={16} className="mr-2 inline" />
              New Project
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-[32px] p-6">
          <div className="flex items-center gap-3 text-cyan-200">
            <TrendingUp size={18} />
            <span className="text-sm uppercase tracking-[0.22em]">Team velocity</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-semibold text-white">{projects.length}</p>
              <p className="mt-1 text-sm text-slate-400">Active projects</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-3xl font-semibold text-white">
                {projects.reduce((sum, project) => sum + (project.files?.length || 0), 0)}
              </p>
              <p className="mt-1 text-sm text-slate-400">Tracked files</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <LoadingSkeleton key={index} className="h-56" />)
            : projects.map((project) => (
                <ProjectCard key={project._id} project={project} onOpen={() => navigate(`/projects/${project._id}`)} />
              ))}
        </motion.div>

        <Timeline events={recentActivity} />
      </div>

      <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateProject} />
    </div>
  );
};
