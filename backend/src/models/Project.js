import mongoose from "mongoose";

const fileNodeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    type: { type: String, enum: ["file", "folder"], required: true },
    language: { type: String, default: "plaintext" },
    content: { type: String, default: "" }
  },
  { _id: true, timestamps: true }
);

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    summary: { type: String, required: true }
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    visibility: { type: String, enum: ["private", "team", "public"], default: "team" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
    files: [fileNodeSchema],
    activity: [activitySchema]
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
