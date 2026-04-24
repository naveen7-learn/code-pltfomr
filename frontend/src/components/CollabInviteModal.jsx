import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, X, Check, Users, Zap } from "lucide-react";

export const CollabInviteModal = ({ isOpen, inviterName, onAccept, onDecline }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        /* The Overlay - Darkens and blurs the entire screen */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          {/* The Modal Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            
            <div className="p-10 text-center">
              {/* Animated Avatar/Icon Area */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Users className="w-12 h-12 text-cyan-400" />
                  </div>
                  {/* Pulsing indicator */}
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full border-[3px] border-[#0a0a0a]"
                  />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Collaboration Call</h2>
              <p className="text-neutral-400 text-lg leading-relaxed mb-10">
                <span className="text-cyan-400 font-bold">@{inviterName}</span> is inviting you to a live multiplayer workspace. 
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onAccept}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-cyan-500 text-black font-bold text-lg hover:bg-cyan-400 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  <Check size={20} strokeWidth={3} />
                  Accept & Join
                </button>
                
                <button
                  onClick={onDecline}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 text-neutral-400 font-semibold hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
                >
                  <X size={20} />
                  Decline
                </button>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="px-10 py-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-black">
                <Zap size={12} className="text-cyan-500/50" />
                Real-Time Sync Active
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};