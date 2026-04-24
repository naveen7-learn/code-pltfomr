// backend/src/services/socketRegistry.js

let ioInstance = null;

export const setIo = (io) => {
  ioInstance = io;   
};

export const getIo = () => ioInstance;

// Map format: userId -> socketId
const onlineUsers = new Map(); 

export const addUser = (userId, socketId) => {
  // Overwrites any old socketId with the fresh one
  onlineUsers.set(userId, socketId);
};

export const removeUser = (socketId) => {
  // Optimized: We only delete if the socket being disconnected 
  // is actually the one currently mapped to that user.
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      console.log(`🗑️ User ${userId} removed from registry (Socket: ${socketId})`);
      break;
    }
  }
};

export const getSocketId = (userId) => {
  const id = onlineUsers.get(userId);
  // Log the check so you can see it in the terminal
  console.log(`🔍 Registry check for ${userId}: ${id ? 'FOUND ✅' : 'NOT FOUND ❌'}`);
  return id;
};