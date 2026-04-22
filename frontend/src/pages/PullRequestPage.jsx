import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCheck, MessageSquarePlus, XCircle } from "lucide-react";
import {
  fetchPullRequest,
  submitReview,
  updatePullRequestStatus
} from "../services/pullRequestService";
import {
  createComment,
  fetchComments,
  toggleCommentReaction,
  toggleCommentResolved
} from "../services/commentService";
import { DiffViewer } from "../components/DiffViewer";
import { CommentThread } from "../components/CommentThread";
import { Timeline } from "../components/Timeline";
import { useSocket } from "../hooks/useSocket";

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
        return "bg-emerald-400/15 text-emerald-200";
      case "changes_requested":
        return "bg-rose-400/15 text-rose-200";
      default:
        return "bg-cyan-400/15 text-cyan-200";
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
    return <div className="glass-panel rounded-[28px] p-8 text-slate-300">Loading pull request...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[32px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">Pull request</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{pullRequest.title}</h1>
            <p className="mt-3 max-w-3xl text-slate-300">{pullRequest.description}</p>
          </div>
          <div className={`rounded-full px-4 py-3 text-sm capitalize ${statusTone}`}>
            {pullRequest.status.replace("_", " ")}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleReview("approved")}
            className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-medium text-slate-950"
          >
            <CheckCheck size={16} className="mr-2 inline" />
            Approve
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleReview("changes_requested")}
            className="rounded-2xl bg-rose-400 px-4 py-3 text-sm font-medium text-slate-950"
          >
            <XCircle size={16} className="mr-2 inline" />
            Request changes
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleLineComment(1)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
          >
            <MessageSquarePlus size={16} className="mr-2 inline" />
            Add comment
          </motion.button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="space-y-6">
          {(pullRequest.changedFiles || []).map((file) => (
            <DiffViewer key={file.path} file={file} onLineComment={handleLineComment} />
          ))}
          <Timeline events={pullRequest.timeline || []} />
        </div>

        <div className="space-y-6">
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

          <div className="glass-panel rounded-[28px] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Review decisions</h3>
              <span className="text-xs text-slate-500">{reviews.length} reviews</span>
            </div>
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-medium text-white">{review.reviewer?.name}</p>
                  <p className="mt-1 text-sm capitalize text-slate-300">{review.status.replace("_", " ")}</p>
                  <p className="mt-2 text-sm text-slate-400">{review.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
