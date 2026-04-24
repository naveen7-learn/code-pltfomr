import { addUser, removeUser, getSocketId } from '../services/socketRegistry.js';

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    // 1. Register User (This links Mongo ID to Socket ID)
    socket.on("register-user", (userId) => {
      if (!userId) return;
      const stringId = String(userId).trim(); 
      addUser(stringId, socket.id);
      console.log(`👤 User Registered: ${stringId} -> ${socket.id}`);
    });

    // 2. Send Invite (The fix is here)
    socket.on("send-invite", ({ targetUserId, roomId, inviterName }, callback) => {
      const stringTargetId = String(targetUserId).trim();
      const targetSocketId = getSocketId(stringTargetId);
      
      console.log(`📩 Checking registry for Target: ${stringTargetId}`);

      if (targetSocketId) {
        // Force the emission to the specific socket
        io.to(targetSocketId).emit("receive-invite", { 
          roomId, 
          inviterName,
          inviterSocketId: socket.id 
        });
        
        console.log(`🚀 Success: Invite sent to Socket ${targetSocketId}`);
        if (callback) callback({ status: "success", message: "Invite sent!" });
      } else {
        console.log(`❌ Fail: User ${stringTargetId} is not in the registry`);
        if (callback) callback({ status: "error", message: "User is not online or ID is wrong." });
      }
    });

    socket.on("accept-invite", ({ roomId, inviterSocketId }) => {
      io.to(inviterSocketId).emit("invite-accepted", { roomId });
    });

    // 3. Room & Chat Logic
    socket.on("join-collab-room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-update", code);
    });

    socket.on("send-chat-message", ({ roomId, message, senderName }) => {
      const messageData = {
        id: Date.now(),
        text: message,
        sender: senderName,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      io.in(roomId).emit("receive-chat-message", messageData);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id); 
      console.log("🔌 Client disconnected:", socket.id);
    });
  });
};