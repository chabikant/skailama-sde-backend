const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const episodeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["inprogress", "done"],
    default: "pending",
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  transcript: {
    type: String,
    required: true,
  },
});

episodeSchema.pre("save", async function (next) {
  const projectId = this.projectId;
  if (projectId) {
    await mongoose.model("Project").findByIdAndUpdate(projectId, {
      updatedAt: Date.now(),
      $inc: { episodeCount: 1 },
    });
  }
  next();
});

const Episode = mongoose.model("Episode", episodeSchema);
module.exports = Episode;
