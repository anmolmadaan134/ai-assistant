"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

import WeatherCard from "./WeatherCard";
import StockCard from "./StockCard";
import RaceCard from "./RaceCard";

export default function ChatUI() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      {error && (
        <div className="text-red-500 mb-4">{error.message}</div>
      )}

      
      <div className="space-y-4 mb-6">
        {messages.map((message) => (
          <div key={message.id}>
            {message.parts.map((part, index) => {
              
              if (part.type === "text") {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 p-3 rounded mb-2"
                  >
                    {part.text}
                  </div>
                );
              }

              
              if (
                part.type === "tool-weather" &&
                part.state === "output-available"
              ) {
                return (
                  <WeatherCard
                    key={index}
                    data={part.output}
                  />
                );
              }

              
              if (
                part.type === "tool-stock" &&
                part.state === "output-available"
              ) {
                return (
                  <StockCard
                    key={index}
                    data={part.output}
                  />
                );
              }

              
              if (
                part.type === "tool-race" &&
                part.state === "output-available"
              ) {
                return (
                  <RaceCard
                    key={index}
                    data={part.output}
                  />
                );
              }

              return null;
            })}
          </div>
        ))}
      </div>

      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Ask about weather, stocks, F1…"
          disabled={status !== "ready"}
        />
        {status === "streaming" ? (
          <button
            type="button"
            onClick={stop}
            className="px-4 border rounded"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 border rounded"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
