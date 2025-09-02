import { sql } from "drizzle-orm";
import { sqliteTable, text, check } from 'drizzle-orm/sqlite-core';

export const memos = sqliteTable(
  "memos",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    memo: text("memo").notNull(),
    passkey: text("passkey", { length: 6 }).notNull().unique(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (memos) => [
    check("not_empty_memo", sql`${memos.memo} <> ""`),
  ]
);
