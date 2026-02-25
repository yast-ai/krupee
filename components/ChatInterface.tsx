"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ImageGenerator from "./ImageGenerator";

export type Tab = "chat" | "image";

export default function ChatInterface() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sessionId = useQuery(api.sessions.getOrCreateSession);
  const messages = useQuery(
    api.messages.listMessages,
    sessionId ? { sessionId } : "skip"
  );
  const sendMessage = useMutation(api.messages.sendMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!sessionId || !content.trim()) return;
    await sendMessage({ sessionId, content: content.trim() });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "chat"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Chat (Ticker Info)
        </button>
        <button
          onClick={() => setActiveTab("image")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "image"
              ? "bg-purple-600 text-white"
              : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Generate Image
        </button>
      </div>

      {activeTab === "chat" ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4 chat-scrollbar">
            {messages?.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                <p className="text-lg mb-2">Welcome to Krupee!</p>
                <p>Ask me about any stock ticker (e.g., AAPL, TSLA, GOOGL)</p>
              </div>
            )}
            {messages?.map((message) => (
              <ChatMessage
                key={message._id}
                role={message.role}
                content={message.content}
                createdAt={message.createdAt}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-slate-200 p-4">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      ) : (
        <ImageGenerator />
      )}
    </div>
  );
}