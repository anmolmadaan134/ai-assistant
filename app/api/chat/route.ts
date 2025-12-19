import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { saveChatMessage } from "@/app/actions/chat.actions";

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  // Saving last user message
  const lastMessage = messages[messages.length - 1];
  const safeUserId = String(userId);
  await saveChatMessage(safeUserId, "user", lastMessage.content);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    onFinish: async ({ text }) => {
      // Saving assistant response
      await saveChatMessage(safeUserId, "assistant", text);
    },
  });

  return new Response(result, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
