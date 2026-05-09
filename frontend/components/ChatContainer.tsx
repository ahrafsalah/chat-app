"use client"
import  { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader'
import { useChatStore } from '@/store/useChatStore';
import MessageSkeleton from './skeletons/MessageSkeleton';
import MessageInput from './MessageInput';
import { useAuth } from '@/hooks/useAuth';
import {formatMessageTime} from '../lib/utils';

const ChatContainer = () => {
  
  const { messages, getMessages, isMessageLoaging, selectedUser,subscribeToMessages,unsubscribeFromMessages } = useChatStore();
  const {data} = useAuth()
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser._id)

    subscribeToMessages()

    return () => unsubscribeFromMessages()
  }, [getMessages, selectedUser?._id,subscribeToMessages,unsubscribeFromMessages ])

  useEffect(() => {
    if (messageEndRef.current && messages ) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
  }, [messages]);

  if (isMessageLoaging) {
    return (
      <div className="flex-1 flex flex-col overflow-auto ">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto px-4">
      <ChatHeader />

      <div>
         <div className="flex flex-col gap-4 py-4" >
          {messages.map((message: any) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === data?.user._id ? "chat-end" : "chat-start"}`}
           ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full">
                  <img src={message.senderId === data?.user._id ? data?.user.profilePic : selectedUser?.profilePic} alt="profilePic" />
                </div>
              </div>
               <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
             <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-50 rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
            </div>
          ))}
         </div>
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer