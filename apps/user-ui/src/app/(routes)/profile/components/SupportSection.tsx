"use client";

import React, { useState } from "react";
import { Send, Phone, Video } from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import useUser from "../../../hooks/useUser";
import axiosInstance from "../../../utils/axiosinstance";

// Setup React Query
const queryClient = new QueryClient();

function SupportChat() {
  const { user, isLoading: userLoading } = useUser();
  const [input, setInput] = useState("");
  const qc = useQueryClient();

  const userId = user?.id;

  // ✅ Fetch messages for this user
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/chat/api/chat/me", {
        params: { userId },
      });
      return data;
    },
    enabled: !!userId,
  });

  // ✅ Send message (User → Admin)
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post("/chat/api/chat/send", {
        fromUserId: userId,
        content: input,
      });
      return data;
    },
    onSuccess: () => {
      setInput("");
      qc.invalidateQueries({ queryKey: ["messages", userId] });
    },
  });

  const handleSend = () => {
    if (!input.trim() || !userId) return;
    sendMessage();
  };

  if (userLoading) return <div>Loading user...</div>;

  return (
    <div className="flex flex-col h-screen bg-[#fbf9f6] text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
        <div>
          <h2 className="font-semibold text-[#773d4c]">Support Chat</h2>
          <p className="text-sm text-gray-600">{user?.name} - Customer</p>
        </div>
        <div className="flex space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Phone className="w-5 h-5 text-[#773d4c]" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Video className="w-5 h-5 text-[#773d4c]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-slate-50">
        {messages.map((msg: any, index: number) => {
          const isMine = msg.fromUserId === userId;
          return (
            <div
              key={index}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                  isMine
                    ? "bg-[#773d4c] text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-500 block mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center border-t border-gray-200 bg-white px-4 py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={!userId}
          className="flex-1 mx-3 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#773d4c]"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!userId || isSending}
          className={`p-3 rounded-full transition-colors ${
            userId
              ? "bg-[#773d4c] text-white hover:bg-[#5f2f3d]"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
export default SupportChat;
