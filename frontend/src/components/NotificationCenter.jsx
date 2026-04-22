import { AnimatePresence, motion } from "framer-motion";

export const NotificationCenter = ({ notifications }) => (
  <div className="fixed right-4 top-20 z-40 space-y-3">
    <AnimatePresence>
      {notifications.slice(0, 4).map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="glass-panel w-80 rounded-3xl p-4"
        >
          <p className="text-sm font-medium text-white">{notification.title}</p>
          <p className="mt-1 text-sm text-slate-300">{notification.body}</p>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);
