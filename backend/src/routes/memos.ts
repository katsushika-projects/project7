import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { memos } from '@/db/schema';
import { eq, lt } from 'drizzle-orm';
import { createMemoSchema, getMemoByPasskeySchema, memoIdParamSchema } from '@/validators/memo';
import { zValidator } from '@hono/zod-validator';
import { getUniquePasskey } from '@/db/passkey';
import type { Bindings } from '@/index';

export const memosRoute = new Hono<{ Bindings: Bindings }>();

/**
 * POST /memos/create
 * メモを作成する
 */
memosRoute.post('/create', zValidator('json', createMemoSchema), async (c) => {
  const { memo } = c.req.valid('json');
  const db = drizzle(c.env.DB);
  const passkey = await getUniquePasskey(db);
  const newMemo = await db.insert(memos).values({ memo, passkey }).returning().get();
  return c.json(newMemo, 201);
});

/**
 * POST /memos/delete_expired_memos
 * 作成されてから15分以上経過したメモを削除して、削除した件数を返す
 */
memosRoute.post('/delete_expired_memos', async (c) => {
  const db = drizzle(c.env.DB);
  const MEMO_LIFETIME_MINUTES = 15;
  const expiredDate = new Date(Date.now() - MEMO_LIFETIME_MINUTES * 60 * 1000).toISOString();
  const deletedMemos = await db.delete(memos).where(lt(memos.createdAt, expiredDate)).returning();
  return c.json({ detail: `deleted ${deletedMemos.length} memos.` }, 200);
});

/**
 * GET /memos/:memoId
 * memoIdを指定してメモを取得する
 */
memosRoute.get('/:memoId', zValidator('param', memoIdParamSchema), async (c) => {
  const { memoId } = c.req.valid('param');
  const db = drizzle(c.env.DB);
  const retrievedMemo = await db.select().from(memos).where(eq(memos.id, memoId)).get();
  if (!retrievedMemo) {
    return c.json({ detail: 'No Memo matches the given query.' }, 404);
  }
  return c.json(retrievedMemo, 200);
});

/**
 * DELETE /memos/:memoId
 * memoIdを指定してメモを削除する
 */
memosRoute.delete('/:memoId', zValidator('param', memoIdParamSchema), async (c) => {
  const { memoId } = c.req.valid('param');
  const db = drizzle(c.env.DB);
  const deletedMemo = await db.delete(memos).where(eq(memos.id, memoId)).returning().get();
  if (!deletedMemo) {
    return c.json({ detail: 'No Memo matches the given query.' }, 404);
  }
  return c.json(204)
});

/**
 * POST /memos
 * passkeyを指定してメモを取得する
 */
memosRoute.post('', zValidator('json', getMemoByPasskeySchema), async (c) => {
  const { passkey } = c.req.valid('json');
  const db = drizzle(c.env.DB);
  const retrievedMemo = await db.select().from(memos).where(eq(memos.passkey, passkey)).get();
  if (!retrievedMemo) {
    return c.json({ detail: 'No Memo matches the given query.' }, 404);
  }
  return c.json(retrievedMemo, 200);
});
