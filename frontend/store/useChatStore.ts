import { apiClient } from "@/api/apiClient";
import { UserType } from "@/types/userType";
import { create } from "zustand";
import { useSocketStore } from "./useSocketStore";
import { ChatStore } from "@/types/chatStoreType";


export const useChatStore = create<ChatStore>((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoaging: false,

  getUsers:async () => {
    set({ isUserLoading: true });
    const {data} = await apiClient.get("/messages/users");
    set({ users: data.users });
    set({ isUserLoading: false });
  },

  getMessages:async (userId: string) => {
    set({ isMessageLoaging: true });
    const {data} = await apiClient.get(`/messages/${userId}`);
    set({ messages: data.messages });
    set({ isMessageLoaging: false });
  },

  sendMessage: async (messageData:FormData) => {
    const {messages, selectedUser} = get();
    const {data} = await apiClient.post(`/messages/send/${selectedUser?._id}`, messageData);
    set ({ messages: [...messages, data.newMessage] });
  },
   subscribeToMessages:()=>{
    const {selectedUser} = get()
    if(!selectedUser) return;

    const socket = useSocketStore.getState().socket

    socket?.on("newMessage", (newMessage: any) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return; 
      set({ messages: [...get().messages, newMessage] });
    })
  },
  unsubscribeFromMessages:()=>{
    const socket = useSocketStore.getState().socket
    socket?.off("newMessage");
  },
  setSelectedUser: (selectedUser: UserType) => set({ selectedUser }), // Function to set the selected
}));
