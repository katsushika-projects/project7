# 概要

Project7

## 環境構築

### 前提

- Next.js

### 開発時起動

- アプリケーション

```bash
yarn dev
```

- Storybook

```bash
yarn storybook
```

## 使用ライブラリ

## ディレクトリ構成

```

src
├── app
│   ├── main-provider.tsx   # 各種providerの読み込み
│   └── routes              # ルーティングの設定及び各ページのルートコンポーネント
├── assets                  # 画像などの静的ファイル
├── components
│   ├── ui                  # 共通パーツ
│   └── layout              # ページレイアウト
├── features                # 特定の機能に限定した実装
│   └── [機能名]
│       ├── components
│       └── hooks
├── hooks                   # 共通hooks
├── types                   # 共通type

```

### フォルダ名、ファイル名について

`kebab-case` で作成してください。
