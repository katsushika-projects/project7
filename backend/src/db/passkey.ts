import { memos } from '@/db/schema';
import { sql } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';

/**
 * ランダムな6桁の英小文字+数字の文字列を生成する。
 * @returns 6文字のパスキー
 */
const generatePasskey = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

/**
 * DB内で重複しないユニークなパスキーを生成する。
 * @param db drizzle-ormのDBインスタンス
 * @returns ユニークな6文字のパスキー
 */
export const getUniquePasskey = async (db: DrizzleD1Database): Promise<string> => {
  while (true) {
    const passkey = generatePasskey();
    const exists = await db.select().from(memos).where(sql`passkey = ${passkey}`).get();
    if (!exists) return passkey;
  }
};
