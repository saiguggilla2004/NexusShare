const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const File = require("../models/File");
const Folder = require("../models/Folder");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Upload file
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { folderId, description, tags } = req.body;

    // Check if file with same name exists in same folder
    const existingFile = await File.findOne({
      originalName: req.file.originalname,
      owner: req.userId,
      folder: folderId || null,
    });

    let fileDoc;

    if (existingFile) {
      // Handle version control
      const action = req.body.action; // 'replace' or 'keep-both'

      if (action === "replace") {
        // Archive old version
        existingFile.versions.push({
          filename: existingFile.filename,
          path: existingFile.path,
        });

        // Update with new file
        existingFile.filename = req.file.filename;
        existingFile.path = req.file.path;
        existingFile.size = req.file.size;
        existingFile.mimetype = req.file.mimetype;

        fileDoc = await existingFile.save();
      } else {
        // Keep both - create new file with modified name
        const nameWithoutExt = path.parse(req.file.originalname).name;
        const ext = path.parse(req.file.originalname).ext;
        const newName = `${nameWithoutExt} (1)${ext}`;

        fileDoc = new File({
          filename: req.file.filename,
          originalName: newName,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.path,
          owner: req.userId,
          folder: folderId || null,
          description,
          tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        });

        await fileDoc.save();
      }
    } else {
      // Create new file
      fileDoc = new File({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        owner: req.userId,
        folder: folderId || null,
        description,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      });

      await fileDoc.save();
    }

    await fileDoc.populate("owner", "name email");
    res.status(201).json(fileDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's files
router.get("/", auth, async (req, res) => {
  try {
    const {
      folderId,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { owner: req.userId };

    if (folderId) {
      query.folder = folderId;
    } else {
      query.folder = null; // Root folder
    }

    if (search) {
      query.originalName = { $regex: search, $options: "i" };
    }

    const files = await File.find(query)
      .populate("owner", "name email")
      .populate("folder", "name path")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 });

    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Download file
router.get("/download/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if user has permission to download
    const hasPermission =
      file.owner.toString() === req.userId ||
      file.sharedWith.some((share) => share.user.toString() === req.userId);

    if (!hasPermission) {
      return res.status(403).json({ message: "Access denied" });
    }

    const filePath = path.resolve(file.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, file.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate public link
router.post("/:id/public-link", auth, async (req, res) => {
  try {
    const { password, expiresAt } = req.body;
    const file = await File.findById(req.params.id);

    if (!file || file.owner.toString() !== req.userId) {
      return res.status(404).json({ message: "File not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    file.isPublic = true;
    file.publicLink = {
      token,
      password: password || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      downloadCount: 0,
    };

    await file.save();

    res.json({
      publicUrl: `${req.protocol}://${req.get(
        "host"
      )}/api/files/public/${token}`,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Access public file
router.get("/public/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.query;

    const file = await File.findOne({ "publicLink.token": token });

    if (!file || !file.isPublic) {
      return res.status(404).json({ message: "File not found or not public" });
    }

    // Check expiration
    if (file.publicLink.expiresAt && new Date() > file.publicLink.expiresAt) {
      return res.status(410).json({ message: "Link has expired" });
    }

    // Check password
    if (file.publicLink.password && file.publicLink.password !== password) {
      return res.status(401).json({ message: "Password required" });
    }

    // Increment download count
    file.publicLink.downloadCount += 1;
    await file.save();

    const filePath = path.resolve(file.path);
    res.download(filePath, file.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete file
router.delete("/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file || file.owner.toString() !== req.userId) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete versions
    file.versions.forEach((version) => {
      if (fs.existsSync(version.path)) {
        fs.unlinkSync(version.path);
      }
    });

    await File.findByIdAndDelete(req.params.id);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
