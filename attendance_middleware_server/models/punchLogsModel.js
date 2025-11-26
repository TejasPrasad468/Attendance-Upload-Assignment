// PunchLogs {
// userId,
// deviceId,
// punchTime,
// type,
// status: "pending" | "synced" | "failed",
// retryCount
// }

const mongoose = require("mongoose");

const PunchLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    punchTime: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: ["in", "out", "unknown"],
      default: "unknown",
    },

    status: {
      type: String,
      enum: ["pending", "synced", "failed"],
      default: "pending",
      index: true,
    },

    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

module.exports = mongoose.model("PunchLog", PunchLogSchema);
