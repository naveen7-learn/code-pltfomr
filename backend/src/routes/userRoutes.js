import express from "express";
import { getGlobalPullRequests, getGlobalReviews, getInsights } from "../controllers/userDashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/pull-requests", getGlobalPullRequests);
router.get("/reviews", getGlobalReviews);
router.get("/insights", getInsights);

export default router;
