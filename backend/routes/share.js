const express = require("express");
const File = require("../models/File");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Share file with user
router.post("/file/:id", auth, async (req, res) => {
  try {
    const { email, permissions = "download" } = req.body;
    const file = await File.findById(req.params.id);

    if (!file || file.owner.toString() !== req.userId) {
      return res.status(404).json({ message: "File not found" });
    }

    const recipient = await User.findOne({ email });
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already shared
    const alreadyShared = file.sharedWith.some(
      (share) => share.user.toString() === recipient._id.toString()
    );

    if (alreadyShared) {
      return res
        .status(400)
        .json({ message: "File already shared with this user" });
    }

    file.sharedWith.push({
      user: recipient._id,
      permissions,
    });

    await file.save();

    // Get io instance from app
    const io = req.app.get("io");

    // Send real-time notification if io is available
    if (io) {
      const sender = await User.findById(req.userId);
      io.to(recipient._id.toString()).emit("notification", {
        type: "file-shared",
        message: `${sender.name} shared a file with you: ${file.originalName}`,
        timestamp: new Date(),
        fileId: file._id,
        senderId: sender._id,
        senderName: sender.name,
      });
    }

    res.json({ message: "File shared successfully" });
  } catch (error) {
    console.error("Error in share route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get files shared with me
router.get("/shared-with-me", auth, async (req, res) => {
  try {
    const files = await File.find({
      "sharedWith.user": req.userId,
    })
      .populate("owner", "name email")
      .populate("sharedWith.user", "name email")
      .lean(); // Convert to plain objects for better performance

    // Filter out any files that don't have required fields
    const validFiles = files.filter(
      (file) =>
        file &&
        file._id &&
        file.mimetype &&
        file.originalName &&
        file.size !== undefined &&
        file.owner &&
        file.owner.name
    );

    console.log(
      `Found ${validFiles.length} valid shared files for user ${req.userId}`
    );
    res.json(validFiles);
  } catch (error) {
    console.error("Error fetching shared files:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get files I've shared
router.get("/shared-by-me", auth, async (req, res) => {
  try {
    const files = await File.find({
      owner: req.userId,
      "sharedWith.0": { $exists: true },
    }).populate("sharedWith.user", "name email");

    res.json(files);
  } catch (error) {
    console.error("Error fetching shared files:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
