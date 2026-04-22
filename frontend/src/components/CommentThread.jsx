import { motion } from "framer-motion";
import { CheckCircle2, MessageSquareReply, SmilePlus } from "lucide-react";

const emojis = ["👍", "🔥", "💡", "🚀"];

export const CommentThread = ({ comments, typingUsers, onResolve, onReact }) => (
  <div className="glass-panel rounded-[28px] p-4">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Review Threads</h3>
      <span className="text-xs text-slate-500">{comments.length} comments</span>
    </div>

    <div className="space-y-3">
      {comments.map((comment) => (
        <motion.div
          key={comment._id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-white">{comment.author?.name}</p>
              <p className="text-xs text-slate-500">
                {comment.filePath}:{comment.lineNumber}
              </p>
            </div>
            <button
              onClick={() => onResolve(comment)}
              className={`rounded-full px-3 py-2 text-xs ${
                comment.resolved ? "bg-emerald-400/15 text-emerald-200" : "bg-white/5 text-slate-300"
              }`}
            >
              <CheckCircle2 size={14} className="mr-1 inline" />
              {comment.resolved ? "Resolved" : "Resolve"}
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-200">{comment.body}</p>
          <div className="mt-4 flex items-center gap-2">
            {emojis.map((emoji) => {
              const reaction = comment.reactions?.find((entry) => entry.emoji === emoji);
              return (
                <button
                  key={emoji}
                  onClick={() => onReact(comment, emoji)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200"
                >
                  {emoji} {reaction?.users?.length || 0}
                </button>
              );
            })}
            <span className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <SmilePlus size={14} />
              Inline review
            </span>
          </div>
        </motion.div>
      ))}
    </div>

    {typingUsers.length > 0 && (
      <div className="mt-4 flex items-center gap-2 text-sm text-cyan-200">
        <MessageSquareReply size={16} />
        {typingUsers.join(", ")} typing...
      </div>
    )}
  </div>
);
