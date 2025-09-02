import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { memosRoute } from '@/routes/memos';
import { drizzle } from 'drizzle-orm/d1';
import { memos } from '@/db/schema';
import type { D1Database } from '@cloudflare/workers-types';

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>({ strict: false });

app.use('*', cors());

// Health check endpoint
app.get('/health', async (c) => {
  try {
    // DB接続チェック
    const db = drizzle(c.env.DB);
    
    // 簡単なクエリでDB接続確認
    const memosCount = await db.select().from(memos).limit(1);
    
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

app.route('/memos', memosRoute);

export default app;
