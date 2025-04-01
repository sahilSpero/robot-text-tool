// src/server/models/RobotSchema.js
const mongoose = require('mongoose');

// Define the Robot Schema
const RobotsSchema = new mongoose.Schema(
  {
    domain_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoboUser.domains._id',
    },
    domain: {
      type: String,
      required: true,
    },
    robotText: {
      type: String,
    },
    isChanged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in Next.js hot reload
module.exports = mongoose.models.Robots || mongoose.model('Robots', RobotsSchema);
