import app from "./app";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }, // configure this as per your client URL in prod
});

// Map userId to socket IDs for targeted notifications
const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("registerUser", (userId: string) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});


export { io, onlineUsers };

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
