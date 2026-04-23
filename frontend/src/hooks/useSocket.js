import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export const useSocket = (enabled = true) => {
  const socket = useMemo(() => {
    if (!enabled) {
      return null;
    }

    // Grab the URL, but let's log it so we know EXACTLY where it's pointing
    const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    console.log("🔌 React is attempting socket connection to:", url);

    return io(url, {
      transports: ["websocket"]
    });
  }, [enabled]);

  useEffect(() => {
    if (!socket) return;

    // Aggressive debugging listeners
    socket.on("connect", () => {
      console.log("✅ Socket officially connected! ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    return () => {
      console.log("🔌 Disconnecting socket...");
      socket.disconnect();
    };
  }, [socket]);

  return socket;
};