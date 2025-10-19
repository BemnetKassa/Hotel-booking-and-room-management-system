// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import routes from "./routes/index.js"; // ensure index.js exports combined router
import prisma from "./config/prisma.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// simple health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// mount API routes under /api
app.use("/api", routes);

// http + socket
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || "*" },
});

// basic socket handlers: admin rooms + broadcast events
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Optionally join rooms (eg. admin dashboard)
  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("leave", (room) => {
    socket.leave(room);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Global error handling fallback
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // optional: test DB connection
  try {
    await prisma.$connect();
    console.log("Prisma connected to DB");
  } catch (e) {
    console.error("Prisma connection error:", e);
  }
});
