import mongoose from "mongoose";

const changedFileSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    before: { type: String, default: "" },
    after: { type: String, default: "" }
  },
  { _id: false }
);

const timelineSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, required: true }
  },
  { timestamps: true }
);

const pullRequestSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    sourceBranch: { type: String, default: "feature/main" },
    targetBranch: { type: String, default: "main" },
    status: { type: String, enum: ["open", "approved", "changes_requested", "merged"], default: "open" },
    changedFiles: [changedFileSchema],
    reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    approvals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    timeline: [timelineSchema]
  },
  { timestamps: true }
);

export const PullRequest = mongoose.model("PullRequest", pullRequestSchema);
