import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChatUI from "@/components/ChatUI";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { chatMessages } from "@/lib/drizzle/schema";


export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  const history = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, session.user.id))
    .orderBy(chatMessages.createdAt);


   
  return <ChatUI
      history={history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))}
    />
}