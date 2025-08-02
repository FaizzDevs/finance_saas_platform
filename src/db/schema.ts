import { pgTable, serial, text, timestamp, numeric } from "drizzle-orm/pg-core"

export const transactions = pgTable("transactions", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    type: text("type").notNull(), //income or expense
    category: text("category"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})