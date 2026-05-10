
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStore = {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
};


export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: (userId: string) => {
    if ( get().socket?.connected) return; // Prevent multiple connections
    const socket = io(
      process.env.NODE_ENV === "development" ? "http://localhost:5001" :"https://chatty.up.railway.app",
      {
        query:{userId}, // Pass user ID if needed
        withCredentials: true,
      },
    );
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (users: any) => {
      set({ onlineUsers: users });
    });
  },
  disconnectSocket: () => {
   
    if (get().socket?.connected) {
      get().socket?.disconnect();
      set({ socket: null });
    }
  },
}));
