// backend/src/services/socketRegistry.js

// 1. Your existing IO instance logic
let ioInstance = null;

export const setIo = (io) => {
  ioInstance = io;
};

export const getIo = () => ioInstance;

// 2. The new Live User Tracking logic
const onlineUsers = new Map(); // Map format: userId -> socketId

export const addUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

export const removeUser = (socketId) => {
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};

export const getSocketId = (userId) => {
  return onlineUsers.get(userId);
};