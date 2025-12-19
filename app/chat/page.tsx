import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChatUI from "@/components/ChatUI";
import { getChatHistory } from "../actions/chat.actions";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

   const history = await getChatHistory(String(session.user.id));
  return <ChatUI user={session.user} initialMessages={history.map((m) => ({
        role: m.role,
        content: m.content,
      }))}/>
}