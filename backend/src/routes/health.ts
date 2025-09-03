import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { memos } from '@/db/schema';
import type { Bindings } from '@/index';

export const healthRoute = new Hono<{ Bindings: Bindings }>();

/**
 * GET /health
 * ヘルスチェック - APIサーバーとデータベースの動作状況を確認
 */
healthRoute.get('/', async (c) => {
  try {
    // DB接続チェック
    const db = drizzle(c.env.DB);
    await db.select().from(memos).limit(1);
    
    return c.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: 'cloudflare-workers'
    }, 200);
  } catch (error) {
    return c.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: 'cloudflare-workers'
    }, 500);
  }
});
