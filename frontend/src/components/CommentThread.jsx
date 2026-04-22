import { motion } from "framer-motion";
import { CheckCircle2, MessageSquareReply, SmilePlus } from "lucide-react";

const emojis = ["👍", "🔥", "💡", "🚀"];

export const CommentThread = ({ comments, typingUsers, onResolve, onReact }) => (
  <div className="card rounded-[28px] p-4">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="surface-label">Review threads</h3>
      <span className="text-xs text-neutral-500 light-mode:text-slate-500">{comments.length} comments</span>
    </div>

    <div className="space-y-3">
      {comments.map((comment) => (
        <motion.div
          key={comment._id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 light-mode:border-slate-300/70 light-mode:bg-white/78"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-neutral-100 light-mode:text-slate-950">{comment.author?.name}</p>
              <p className="text-xs text-neutral-500 light-mode:text-slate-500">
                {comment.filePath}:{comment.lineNumber}
              </p>
            </div>
            <button
              onClick={() => onResolve(comment)}
              className={`rounded-full px-3 py-2 text-xs ${
                comment.resolved
                  ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300 light-mode:text-emerald-700"
                  : "border border-white/8 bg-white/[0.03] text-neutral-300 light-mode:border-slate-300/70 light-mode:bg-white/80 light-mode:text-slate-700"
              }`}
            >
              <CheckCircle2 size={14} className="mr-1 inline" />
              {comment.resolved ? "Resolved" : "Resolve"}
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-neutral-200 light-mode:text-slate-700">{comment.body}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {emojis.map((emoji) => {
              const reaction = comment.reactions?.find((entry) => entry.emoji === emoji);
              return (
                <button
                  key={emoji}
                  onClick={() => onReact(comment, emoji)}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-200 light-mode:border-slate-300/70 light-mode:bg-white/78 light-mode:text-slate-700"
                >
                  {emoji} {reaction?.users?.length || 0}
                </button>
              );
            })}
            <span className="ml-auto flex items-center gap-2 text-xs text-neutral-500 light-mode:text-slate-500">
              <SmilePlus size={14} />
              Inline review
            </span>
          </div>
        </motion.div>
      ))}
    </div>

    {typingUsers.length > 0 && (
      <div className="mt-4 flex items-center gap-2 text-sm text-accent-200 light-mode:text-accent-700">
        <MessageSquareReply size={16} />
        {typingUsers.join(", ")} typing...
      </div>
    )}
  </div>
);
