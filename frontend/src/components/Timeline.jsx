import { motion } from "framer-motion";

export const Timeline = ({ events }) => (
  <div className="glass-panel rounded-[28px] p-4">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Activity</h3>
      <span className="text-xs text-slate-500">Animated timeline</span>
    </div>
    <div className="space-y-3">
      {events.map((event, index) => (
        <motion.div
          key={`${event._id || event.label}-${index}`}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3"
        >
          <div className="mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300" />
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-sm text-white">{event.summary || event.label}</p>
            <p className="mt-1 text-xs text-slate-500">{new Date(event.createdAt).toLocaleString()}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
