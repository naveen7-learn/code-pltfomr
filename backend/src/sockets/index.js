import { addUser, removeUser, getSocketId } from '../services/socketRegistry.js';

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // ==========================================
    // 🆕 NEW: Live Collaboration Invite System
    // ==========================================
    
    // Links a user's database ID to their current socket connection
    socket.on("register-user", (userId) => {
      addUser(userId, socket.id);
      console.log(`👤 User ${userId} is online with socket ${socket.id}`);
    });

    // Catches the invite from User A and routes it to User B
    socket.on("send-invite", ({ targetUserId, roomId, inviterName }) => {
      const targetSocketId = getSocketId(targetUserId);
      
      if (targetSocketId) {
        io.to(targetSocketId).emit("receive-invite", { 
          roomId, 
          inviterName 
        });
      } else {
        console.log(`Target user ${targetUserId} is not currently online.`);
      }
    });

    // ==========================================
    // 📦 EXISTING: Project & PR Handlers
    // ==========================================
    
    socket.on("project:join", (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("pullRequest:join", (pullRequestId) => {
      socket.join(`pullRequest:${pullRequestId}`);
    });

    socket.on("typing:start", ({ pullRequestId, user }) => {
      socket.to(`pullRequest:${pullRequestId}`).emit("typing:update", {
        user,
        isTyping: true
      });
    });

    socket.on("typing:stop", ({ pullRequestId, user }) => {
      socket.to(`pullRequest:${pullRequestId}`).emit("typing:update", {
        user,
        isTyping: false
      });
    });

    // ==========================================
    // 🔌 CLEANUP
    // ==========================================
    
    socket.on("disconnect", () => {
      // 🆕 Remove the user from our tracking map when they leave
      removeUser(socket.id); 
      socket.removeAllListeners();
      console.log("🔌 Client disconnected:", socket.id);
    });
  });
};