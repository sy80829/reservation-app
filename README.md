# 予約アプリ（reservation-app）

美容室（ヘアサロン等）向けの予約管理Webアプリケーションです。会員はGoogleアカウントでログインし、コース・担当スタイリスト・日時を選んでオンライン予約・変更・キャンセルができます。

画面構成・DB・API・認証方式などの詳細な仕様は [仕様書.md](./仕様書.md)、設計判断の背景・理由は [ARCHITECTURE.md](./ARCHITECTURE.md) を参照してください。

## デモ

https://reservation-app-green-nine.vercel.app/

Googleアカウントでのログインが必要です。

## 主な機能

- コース・スタイリスト・日時を選んでの予約作成
- 空き状況カレンダー（30分単位、指名なし予約時は全スタイリストの空き状況をマージして判定）
- 予約の変更・キャンセル（楽観ロックによる更新競合の検知）
- 日付ジャンプ用カレンダー（react-day-picker、日本語表示対応）
- 予約データは本人のみ閲覧・操作可能（所有者チェック・Supabase RLS）

## 技術スタック

| 分類                | 技術                                  |
| ------------------- | ------------------------------------- |
| フレームワーク      | Next.js 16（App Router）, React 19    |
| 言語                | TypeScript                            |
| データベース / BaaS | Supabase（PostgreSQL, Auth）          |
| 状態管理            | Jotai                                 |
| UI                  | Tailwind CSS 4, shadcn/ui（Radix UI） |
| バリデーション      | zod                                   |
| メール送信          | Resend + React Email                  |
| CI                  | GitHub Actions                        |

## セットアップ

### 必要なもの

- Node.js 20以上
- pnpm
- Supabaseプロジェクト

### 手順

```bash
git clone https://github.com/sy80829/reservation-app.git
cd reservation-app
pnpm install
cp .env.example .env.local
# .env.local に実際の値を設定してください
pnpm dev
```

http://localhost:3000 で起動します。

## 環境変数

`.env.example` をコピーして `.env.local` を作成し、値を設定してください。

| 変数名                                 | 内容                                                   |
| -------------------------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | SupabaseプロジェクトのURL                              |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabaseの公開用（anon）キー                           |
| `RESEND_API_KEY`                       | Resendのメール送信用APIキー                            |
| `NEXT_PUBLIC_SITE_URL`                 | サイトのベースURL（OAuthコールバックのリダイレクト先） |

## コマンド一覧

| コマンド     | 内容                     |
| ------------ | ------------------------ |
| `pnpm dev`   | 開発サーバーを起動       |
| `pnpm build` | 本番用ビルド             |
| `pnpm start` | 本番ビルドの起動         |
| `pnpm lint`  | ESLintでコードをチェック |

## CI

pushのたびにGitHub Actionsで型チェック・lint・ビルド確認が自動実行されます（[.github/workflows/ci.yml](./.github/workflows/ci.yml)）。
