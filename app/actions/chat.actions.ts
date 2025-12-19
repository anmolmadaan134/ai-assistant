"use server";

import { db } from "@/lib/db";
import { chatMessages } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";


export async function saveChatMessage(
  userId: string,
  role: "user" | "assistant",
  content: string
) {
  await db.insert(chatMessages).values({
    userId,
    role,
    content,
  });
}



export async function getChatHistory(userId: string) {
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, userId))
    .orderBy(chatMessages.createdAt);
}
