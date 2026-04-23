import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, GitPullRequest, CheckCircle2, MessageSquare } from "lucide-react";
import { fetchInsights } from "../services/userService";
import { riseIn, staggerContainer, listItemIn } from "../animations/pageTransitions";

export const InsightsPage = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchInsights().then(setInsights);
  }, []);

  if (!insights) {
    return <div className="card rounded-[28px] p-8 text-neutral-300 light-mode:text-slate-700">Loading insights...</div>;
  }

  const stats = [
    { label: "Total Pull Requests", value: insights.totalPrs, icon: GitPullRequest, color: "text-accent-400", bg: "bg-accent-500/10" },
    { label: "Open Pull Requests", value: insights.openPrs, icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Merged", value: insights.mergedPrs, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Total Reviews", value: insights.totalReviews, icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      <motion.div {...riseIn} className="card p-6 md:p-7">
        <p className="eyebrow">Analytics</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-neutral-100 light-mode:text-slate-950">Workspace Insights</h1>
        <p className="mt-3 max-w-2xl text-neutral-400 light-mode:text-slate-600">High-level metrics across all your projects to track collaboration health.</p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} {...listItemIn} transition={{ ...listItemIn.transition, delay: 0.04 * index }} className="card p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}>
                  <Icon className={stat.color} size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 light-mode:text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-100 light-mode:text-slate-950">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div {...riseIn} transition={{ delay: 0.2 }} className="card p-6 md:p-7">
        <h2 className="text-xl font-semibold text-neutral-100 light-mode:text-slate-950">Approval Rate</h2>
        <div className="mt-6 flex items-center gap-6">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/[0.03] light-mode:bg-slate-100">
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle className="stroke-white/5 light-mode:stroke-slate-200" cx="50" cy="50" r="40" fill="transparent" strokeWidth="8" />
              <circle
                className="stroke-emerald-400 transition-all duration-1000 ease-out"
                cx="50" cy="50" r="40" fill="transparent" strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * insights.approvalRate) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl font-bold text-neutral-100 light-mode:text-slate-950">{insights.approvalRate}%</span>
          </div>
          <div>
            <p className="text-neutral-400 light-mode:text-slate-600">
              Your teams are merging <strong className="text-neutral-200 light-mode:text-slate-800">{insights.approvalRate}%</strong> of all pull requests opened across active projects.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
