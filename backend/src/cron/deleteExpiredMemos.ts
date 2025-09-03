import { drizzle } from 'drizzle-orm/d1';
import { memos } from '@/db/schema';
import { lt } from 'drizzle-orm';
import type { Bindings } from '@/index';

/**
 * 期限切れメモ削除の共通ロジック
 * APIエンドポイントとCron Triggerの両方で使用
 */
export async function deleteExpiredMemos(db: ReturnType<typeof drizzle>) {
  const MEMO_LIFETIME_MINUTES = 15;
  const expiredDate = new Date(Date.now() - MEMO_LIFETIME_MINUTES * 60 * 1000).toISOString();
  
  const deletedMemos = await db.delete(memos).where(lt(memos.createdAt, expiredDate)).returning();
  
  return {
    deletedCount: deletedMemos.length,
    deletedMemos
  };
}

/**
 * Cron Trigger Handler
 * 15分毎に期限切れメモを自動削除
 */
export async function cronDeleteExpiredMemos(env: Bindings) {
  try {
    const db = drizzle(env.DB);
    const result = await deleteExpiredMemos(db);
    
    console.log(`[Cron] Deleted ${result.deletedCount} expired memos at ${new Date().toISOString()}`);
    return result;
  } catch (error: any) {
    console.error('[Cron] Error deleting expired memos:', error?.message || error);
    throw error;
  }
}
