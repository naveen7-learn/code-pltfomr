import { PullRequest } from "../models/PullRequest.js";
import { Project } from "../models/Project.js";
import { Review } from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUserProjectIds = async (userId) => {
  const projects = await Project.find({
    $or: [{ owner: userId }, { members: userId }]
  }).select("_id");
  return projects.map((p) => p._id);
};

export const getGlobalPullRequests = asyncHandler(async (req, res) => {
  const projectIds = await getUserProjectIds(req.user._id);

  const pullRequests = await PullRequest.find({
    project: { $in: projectIds }
  })
    .populate("author", "name email avatar")
    .populate("project", "name")
    .sort({ updatedAt: -1 })
    .limit(50);

  res.json({ pullRequests });
});

export const getGlobalReviews = asyncHandler(async (req, res) => {
  const projectIds = await getUserProjectIds(req.user._id);

  // PRs where the user is explicitly requested as a reviewer AND status is open or changes_requested
  const pullRequests = await PullRequest.find({
    project: { $in: projectIds },
    reviewers: req.user._id,
    status: { $in: ["open", "changes_requested"] }
  })
    .populate("author", "name email avatar")
    .populate("project", "name")
    .sort({ updatedAt: -1 })
    .limit(50);

  res.json({ pullRequests });
});

export const getInsights = asyncHandler(async (req, res) => {
  const projectIds = await getUserProjectIds(req.user._id);

  const [totalPrs, openPrs, mergedPrs, totalReviews] = await Promise.all([
    PullRequest.countDocuments({ project: { $in: projectIds } }),
    PullRequest.countDocuments({ project: { $in: projectIds }, status: "open" }),
    PullRequest.countDocuments({ project: { $in: projectIds }, status: "merged" }),
    Review.countDocuments({ project: { $in: projectIds } })
  ]);

  const approvalRate = totalPrs > 0 ? Math.round((mergedPrs / totalPrs) * 100) : 0;

  res.json({
    insights: {
      totalPrs,
      openPrs,
      mergedPrs,
      totalReviews,
      approvalRate
    }
  });
});
