import fs from "fs";
import { Project } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIo } from "../services/socketRegistry.js";

const ensureAccess = (project, userId) => {
  const isOwner = project.owner.toString() === userId.toString();
  const isMember = project.members.some((member) => member.toString() === userId.toString());
  return isOwner || isMember;
};

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }]
  })
    .populate("owner", "name email avatar")
    .sort({ updatedAt: -1 });

  res.json({ projects });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    owner: req.user._id,
    members: [req.user._id],
    files: [
      {
        name: "README.md",
        path: "README.md",
        type: "file",
        language: "markdown",
        content: `# ${req.body.name}\n\nKick off your first review cycle here.`
      },
      {
        name: "src/index.js",
        path: "src/index.js",
        type: "file",
        language: "javascript",
        content: "export const bootstrap = () => console.log('CodeFlow ready');"
      }
    ],
    activity: [{ type: "project_created", actor: req.user._id, summary: "Project created" }]
  });

  res.status(201).json({ project });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId)
    .populate("owner", "name email avatar")
    .populate("members", "name email avatar");

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!ensureAccess(project, req.user._id)) {
    res.status(403);
    throw new Error("Access denied");
  }

  res.json({ project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the owner can update the project");
  }

  Object.assign(project, req.body);
  project.activity.unshift({
    type: "project_updated",
    actor: req.user._id,
    summary: "Project details updated"
  });
  await project.save();

  res.json({ project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the owner can delete the project");
  }

  await project.deleteOne();
  res.json({ message: "Project deleted" });
});

export const saveFile = asyncHandler(async (req, res) => {
  const { name, path, type, content, language } = req.body;
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const existingFile = project.files.find((file) => file.path === path);

  if (existingFile) {
    existingFile.name = name;
    existingFile.type = type;
    existingFile.content = content ?? existingFile.content;
    existingFile.language = language ?? existingFile.language;
  } else {
    project.files.push({ name, path, type, content, language });
  }

  project.activity.unshift({
    type: "file_saved",
    actor: req.user._id,
    summary: `Updated ${path}`
  });
  await project.save();

  getIo()?.to(`project:${project._id}`).emit("project:fileSaved", {
    projectId: project._id,
    path
  });

  res.json({ files: project.files });
});

export const uploadFile = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const content = fs.readFileSync(req.file.path, "utf-8");
  const relativePath = req.body.path || req.file.originalname;
  project.files.push({
    name: req.file.originalname,
    path: relativePath,
    type: "file",
    content,
    language: req.body.language || "plaintext"
  });
  project.activity.unshift({
    type: "file_uploaded",
    actor: req.user._id,
    summary: `Uploaded ${relativePath}`
  });

  await project.save();
  res.status(201).json({ files: project.files });
});
