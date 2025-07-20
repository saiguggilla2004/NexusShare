const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io available to routes
app.set("io", io);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files
app.use("/uploads", express.static(uploadsDir));

// MongoDB connection
mongoose.connect(
  "mongodb+srv://sai:1234@cluster0.nnohcah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Socket.io for real-time features
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (userId) => {
    socket.join(userId);
  });

  socket.on("file-shared", (data) => {
    socket.to(data.recipientId).emit("notification", {
      type: "file-shared",
      message: `${data.senderName} shared a file with you: ${data.fileName}`,
      timestamp: new Date(),
      fileId: data.fileId,
    });
  });

  socket.on("viewing-file", (data) => {
    socket.to(data.fileId).emit("user-viewing", {
      userId: data.userId,
      userName: data.userName,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Import routes after setting up io
const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/files");
const shareRoutes = require("./routes/share");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/share", shareRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
