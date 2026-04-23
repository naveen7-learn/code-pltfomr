import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitPullRequest, GitMerge } from "lucide-react";
import { fetchGlobalPullRequests } from "../services/userService";
import { listItemIn, riseIn, staggerContainer } from "../animations/pageTransitions";

export const GlobalPullRequestsPage = ({ onSearchIndex }) => {
  const navigate = useNavigate();
  const [pullRequests, setPullRequests] = useState(null);

  useEffect(() => {
    fetchGlobalPullRequests().then((data) => {
      setPullRequests(data);
      onSearchIndex(
        data.map((pr) => ({
          id: pr._id,
          type: "pr",
          label: pr.title,
          to: `/projects/${pr.project._id}/pull-requests/${pr._id}`
        }))
      );
    });
  }, [onSearchIndex]);

  if (!pullRequests) {
    return <div className="card rounded-[28px] p-8 text-neutral-300 light-mode:text-slate-700">Loading pull requests...</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div {...riseIn} className="card p-6 md:p-7">
        <p className="eyebrow">Workspace wide</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-neutral-100 light-mode:text-slate-950">Active Pull Requests</h1>
        <p className="mt-3 max-w-2xl text-neutral-400 light-mode:text-slate-600">Track all ongoing code reviews across the projects you are part of.</p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
        {pullRequests.length > 0 ? (
          pullRequests.map((pr, index) => (
            <motion.button
              key={pr._id}
              {...listItemIn}
              transition={{ ...listItemIn.transition, delay: 0.04 * index }}
              whileHover={{ y: -2, scale: 1.002 }}
              onClick={() => navigate(`/projects/${pr.project._id}/pull-requests/${pr._id}`)}
              className="flex w-full items-center justify-between rounded-[22px] border border-white/8 bg-white/[0.03] p-5 text-left light-mode:border-slate-300/70 light-mode:bg-white/78"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] light-mode:bg-slate-100">
                  {pr.status === "merged" ? <GitMerge className="text-emerald-400" /> : <GitPullRequest className="text-accent-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-100 light-mode:text-slate-950">{pr.title}</h3>
                  <p className="mt-1 text-sm text-neutral-400 light-mode:text-slate-600">
                    in <span className="font-medium text-neutral-300 light-mode:text-slate-700">{pr.project?.name}</span> by {pr.author?.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs capitalize ${
                  pr.status === "approved" ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300" :
                  pr.status === "changes_requested" ? "border-rose-400/20 bg-rose-500/10 text-rose-300" :
                  pr.status === "merged" ? "border-purple-400/20 bg-purple-500/10 text-purple-300" :
                  "border-accent-400/20 bg-accent-500/10 text-accent-300"
                }`}>
                  {pr.status.replace("_", " ")}
                </span>
                <span className="text-xs text-neutral-500">{new Date(pr.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.button>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/10 px-6 py-16 text-center light-mode:border-slate-300/80">
            <GitPullRequest className="mx-auto h-12 w-12 text-neutral-600/50 light-mode:text-slate-400/50" />
            <h3 className="mt-4 text-lg font-medium text-neutral-200 light-mode:text-slate-800">No active pull requests</h3>
            <p className="mt-2 text-sm text-neutral-500 light-mode:text-slate-500">When pull requests are opened in your projects, they will appear here.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
