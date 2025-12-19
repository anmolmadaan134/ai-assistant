"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

interface ChatUIProps {
  user: {
    id: string;
    email?: string | null;
  };
}

export default function ChatUI({ user }: ChatUIProps) {
  const [input, setInput] = useState("");

  const { messages, append, isLoading } = useChat({
    api: "/api/chat",
    body: {
      userId: user.id,
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    await append({
      role: "user",
      content: input,
    });

    setInput("");
  };

  return (
    <div className="p-4">
      <p className="text-sm text-gray-500 mb-4">
        Logged in as {user.email}
      </p>

      <div className="space-y-2 mb-4">
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2 py-1 flex-1"
          placeholder="Ask something..."
        />

        <button
          type="submit"
          disabled={isLoading}
          className="border px-3"
        >
          Send
        </button>
      </form>
    </div>
  );
}
