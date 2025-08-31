import React, { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

const getSocket = (socketRef) => {
  if (socketRef.current === null) {
    console.log("Initializing socket...");
    socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true, // 👈 ensures cookies are sent
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socketRef.current;
};

export const SocketProvider = React.memo(({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = getSocket(socketRef);

    socket.on("connect", () => {
      console.log(`✅ Connected: ${socket.id}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Disconnected: ${reason}`);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`🔄 Reconnect attempt #${attempt}`);
    });

    socket.on("connect_error", (error) => {
      console.error("🚨 Connection error:", error);
    });

    socket.on("registered", (data) => {
      console.log("👤 Registered:", data);
    });

    // Optional cleanup
    // return () => {
    //   if (socket.connected) {
    //     socket.disconnect();
    //     console.log("🛑 Socket manually disconnected");
    //   }
    //   // Don't null socketRef.current unless you're recreating from scratch
    // };
  }, []);

  const register = (data) => {
    if (socketRef.current) {
      socketRef.current.emit("register", data);
      console.log(`admin has successfully registered their email to socket`)
    } else {
      console.error("❗ Socket not ready");
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: getSocket(socketRef),
        register,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
});
