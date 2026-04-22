import express from "express";
import {
  createPullRequest,
  getPullRequestById,
  getPullRequests,
  submitReview,
  updatePullRequestStatus
} from "../controllers/pullRequestController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router({ mergeParams: true });

router.use(protect);
router.route("/").get(getPullRequests).post(createPullRequest);
router.get("/:pullRequestId", validateObjectId("pullRequestId"), getPullRequestById);
router.patch("/:pullRequestId/status", validateObjectId("pullRequestId"), updatePullRequestStatus);
router.post("/:pullRequestId/reviews", validateObjectId("pullRequestId"), submitReview);

export default router;
