import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";


export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id").notNull(),

  role: text("role").notNull(), // "user" | "assistant"

  content: text("content").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});
