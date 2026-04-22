import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

export const useSocket = (enabled = true) => {
  const socket = useMemo(() => {
    if (!enabled) {
      return null;
    }

    return io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"]
    });
  }, [enabled]);

  useEffect(() => {
    return () => socket?.disconnect();
  }, [socket]);

  return socket;
};
