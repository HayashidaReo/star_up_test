# Star Up Test - 通貨換算機能付き割り勘アプリ

Next.js 15とTypeScriptで構築された、リアルタイム通貨換算機能を備えた割り勘計算アプリケーションです。

## 🌟 機能

- **参加者管理**: 割り勘参加者の追加・削除
- **費用登録**: 項目別の費用管理
- **通貨換算**: 200以上の通貨に対応したリアルタイム為替レート取得
- **精算計算**: 通貨換算を考慮した精算金額の自動計算
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 🏗️ アーキテクチャ

3層アーキテクチャを採用:
- **Domain層**: ビジネスロジック（`src/domain/`）
- **Repository層**: データアクセス抽象化（`src/repository/`）
- **Data層**: API実装（`src/data/`）

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UI コンポーネント**: shadcn/ui
- **状態管理**: Zustand
- **バリデーション**: Zod
- **テスト**: Vitest + React Testing Library
- **ストーリーブック**: Storybook
- **API**: ExchangeRate.host
- **コンテナ**: Docker + Docker Compose

## 🚀 セットアップ手順

### 1. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の形式でAPIキーを設定してください：

```bash
# .env - 本番・開発環境
EXCHANGERATE_API_KEY=your_api_key_here

# オプション: モック環境を強制する場合
FORCE_MOCK_API=true
```

#### 環境変数の詳細

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `EXCHANGERATE_API_KEY` | 本番・開発時 | ExchangeRate.host APIのアクセスキー |
| `FORCE_MOCK_API` | オプション | `true`に設定するとモックデータを使用 |

**APIキーの取得方法**:
1. [ExchangeRate.host](https://exchangerate.host/) にアクセス
2. 無料アカウントを作成
3. APIキーを取得
4. 上記の `your_api_key_here` を実際のAPIキーに置き換え

**モック環境について**:
- `FORCE_MOCK_API=true` を設定するとAPIキーなしで動作します
- 開発初期やオフライン環境での作業に便利です
- Storybookとテスト環境では自動的にモックが使用されます

### 2. ローカル開発環境

#### Node.js環境での実行

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

#### Docker環境での実行

```bash
# 開発用コンテナの起動
docker compose up dev

# または、デタッチモードで起動
docker compose up -d dev
```

アプリケーションは http://localhost:3000 で起動します。

### 3. モック環境での実行

APIキーを設定せずに、モックデータを使用してアプリケーションを動作させることができます。

#### モック環境での起動方法

```bash
# 環境変数でモックを強制指定
FORCE_MOCK_API=true npm run dev
```

または、`.env` ファイルに以下を追加：

```bash
# .env
FORCE_MOCK_API=true
```

#### モック環境の特徴

- **APIキー不要**: ExchangeRate.host APIを使用せず、モックデータを返します
- **開発効率**: ネットワーク遅延なしで即座にレスポンスを取得
- **オフライン開発**: インターネット接続なしでも動作
- **テストデータ**: 14種類の主要通貨のモックデータを提供

#### 利用可能なモック通貨

- JPY (日本円)
- USD (米ドル)
- EUR (ユーロ)
- GBP (英ポンド)
- AUD (豪ドル)
- CAD (加ドル)
- CHF (スイスフラン)
- CNY (中国元)
- KRW (韓国ウォン)
- SGD (シンガポールドル)
- HKD (香港ドル)
- INR (インドルピー)
- THB (タイバーツ)
- MXN (メキシコペソ)

### 4. 本番環境

```bash
# 本番用ビルドとコンテナ起動
docker compose up prod

# または、デタッチモードで起動
docker compose up -d prod
```

## 📝 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# モック環境での開発サーバー起動
FORCE_MOCK_API=true npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# Storybook起動
npm run storybook

# Storybookビルド
npm run build-storybook

# リンター実行
npm run lint

# コードフォーマット
npm run format

# 型チェック
npm run type-check
```

## 🐳 Docker コマンド

```bash
# 開発環境
docker compose up dev          # フォアグラウンド実行
docker compose up -d dev       # バックグラウンド実行

# 本番環境
docker compose up prod         # フォアグラウンド実行
docker compose up -d prod      # バックグラウンド実行

# モック環境での実行
FORCE_MOCK_API=true docker compose up dev

# コンテナ停止
docker compose down

# イメージ再ビルド
docker compose build dev       # 開発用
docker compose build prod      # 本番用
```

**注意**: Dockerでモック環境を使用する場合は、`docker-compose.yml`の`args`セクションに`FORCE_MOCK_API=true`を追加するか、実行時に環境変数を指定してください。

## 📁 プロジェクト構造

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # APIルート
│   ├── globals.css           # グローバルスタイル
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # ホームページ
├── components/              # UIコンポーネント
│   ├── atoms/               # 基本コンポーネント
│   ├── molecules/           # 複合コンポーネント
│   ├── organisms/           # 複雑なコンポーネント
│   └── templates/           # ページテンプレート
├── domain/                  # ビジネスロジック
├── repository/              # データアクセス抽象化
├── data/                    # API実装
├── hooks/                   # カスタムフック
├── lib/                     # ユーティリティ
├── store/                   # 状態管理
├── types/                   # 型定義
└── stories/                 # Storybook
```

## 🧪 テスト

```bash
# 全テスト実行
npm test

# 特定ファイルのテスト
npm test -- ConvertCurrencyUseCase

# カバレッジ付きテスト
npm run test:coverage
```

## 📖 API仕様

### 通貨リスト取得
- **エンドポイント**: `/api/currencies`
- **メソッド**: GET
- **レスポンス**: 利用可能な通貨の一覧

### 為替レート取得
- **エンドポイント**: `/api/exchange-rates`
- **メソッド**: GET
- **パラメータ**: 
  - `base`: 基準通貨（デフォルト: USD）
  - `symbols`: 取得対象通貨（カンマ区切り）

## 🤝 開発ガイド

1. **ブランチ戦略**: feature/機能名 でブランチを作成
2. **コミット**: Conventional Commits に従う
3. **プルリクエスト**: テストとビルドが通ることを確認
4. **コードスタイル**: Prettier + ESLint に従う

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [ExchangeRate.host API](https://exchangerate.host/)
