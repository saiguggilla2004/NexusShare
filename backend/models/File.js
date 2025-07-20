const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    publicLink: {
      token: String,
      password: String,
      expiresAt: Date,
      downloadCount: {
        type: Number,
        default: 0,
      },
    },
    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
        permissions: {
          type: String,
          enum: ["view", "download"],
          default: "download",
        },
      },
    ],
    versions: [
      {
        filename: String,
        path: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [String],
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", fileSchema);
