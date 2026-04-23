import { motion, AnimatePresence } from "framer-motion";
import { Users, X, Code2 } from "lucide-react";

export const CollabInviteModal = ({ isOpen, inviterName, onAccept, onDecline }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDecline}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-500/20 blur-[80px] rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-accent-500/10 flex items-center justify-center border border-accent-500/20 mb-6">
                <Users className="w-10 h-10 text-accent-400" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">Live Collab Request</h2>
              <p className="text-neutral-400 mb-8">
                <span className="text-accent-400 font-bold">{inviterName}</span> wants to start a multiplayer coding session with you.
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={onAccept}
                  className="w-full bg-accent-500 hover:bg-accent-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-accent-500/20 active:scale-95"
                >
                  Accept & Join
                </button>
                <button
                  onClick={onDecline}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-4 rounded-2xl transition-all border border-white/5"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};