import { PullRequest } from "../models/PullRequest.js";
import { Review } from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIo } from "../services/socketRegistry.js";

const populateQuery = [
  { path: "author", select: "name email avatar" },
  { path: "reviewers", select: "name email avatar" },
  { path: "approvals", select: "name email avatar" }
];

export const getPullRequests = asyncHandler(async (req, res) => {
  const pullRequests = await PullRequest.find({ project: req.params.projectId })
    .populate(populateQuery)
    .sort({ updatedAt: -1 });

  res.json({ pullRequests });
});

export const createPullRequest = asyncHandler(async (req, res) => {
  const pullRequest = await PullRequest.create({
    ...req.body,
    project: req.params.projectId,
    author: req.user._id,
    timeline: [{ type: "opened", actor: req.user._id, label: "Pull request opened" }]
  });

  const populated = await pullRequest.populate(populateQuery);
  getIo()?.to(`project:${req.params.projectId}`).emit("pullRequest:created", populated);

  res.status(201).json({ pullRequest: populated });
});

export const getPullRequestById = asyncHandler(async (req, res) => {
  const pullRequest = await PullRequest.findById(req.params.pullRequestId).populate(populateQuery);

  if (!pullRequest) {
    res.status(404);
    throw new Error("Pull request not found");
  }

  const reviews = await Review.find({ pullRequest: pullRequest._id }).populate(
    "reviewer",
    "name email avatar"
  );

  res.json({ pullRequest, reviews });
});

export const updatePullRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const pullRequest = await PullRequest.findById(req.params.pullRequestId);

  if (!pullRequest) {
    res.status(404);
    throw new Error("Pull request not found");
  }

  pullRequest.status = status;
  pullRequest.timeline.unshift({
    type: status,
    actor: req.user._id,
    label: `Status changed to ${status.replace("_", " ")}`
  });

  if (
    status === "approved" &&
    !pullRequest.approvals.some((id) => id.toString() === req.user._id.toString())
  ) {
    pullRequest.approvals.push(req.user._id);
  }

  await pullRequest.save();
  const populated = await pullRequest.populate(populateQuery);
  getIo()?.to(`pullRequest:${pullRequest._id}`).emit("pullRequest:updated", populated);

  res.json({ pullRequest: populated });
});

export const submitReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    ...req.body,
    pullRequest: req.params.pullRequestId,
    project: req.params.projectId,
    reviewer: req.user._id
  });

  const pullRequest = await PullRequest.findById(req.params.pullRequestId);
  pullRequest.status = req.body.status;
  pullRequest.timeline.unshift({
    type: "review",
    actor: req.user._id,
    label: `Review submitted: ${req.body.status.replace("_", " ")}`
  });
  if (
    req.body.status === "approved" &&
    !pullRequest.approvals.some((id) => id.toString() === req.user._id.toString())
  ) {
    pullRequest.approvals.push(req.user._id);
  }
  await pullRequest.save();

  const populatedReview = await review.populate("reviewer", "name email avatar");
  getIo()?.to(`pullRequest:${req.params.pullRequestId}`).emit("review:submitted", populatedReview);

  res.status(201).json({ review: populatedReview });
});
