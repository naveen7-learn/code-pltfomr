import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { registerSocketHandlers } from "./sockets/index.js";
import { setIo } from "./services/socketRegistry.js";

const port = process.env.PORT || 5000;
const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // 👇 Added a fallback to ensure localhost:5173 is always allowed
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

setIo(io);
registerSocketHandlers(io);

connectDatabase()
  .then(() => {
    server.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
      // Log this to confirm your CORS is pointing to the right place
      console.log(`CORS origin allowed: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });