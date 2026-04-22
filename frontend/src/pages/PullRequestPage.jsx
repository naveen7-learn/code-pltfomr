import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCheck, MessageSquarePlus, XCircle } from "lucide-react";
import { fetchPullRequest, submitReview, updatePullRequestStatus } from "../services/pullRequestService";
import { createComment, fetchComments, toggleCommentReaction, toggleCommentResolved } from "../services/commentService";
import { DiffViewer } from "../components/DiffViewer";
import { CommentThread } from "../components/CommentThread";
import { Timeline } from "../components/Timeline";
import { useSocket } from "../hooks/useSocket";
import { listItemIn, riseIn, staggerContainer } from "../animations/pageTransitions";

export const PullRequestPage = ({ onNotify, authUser }) => {
  const { projectId, pullRequestId } = useParams();
  const socket = useSocket(true);
  const [pullRequest, setPullRequest] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const load = useCallback(async () => {
    const [{ pullRequest: pr, reviews: reviewList }, commentList] = await Promise.all([
      fetchPullRequest(projectId, pullRequestId),
      fetchComments(projectId, pullRequestId)
    ]);
    setPullRequest(pr);
    setReviews(reviewList);
    setComments(commentList);
  }, [projectId, pullRequestId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    socket?.emit("pullRequest:join", pullRequestId);
  }, [pullRequestId, socket]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const onCommentCreated = (comment) => {
      setComments((current) => [...current, comment]);
      onNotify({
        id: crypto.randomUUID(),
        title: "New review comment",
        body: `${comment.author?.name} commented on ${comment.filePath}:${comment.lineNumber}.`
      });
    };

    const onCommentUpdated = (comment) => {
      setComments((current) => current.map((entry) => (entry._id === comment._id ? comment : entry)));
    };

    const onReviewSubmitted = (review) => {
      setReviews((current) => [...current, review]);
    };

    const onPullRequestUpdated = (updated) => setPullRequest(updated);

    const onTyping = ({ user, isTyping }) => {
      setTypingUsers((current) => {
        if (isTyping) {
          return current.includes(user.name) ? current : [...current, user.name];
        }
        return current.filter((name) => name !== user.name);
      });
    };

    socket.on("comment:created", onCommentCreated);
    socket.on("comment:updated", onCommentUpdated);
    socket.on("review:submitted", onReviewSubmitted);
    socket.on("pullRequest:updated", onPullRequestUpdated);
    socket.on("typing:update", onTyping);

    return () => {
      socket.off("comment:created", onCommentCreated);
      socket.off("comment:updated", onCommentUpdated);
      socket.off("review:submitted", onReviewSubmitted);
      socket.off("pullRequest:updated", onPullRequestUpdated);
      socket.off("typing:update", onTyping);
    };
  }, [onNotify, socket]);

  const statusTone = useMemo(() => {
    switch (pullRequest?.status) {
      case "approved":
        return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300 light-mode:text-emerald-700";
      case "changes_requested":
        return "border-rose-400/20 bg-rose-500/10 text-rose-300 light-mode:text-rose-700";
      default:
        return "border-accent-400/20 bg-accent-500/10 text-accent-200 light-mode:text-accent-700";
    }
  }, [pullRequest?.status]);

  const handleLineComment = async (lineNumber) => {
    const changedFile = pullRequest?.changedFiles?.[0];
    if (!changedFile) {
      return;
    }

    socket?.emit("typing:start", { pullRequestId, user: authUser });
    const comment = await createComment(projectId, pullRequestId, {
      filePath: changedFile.path,
      lineNumber,
      body: `Review feedback for line ${lineNumber}.`,
      parentComment: null
    });
    setComments((current) => [...current, comment]);
    socket?.emit("typing:stop", { pullRequestId, user: authUser });
  };

  const handleReview = async (status) => {
    const review = await submitReview(projectId, pullRequestId, {
      status,
      summary: status === "approved" ? "Looks ready to merge." : "Please address the requested changes."
    });
    setReviews((current) => [...current, review]);
    const updated = await updatePullRequestStatus(projectId, pullRequestId, status);
    setPullRequest(updated);
  };

  if (!pullRequest) {
    return <div className="card rounded-[28px] p-8 text-neutral-300 light-mode:text-slate-700">Loading pull request...</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div {...riseIn} className="card p-6 md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="eyebrow">Pull request</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.04em] text-neutral-100 light-mode:text-slate-950">{pullRequest.title}</h1>
            <p className="mt-3 max-w-3xl text-neutral-400 light-mode:text-slate-600">{pullRequest.description}</p>
          </div>
          <motion.div whileHover={{ y: -1 }} className={`rounded-full border px-4 py-3 text-sm capitalize ${statusTone}`}>
            {pullRequest.status.replace("_", " ")}
          </motion.div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.96 }} onClick={() => handleReview("approved")} className="pill-button rounded-2xl px-4 py-3 text-sm">
            <CheckCheck size={16} className="mr-2 inline" />
            Approve
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleReview("changes_requested")}
            className="inline-flex items-center rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200 light-mode:text-rose-700"
          >
            <XCircle size={16} className="mr-2 inline" />
            Request changes
          </motion.button>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }} onClick={() => handleLineComment(1)} className="ghost-button rounded-2xl px-4 py-3 text-sm">
            <MessageSquarePlus size={16} className="mr-2 inline" />
            Add comment
          </motion.button>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.06 }} className="space-y-6">
          {(pullRequest.changedFiles || []).map((file, index) => (
            <motion.div key={file.path} {...listItemIn} transition={{ ...listItemIn.transition, delay: 0.04 * index }}>
              <DiffViewer file={file} onLineComment={handleLineComment} />
            </motion.div>
          ))}
          <Timeline events={pullRequest.timeline || []} />
        </motion.div>

        <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.1 }} className="space-y-6">
          <CommentThread
            comments={comments}
            typingUsers={typingUsers}
            onResolve={async (comment) => {
              const updated = await toggleCommentResolved(projectId, pullRequestId, comment._id);
              setComments((current) => current.map((entry) => (entry._id === updated._id ? updated : entry)));
            }}
            onReact={async (comment, emoji) => {
              const updated = await toggleCommentReaction(projectId, pullRequestId, comment._id, emoji);
              setComments((current) => current.map((entry) => (entry._id === updated._id ? updated : entry)));
            }}
          />

          <div className="card p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="surface-label">Review decisions</h3>
              <span className="text-xs text-neutral-500 light-mode:text-slate-500">{reviews.length} reviews</span>
            </div>
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    {...listItemIn}
                    transition={{ ...listItemIn.transition, delay: 0.04 * index + 0.04 }}
                    whileHover={{ y: -2 }}
                    className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 light-mode:border-slate-300/70 light-mode:bg-white/78"
                  >
                    <p className="font-medium text-neutral-100 light-mode:text-slate-950">{review.reviewer?.name}</p>
                    <p className="mt-1 text-sm capitalize text-neutral-300 light-mode:text-slate-700">{review.status.replace("_", " ")}</p>
                    <p className="mt-2 text-sm text-neutral-500 light-mode:text-slate-500">{review.summary}</p>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-white/10 px-4 py-10 text-center light-mode:border-slate-300/80">
                  <p className="text-sm text-neutral-500 light-mode:text-slate-500">No review decisions yet</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
