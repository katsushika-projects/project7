import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { memosRoute } from '@/routes/memos';
import { healthRoute } from '@/routes/health';
import { cronDeleteExpiredMemos } from '@/cron/deleteExpiredMemos';
import type { D1Database } from '@cloudflare/workers-types';

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>({ strict: false });

// ヘルスチェック用：無制限CORS
app.use('/health/*', cors());

// その他API用：制限付きCORS
app.use('*', cors({
  origin: ['https://www.copitto.com',],
  credentials: true
}));

app.route('/health', healthRoute);
app.route('/memos', memosRoute);

/**
 * Cloudflare Workers Entry Point
 */
export default {
  fetch: app.fetch,
  scheduled: async (event: any, env: Bindings) => {
    await cronDeleteExpiredMemos(env);
  },
};
