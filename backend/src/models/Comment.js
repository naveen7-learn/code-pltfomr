import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    emoji: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    pullRequest: { type: mongoose.Schema.Types.ObjectId, ref: "PullRequest", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    filePath: { type: String, required: true },
    lineNumber: { type: Number, required: true },
    body: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    reactions: [reactionSchema]
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
