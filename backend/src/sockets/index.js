import { addUser, removeUser, getSocketId } from '../services/socketRegistry.js';

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // ==========================================
    // ✅ EXISTING: COLLAB INVITATION (LOCKED)
    // ==========================================
    
    socket.on("register-user", (userId) => {
      if (!userId) return;
      const stringId = String(userId).trim(); 
      addUser(stringId, socket.id);
      console.log(`👤 User Registered: ${stringId} -> ${socket.id}`);
    });

    socket.on("send-invite", ({ targetUserId, roomId, inviterName }, callback) => {
      const stringTargetId = String(targetUserId).trim();
      const targetSocketId = getSocketId(stringTargetId);
      
      if (targetSocketId) {
        io.to(targetSocketId).emit("receive-invite", { 
          roomId, 
          inviterName,
          inviterSocketId: socket.id 
        });
        
        if (callback) callback({ status: "success", message: "Invite sent!" });
        console.log(`🚀 Invite routed to ${stringTargetId}`);
      } else {
        if (callback) callback({ status: "error", message: "User is not online or ID is wrong." });
        console.log(`❌ Target ${stringTargetId} not found.`);
      }
    });

    socket.on("accept-invite", ({ roomId, inviterSocketId }) => {
      io.to(inviterSocketId).emit("invite-accepted", { roomId });
    });

    // ==========================================
    // 🚀 NEW: LIVE COMPILER & CHAT LOGIC
    // ==========================================

    // 1. Join Room (Must be called when Workspace opens)
    socket.on("join-collab-room", (roomId) => {
      socket.join(roomId);
      console.log(`📡 Socket ${socket.id} joined collab room: ${roomId}`);
    });

    // 2. Code Synchronization
    socket.on("code-change", ({ roomId, code }) => {
      // Sends to everyone in the room except the person typing
      socket.to(roomId).emit("code-update", code);
    });

    // 3. WhatsApp Style Chat
    socket.on("send-chat-message", ({ roomId, message, senderName }) => {
      const messageData = {
        id: Date.now(),
        text: message,
        sender: senderName,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      // Sends to EVERYONE in the room including the sender
      io.in(roomId).emit("receive-chat-message", messageData);
    });

    // ==========================================
    // 🔌 CLEANUP
    // ==========================================
    
    socket.on("disconnect", () => {
      removeUser(socket.id); 
      console.log("🔌 Client disconnected:", socket.id);
    });
  });
};