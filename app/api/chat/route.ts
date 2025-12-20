import {
  streamText,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatMessages } from "@/lib/drizzle/schema";



const weatherTool = tool({
  description: "Get the current weather for a city",
  inputSchema: z.object({
    city: z.string().describe("City name"),
  }),
  execute: async ({ city }) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const data = await res.json();

    return {
      city: data.name,
      temperature: `${data.main.temp} °C`,
      condition: data.weather[0].main,
    };
  },
});

const stockTool = tool({
  description: "Get stock price for a symbol",
  inputSchema: z.object({
    symbol: z.string().describe("Stock ticker symbol"),
  }),
  execute: async ({ symbol }) => {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
    );
    const data = await res.json();
    const quote = data["Global Quote"];

    return {
      symbol: quote["01. symbol"],
      price: quote["05. price"],
      change: quote["10. change percent"],
    };
  },
});

const raceTool = tool({
  description: "Get the latest Formula 1 race winner",
  inputSchema: z.object({}),
  execute: async () => {
    const res = await fetch(
      "https://ergast.com/api/f1/current/last/results.json"
    );
    const data = await res.json();
    const race = data.MRData.RaceTable.Races[0];
    const winner = race.Results[0];

    return {
      race: race.raceName,
      winner: `${winner.Driver.givenName} ${winner.Driver.familyName}`,
      team: winner.Constructor.name,
    };
  },
});

function extractTextFromMessage(message: any): string | null {
  if (!message?.parts) return null;

  return message.parts
    .filter((p: any) => p.type === "text")
    .map((p: any) => p.text)
    .join(" ")
    .trim() || null;
}



export async function POST(req: Request) {
   const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  // Saving last user message
  const last = messages[messages.length - 1];
  if (last?.role === "user") {

    const text = extractTextFromMessage(last)

    if(text){
    await db.insert(chatMessages).values({
      userId: session.user.id,
      role: "user",
      content: text,
    });
  }}

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    messages: convertToModelMessages(messages),
      tools: {
      weather: weatherTool,
      stock: stockTool,
      race: raceTool,
    },
  });

  return result.toUIMessageStreamResponse({
  onFinish: async ({ responseMessage }) => {
    if (!responseMessage) return;

    const text = responseMessage.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("")
      .trim();

    if (!text) return;

    await db.insert(chatMessages).values({
      userId: session.user.id,
      role: "assistant",
      content: text,
    });
  },
});
}
