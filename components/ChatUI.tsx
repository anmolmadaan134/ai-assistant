"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { signOut } from "next-auth/react";
import WeatherCard from "./WeatherCard";
import StockCard from "./StockCard";
import RaceCard from "./RaceCard";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from "./ui/Card"
import { Button } from "./ui/Button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};


export default function ChatUI({history}:{history:HistoryMessage[]}) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <div className="flex justify-center min-h-screen bg-muted/40 p-6">
      <Card className="w-full max-w-4xl flex flex-col shadow-xl">


        
        <CardHeader className="border-b bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Weather • Stocks • F1
              </p>
            </div>
            <Badge variant="secondary">Live</Badge>
            <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
          </div>
        </CardHeader>

         

        
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[65vh] px-6 py-4">
            {error && (
              <div className="text-red-500 mb-4">
                {error.message}
              </div>
            )}

            <div className="space-y-6">

               {history.map((m, i) => (
                <div
                  key={`history-${i}`}
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-background border"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {message.parts.map((part, index) => {
                    
                    if (part.type === "text") {
                      return (
                        <div
                          key={index}
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                            message.role === "user"
                              ? "ml-auto bg-primary text-primary-foreground"
                              : "bg-background border"
                          }`}
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
          </ScrollArea>
        </CardContent>

        <Separator />

        
        <CardFooter className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              sendMessage({ text: input });
              setInput("");
            }}
            className="flex w-full gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about weather, stocks, F1…"
              disabled={status !== "ready"}
              className="flex-1"
            />

            {status === "streaming" ? (
              <Button
                type="button"
                variant="destructive"
                onClick={stop}
              >
                Stop
              </Button>
            ) : (
              <Button type="submit">Send</Button>
            )}
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
