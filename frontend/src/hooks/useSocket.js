import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Ensure this matches your backend port exactly
const SOCKET_URL = "http://localhost:5000";

export const useSocket = (shouldConnect) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!shouldConnect) return;

    // We add 'transports' to force it to try multiple ways to connect
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected to backend!");
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [shouldConnect]);

  return socket;
};