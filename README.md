# コピっと！
異なる端末間でメモを共有できるWebアプリケーション

## 技術構成

### バックエンド
- Runtime: Cloudflare Workers
- Framework: Hono
- Database: Cloudflare D1
- ORM: Drizzle ORM
- Validation: Zod

### フロントエンド
- Framework: Next.js
- Deploy: Vercel（[別リポジトリ](https://github.com/luck-tech/project7-s-client)）

## プロジェクト構成
```
├── backend/          # API サーバー (Hono + D1)
├── client/           # フロントエンド (Next.js)
├── openapi/          # API仕様書
└── README.md
```
