import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, GitBranchPlus, Plus, ScanSearch, UsersRound } from "lucide-react";
import { fetchProjects, createProject } from "../services/projectService";
import { ProjectCard } from "../components/ProjectCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Timeline } from "../components/Timeline";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { listItemIn, riseIn, staggerContainer } from "../animations/pageTransitions";

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

  const metrics = useMemo(
    () => [
      { label: "Active projects", value: projects.length, icon: BriefcaseBusiness },
      { label: "Tracked files", value: projects.reduce((sum, project) => sum + (project.files?.length || 0), 0), icon: ScanSearch },
      { label: "Team members", value: projects.reduce((sum, project) => sum + (project.members?.length || 0), 0), icon: UsersRound }
    ],
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
    <div className="space-y-6 md:space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <motion.div {...riseIn} className="card overflow-hidden p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow">Overview</p>
              <h1 className="pt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-neutral-100 light-mode:text-slate-950 md:text-5xl">
                Review work with sharper focus and calmer momentum.
              </h1>
              <p className="max-w-xl pt-5 text-base leading-7 text-neutral-400 light-mode:text-slate-600">
                A cleaner control center for projects, pull requests, and collaboration signals across your team.
              </p>
            </div>

            <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setModalOpen(true)} className="pill-button rounded-full px-5 py-3">
              <Plus size={16} className="mr-2" />
              New Project
            </motion.button>
          </div>

          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="mt-8 grid gap-4 md:grid-cols-3">
            {metrics.map(({ label, value, icon: Icon }, index) => (
              <motion.div
                key={label}
                {...listItemIn}
                transition={{ ...listItemIn.transition, delay: 0.04 * index + 0.08 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 light-mode:border-slate-300/70 light-mode:bg-white/76"
              >
                <div className="floating-orb flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] light-mode:bg-accent-50">
                  <Icon size={18} className="text-accent-300 light-mode:text-accent-600" />
                </div>
                <p className="pt-5 text-3xl font-semibold text-neutral-100 light-mode:text-slate-950">{value}</p>
                <p className="pt-1 text-sm text-neutral-500 light-mode:text-slate-500">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.06 }} className="card p-6 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="surface-label">This week</p>
              <h2 className="pt-2 text-2xl font-semibold text-neutral-100 light-mode:text-slate-950">Delivery pulse</h2>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 light-mode:text-emerald-700">
              Healthy
            </div>
          </div>

          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="mt-8 space-y-5">
            <motion.div {...listItemIn} whileHover={{ y: -2 }} className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 light-mode:border-slate-300/70 light-mode:bg-white/78">
              <div>
                <p className="text-sm font-medium text-neutral-200 light-mode:text-slate-900">Approval rate</p>
                <p className="pt-1 text-sm text-neutral-500 light-mode:text-slate-500">Teams are merging with fewer review rounds.</p>
              </div>
              <p className="font-display text-3xl font-semibold text-neutral-100 light-mode:text-slate-950">84%</p>
            </motion.div>
            <motion.div {...listItemIn} transition={{ ...listItemIn.transition, delay: 0.05 }} whileHover={{ y: -2 }} className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 light-mode:border-slate-300/70 light-mode:bg-white/78">
              <div>
                <p className="text-sm font-medium text-neutral-200 light-mode:text-slate-900">Open review load</p>
                <p className="pt-1 text-sm text-neutral-500 light-mode:text-slate-500">Balanced across current reviewers.</p>
              </div>
              <p className="font-display text-3xl font-semibold text-neutral-100 light-mode:text-slate-950">19</p>
            </motion.div>
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} className="ghost-button w-full rounded-2xl py-3">
              View collaboration report
              <ArrowRight size={15} className="ml-2" />
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.08 }} className="flex items-center justify-between gap-4">
            <div>
              <p className="surface-label">Workspace projects</p>
              <h2 className="pt-2 text-2xl font-semibold text-neutral-100 light-mode:text-slate-950">Your active spaces</h2>
            </div>
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} onClick={() => setModalOpen(true)} className="ghost-button rounded-full px-4">
              <GitBranchPlus size={16} className="mr-2" />
              Add workspace
            </motion.button>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-2">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => <LoadingSkeleton key={index} className="h-56 rounded-[28px]" />)
              : projects.length > 0
                ? projects.map((project) => (
                    <ProjectCard key={project._id} project={project} onOpen={() => navigate(`/projects/${project._id}`)} />
                  ))
                : (
                    <motion.div {...riseIn} className="card col-span-2 flex flex-col items-center justify-center p-12 text-center">
                      <div className="floating-orb flex h-14 w-14 items-center justify-center rounded-[20px] bg-white/[0.05] light-mode:bg-accent-50">
                        <BriefcaseBusiness size={26} className="text-accent-300 light-mode:text-accent-600" />
                      </div>
                      <h3 className="pt-5 text-xl font-semibold text-neutral-100 light-mode:text-slate-950">No projects yet</h3>
                      <p className="max-w-md pt-2 text-sm leading-6 text-neutral-500 light-mode:text-slate-500">
                        Create your first project to start managing pull requests, file discussions, and review ownership in one place.
                      </p>
                      <button onClick={() => setModalOpen(true)} className="pill-button mt-6 rounded-full px-5 py-3">
                        <Plus size={16} className="mr-2" />
                        Create project
                      </button>
                    </motion.div>
                  )}
          </motion.div>
        </div>

        <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.12 }} className="space-y-5">
          <div className="card p-5">
            <p className="surface-label">Recent activity</p>
            <h2 className="pt-2 text-xl font-semibold text-neutral-100 light-mode:text-slate-950">Live review feed</h2>
            <p className="pt-2 text-sm leading-6 text-neutral-500 light-mode:text-slate-500">A lightweight stream of the latest project and pull request updates.</p>
          </div>
          <Timeline events={recentActivity} />
        </motion.div>
      </section>

      <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateProject} />
    </div>
  );
};
