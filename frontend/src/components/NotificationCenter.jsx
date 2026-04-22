import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const NotificationCenter = ({ notifications }) => (
  <div className="pointer-events-none fixed right-4 top-24 z-40 space-y-3 md:right-6">
    <AnimatePresence>
      {notifications.slice(0, 3).map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, x: 80, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.92 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="card pointer-events-auto w-[340px] rounded-[24px] p-4"
        >
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/12 light-mode:bg-emerald-100">
              <CheckCircle2 size={18} className="text-emerald-300 light-mode:text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-100 light-mode:text-slate-950">{notification.title}</p>
              <p className="mt-1 text-sm leading-6 text-neutral-400 light-mode:text-slate-600">{notification.body}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);
