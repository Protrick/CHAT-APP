import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

const app = express();

// ✅ Fix PayloadTooLargeError for base64 uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ CORS
app.use(cors());

// ✅ Create HTTP server and attach socket.io
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",  // Change to your frontend URL if needed
    },
});

// ✅ Online Users Map
export const userSocketMap = {};  // { userId: socketId }

// ✅ Socket.io Connection
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // ✅ Notify all clients about online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log("User disconnected:", userId);
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

// ✅ Routes
app.use("/api/status", (req, res) => {
    res.send("Server is running");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ✅ Connect to DB and Start Server
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
