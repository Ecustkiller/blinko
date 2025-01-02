'use client'
import { ChatHeader } from './chat-header'
import { ChatInput } from "./chat-input";
import ChatContent from "./chat-content";

export default function Chat() {
  return <div className="flex flex-col flex-1 relative overflow-x-hidden items-center">
    <ChatHeader />
    <ChatContent />
    <ChatInput />
  </div>
}
