import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    pullRequest: { type: mongoose.Schema.Types.ObjectId, ref: "PullRequest", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["commented", "approved", "changes_requested"], required: true },
    summary: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
