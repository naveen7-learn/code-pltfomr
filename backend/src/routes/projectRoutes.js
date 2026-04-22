import express from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  saveFile,
  updateProject,
  uploadFile
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getProjects).post(createProject);
router
  .route("/:projectId")
  .get(validateObjectId("projectId"), getProjectById)
  .put(validateObjectId("projectId"), updateProject)
  .delete(validateObjectId("projectId"), deleteProject);

router.post("/:projectId/files", validateObjectId("projectId"), saveFile);
router.post("/:projectId/upload", validateObjectId("projectId"), upload.single("file"), uploadFile);

export default router;
