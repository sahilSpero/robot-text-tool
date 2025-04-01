const mongoose = require("mongoose");

const RoboUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    authCodeHash: { type: String },
    authCodeExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    domains: [
      {
        name: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const RoboUser = mongoose.models.RoboUser || mongoose.model("RoboUser", RoboUserSchema);

// CommonJS Export
module.exports = RoboUser;

