"use client";


import { useChatStore } from "@/store/useChatStore";
import { useSocketStore } from "@/store/useSocketStore";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const {onlineUsers} = useSocketStore();

  return (
    <div className="p-2.5 border-b border-base-300 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
           <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.name} />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser?.name}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser?._id ?? "") ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button onClick={() => setSelectedUser(null as any)}>
          <X />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader