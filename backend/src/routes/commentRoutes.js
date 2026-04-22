import express from "express";
import {
  createComment,
  getComments,
  toggleReaction,
  toggleResolved
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router({ mergeParams: true });

router.use(protect);
router.route("/").get(getComments).post(createComment);
router.patch("/:commentId/resolved", validateObjectId("commentId"), toggleResolved);
router.patch("/:commentId/reactions", validateObjectId("commentId"), toggleReaction);

export default router;
