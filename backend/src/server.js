import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import roomRoutes from './routes/roomRoutes.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Example event emit
    socket.emit("room-status-update", {
        roomId: 101,
        status: "Occupied",
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
    });

app.get("/", (req, res) => res.send("Hotel Management API Running"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// basic error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});
