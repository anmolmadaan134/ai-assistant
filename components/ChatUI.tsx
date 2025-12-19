"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

interface ChatUIProps {
  user: {
    id: string;
    email?: string | null;
  };
  initialMessages: ChatMessage[];
}

export default function ChatUI({
  user,
  initialMessages,
}: ChatUIProps) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, isLoading } = useChat({
    api: "/api/chat",
    initialMessages,
    body: {
      userId: user.id,
    },
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      role: "user",
      content: input,
    });

    setInput("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-sm text-gray-500 mb-4">
        Logged in as {user.email}
      </p>

      <div className="space-y-3 mb-6">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              m.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-gray-100"
            }`}
          >
            <strong className="block text-xs text-gray-600">
              {m.role}
            </strong>
            <span>{m.content}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Ask something..."
        />

        <button
          type="submit"
          disabled={isLoading}
          className="border rounded px-4"
        >
          Send
        </button>
      </form>
    </div>
  );
}
