import {
  streamText,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";



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



export async function POST(req: Request) {
   let body: any = {};

  try {
    body = await req.json();
  } catch {
    body = {};
  }

  
  const uiMessages = Array.isArray(body.messages)
    ? body.messages
    : [];

  
  const modelMessages = convertToModelMessages(
    uiMessages
  );

    modelMessages.unshift({
    role: "system",
    content:
      "You may ONLY use the tools provided. " +
      "Do not attempt to call search, browse, or any external tools. " +
      "Use stock ONLY for stock prices.",
  });

  console.log("UI messages:", uiMessages);
console.log("Model messages:", modelMessages);

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    messages: modelMessages,
    tools: {
      weather: weatherTool,
      stock: stockTool,
      race: raceTool,
    },
    stopWhen: stepCountIs(4),
  });

  
  return result.toUIMessageStreamResponse();
}
