import { Comment } from "../models/Comment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIo } from "../services/socketRegistry.js";

export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ pullRequest: req.params.pullRequestId })
    .populate("author", "name email avatar")
    .sort({ createdAt: 1 });

  res.json({ comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create({
    ...req.body,
    project: req.params.projectId,
    pullRequest: req.params.pullRequestId,
    author: req.user._id
  });

  const populatedComment = await comment.populate("author", "name email avatar");
  getIo()?.to(`pullRequest:${req.params.pullRequestId}`).emit("comment:created", populatedComment);
  res.status(201).json({ comment: populatedComment });
});

export const toggleResolved = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId).populate("author", "name email avatar");
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  comment.resolved = !comment.resolved;
  await comment.save();
  getIo()?.to(`pullRequest:${req.params.pullRequestId}`).emit("comment:updated", comment);
  res.json({ comment });
});

export const toggleReaction = asyncHandler(async (req, res) => {
  const { emoji } = req.body;
  const comment = await Comment.findById(req.params.commentId).populate("author", "name email avatar");

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const reaction = comment.reactions.find((entry) => entry.emoji === emoji);
  const userId = req.user._id.toString();

  if (!reaction) {
    comment.reactions.push({ emoji, users: [req.user._id] });
  } else if (reaction.users.some((id) => id.toString() === userId)) {
    reaction.users = reaction.users.filter((id) => id.toString() !== userId);
  } else {
    reaction.users.push(req.user._id);
  }

  comment.reactions = comment.reactions.filter((entry) => entry.users.length > 0);
  await comment.save();
  getIo()?.to(`pullRequest:${req.params.pullRequestId}`).emit("comment:updated", comment);

  res.json({ comment });
});
