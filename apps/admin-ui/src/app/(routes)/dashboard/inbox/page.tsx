"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { User, Smile, Paperclip, Send } from "lucide-react";

// Axios instance
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/chat/api/chat",
  withCredentials: true,
});

type UserType = {
  id: string;
  name: string;
  email: string;
};

type MessageType = {
  id: string;
  content: string;
  timestamp: string;
  fromUserId: string | null;
  toUserId: string | null;
  fromAdminId: string | null;
  toAdminId: string | null;
};

export default function Inbox() {
  const [activeUser, setActiveUser] = useState<UserType | null>(null);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  // ✅ Get inbox users (who have chatted with admin)
  const { data: users = [], isLoading: usersLoading } = useQuery<UserType[]>({
    queryKey: ["inbox-users"],
    queryFn: async () => {
      const res = await api.get("/inbox-users");
      return res.data;
    },
  });

  // ✅ Fetch messages with the selected user
  const { data: messages = [], isLoading: messagesLoading } = useQuery<
    MessageType[]
  >({
    queryKey: ["messages", activeUser?.id],
    queryFn: async () => {
      const res = await api.get(`/${activeUser?.id}/messages`);
      return res.data;
    },
    enabled: !!activeUser,
  });

  // ✅ Send message to selected user
  const { mutate: sendMessage } = useMutation({
    mutationFn: async () => {
      const res = await api.post("/send", {
        toUserId: activeUser?.id,
        content: message,
      });
      return res.data;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", activeUser?.id] });
    },
  });

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-xl font-bold p-4 border-b border-gray-700">
          Inbox
        </h2>
        {usersLoading ? (
          <p className="p-4">Loading users...</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => setActiveUser(user)}
                className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-700 transition ${
                  activeUser?.id === user.id ? "bg-purple-600" : ""
                }`}
              >
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                  <User size={20} className="text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">User</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {activeUser?.name || "Select a user"}
          </h2>
          {activeUser && (
            <span className="text-sm text-green-400">Chatting</span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messagesLoading ? (
            <p>Loading messages...</p>
          ) : (
            messages.map((msg, i) => {
              const isAdmin = !!msg.fromAdminId;
              return (
                <div
                  key={i}
                  className={`max-w-xs p-3 rounded-xl ${
                    isAdmin ? "bg-purple-600 ml-auto" : "bg-gray-700"
                  }`}
                >
                  {msg.content}
                </div>
              );
            })
          )}
        </div>

        {/* Message Input */}
        {activeUser && (
          <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center gap-3">
            <Smile size={22} className="text-gray-400 hover:text-white" />
            <Paperclip size={22} className="text-gray-400 hover:text-white" />
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 p-3 rounded-xl bg-gray-700 text-white focus:outline-none"
            />
            <button
              onClick={() => sendMessage()}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Send size={20} /> Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
