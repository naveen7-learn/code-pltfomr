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

// ✅ HYBRID CORS: Works for Localhost AND Production
const io = new Server(server, {
  cors: {
    // Allows your local dev and the future deployed URL
    origin: process.env.NODE_ENV === "production" 
      ? [process.env.CLIENT_URL] 
      : ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

setIo(io);
registerSocketHandlers(io);

const start = async () => {
  try {
    // Ensure DB connects before server starts to prevent "Registry" race conditions
    await connectDatabase();
    
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🏠 Mode: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error("❌ Critical Startup Error:", error.message);
    process.exit(1);
  }
};

start();