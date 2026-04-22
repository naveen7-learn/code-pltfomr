import { motion } from "framer-motion";

export const Timeline = ({ events }) => (
  <div className="card space-y-4 rounded-[28px] p-5">
    <h3 className="text-sm font-semibold text-neutral-100 light-mode:text-slate-950">Recent activity</h3>

    {events.length > 0 ? (
      <div className="space-y-3">
        {events.map((event, index) => (
          <motion.div
            key={`${event._id || event.label}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3 rounded-[22px] border border-white/6 bg-white/[0.03] p-4 light-mode:border-slate-300/70 light-mode:bg-white/78"
          >
            <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent-400 shadow-[0_0_20px_rgba(92,124,255,0.55)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-neutral-300 light-mode:text-slate-800">{event.summary || event.label}</p>
              <p className="mt-1 text-xs text-neutral-500 light-mode:text-slate-500">{new Date(event.createdAt).toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="rounded-[22px] border border-dashed border-white/10 px-4 py-10 text-center light-mode:border-slate-300/80">
        <p className="text-sm text-neutral-500 light-mode:text-slate-500">No activity yet</p>
      </div>
    )}
  </div>
);
