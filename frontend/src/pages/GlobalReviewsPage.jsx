import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, AlertCircle } from "lucide-react";
import { fetchGlobalReviews } from "../services/userService";
import { listItemIn, riseIn, staggerContainer } from "../animations/pageTransitions";

export const GlobalReviewsPage = ({ onSearchIndex }) => {
  const navigate = useNavigate();
  const [pullRequests, setPullRequests] = useState(null);

  useEffect(() => {
    fetchGlobalReviews().then((data) => {
      setPullRequests(data);
      onSearchIndex(
        data.map((pr) => ({
          id: `review-${pr._id}`,
          type: "review",
          label: `Review ${pr.title}`,
          to: `/projects/${pr.project._id}/pull-requests/${pr._id}`
        }))
      );
    });
  }, [onSearchIndex]);

  if (!pullRequests) {
    return <div className="card rounded-[28px] p-8 text-neutral-300 light-mode:text-slate-700">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div {...riseIn} className="card p-6 md:p-7">
        <p className="eyebrow">Needs attention</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-neutral-100 light-mode:text-slate-950">Pending Reviews</h1>
        <p className="mt-3 max-w-2xl text-neutral-400 light-mode:text-slate-600">Pull requests where your review has been requested.</p>
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
              className="flex w-full items-center justify-between rounded-[22px] border border-rose-400/20 bg-rose-500/5 p-5 text-left light-mode:bg-rose-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 light-mode:bg-rose-200">
                  <AlertCircle className="text-rose-400 light-mode:text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-100 light-mode:text-slate-950">{pr.title}</h3>
                  <p className="mt-1 text-sm text-neutral-400 light-mode:text-slate-600">
                    in <span className="font-medium text-neutral-300 light-mode:text-slate-700">{pr.project?.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300 light-mode:text-rose-700">
                  Review Requested
                </span>
                <span className="text-xs text-neutral-500">by {pr.author?.name}</span>
              </div>
            </motion.button>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/10 px-6 py-16 text-center light-mode:border-slate-300/80">
            <ClipboardList className="mx-auto h-12 w-12 text-neutral-600/50 light-mode:text-slate-400/50" />
            <h3 className="mt-4 text-lg font-medium text-neutral-200 light-mode:text-slate-800">You're all caught up!</h3>
            <p className="mt-2 text-sm text-neutral-500 light-mode:text-slate-500">No pending reviews require your attention right now.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
