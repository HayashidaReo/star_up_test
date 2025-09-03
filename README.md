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

### 前提条件

以下のソフトウェアがインストールされている必要があります：

- **Node.js**: v18.0.0 以上 ([公式サイト](https://nodejs.org/))
- **npm**: v8.0.0 以上（Node.jsに同梱）
- **Docker**: 最新版（Dockerを使用する場合）
- **Docker Compose**: v2.0 以上（Dockerを使用する場合）
- **Git**: 最新版

### 🎯 クイックスタート（初めての方向け）

プロジェクトをクローンして即座に動かすには：

```bash
# 1. リポジトリをクローン
git clone https://github.com/HayashidaReo/star_up_test.git
cd star_up_test

# 2. 依存関係をインストール
npm install

# 3. モック環境で即座に起動（APIキー不要）
npm run dev:mock
```

これで http://localhost:3000 でアプリケーションが利用できます。

### 📋 詳細セットアップ

#### Step 1: プロジェクトのクローン

```bash
git clone https://github.com/HayashidaReo/star_up_test.git
cd star_up_test
```

#### Step 2: 依存関係のインストール

```bash
npm install
```

#### Step 3: 環境設定（2つの方法）

##### 🎭 方法A: モック環境（推奨・初回セットアップ時）

APIキーを取得する前に、まずモック環境でアプリケーションを試すことができます：

```bash
# モック環境で開発サーバーを起動
npm run dev:mock
```

**モック環境の特徴:**
- ✅ APIキー不要
- ✅ 即座に動作確認可能
- ✅ 14種類の主要通貨のテストデータ
- ✅ ネットワーク接続不要

##### 🌐 方法B: 実際のAPI環境

実際の為替レートデータを使用する場合：

**1. APIキーを取得**
1. [ExchangeRate.host](https://exchangerate.host/) にアクセス
2. 無料アカウントを作成
3. APIキーをコピー

**2. 環境ファイルを設定**

**Option 1: .envファイル（推奨）**
```bash
# プロジェクトルートに .env ファイルを作成
echo "EXCHANGERATE_API_KEY=your_actual_api_key_here" > .env
```

**2. Docker Secrets（Docker使用時）**
```bash
# secretsディレクトリにAPIキーファイルを作成
echo "your_actual_api_key_here" > secrets/exchangerate_api_key.txt
```

#### Step 4: アプリケーションの起動

##### 🖥️ ローカル開発（Node.js）

```bash
# 通常の開発モード（.envのAPIキーを使用）
npm run dev

# モック環境（APIキー不要）
npm run dev:mock

# 環境変数を直接指定
FORCE_MOCK_API=true npm run dev
```

##### 🐳 Docker環境

```bash
# 開発環境（Docker Secrets使用）
npm run docker:dev
# または
docker compose up dev

# 本番環境
docker compose up prod

# バックグラウンド実行
docker compose up -d dev
```

#### Step 5: 動作確認

ブラウザで http://localhost:3000 にアクセスして、以下を確認：

1. ✅ 参加者を追加できる
2. ✅ 費用を登録できる
3. ✅ 通貨選択ドロップダウンが表示される
4. ✅ 精算結果が計算される

### 🔧 環境設定の詳細

#### 環境変数一覧

| 変数名                 | 必須         | デフォルト    | 説明                                            |
| ---------------------- | ------------ | ------------- | ----------------------------------------------- |
| `EXCHANGERATE_API_KEY` | 本番・開発時 | なし          | ExchangeRate.host APIのアクセスキー             |
| `FORCE_MOCK_API`       | オプション   | `false`       | `true`に設定するとモックデータを使用            |
| `NODE_ENV`             | オプション   | `development` | 実行環境（`development`, `production`, `test`） |

#### 設定ファイルの優先順位

1. **コマンドライン環境変数** （最優先）
   ```bash
   FORCE_MOCK_API=true npm run dev
   ```

2. **.env** （プロジェクトルート、gitignoreされる）
   ```bash
   EXCHANGERATE_API_KEY=your_key_here
   FORCE_MOCK_API=false
   ```

3. **.env** （共有用、gitで管理される）
   ```bash
   EXCHANGERATE_API_KEY=your_key_here
   ```

4. **Docker Secrets** （Docker環境用）
   ```
   secrets/exchangerate_api_key.txt
   ```

#### トラブルシューティング

**問題: 通貨データが取得できない**
```bash
# 環境変数を確認
echo $EXCHANGERATE_API_KEY

# モック環境で動作確認
npm run dev:mock

# ログを確認（Network タブで API レスポンスを確認）
```

**問題: Dockerコンテナが起動しない**
```bash
# secretsファイルの存在確認
ls -la secrets/

# ファイル内容を確認（開発環境でのみ）
cat secrets/exchangerate_api_key.txt

# Docker Composeログを確認
docker compose logs dev
```

**問題: 環境変数が反映されない**
```bash
# 開発サーバーを完全に再起動
# Ctrl+C で停止後、再度起動

# Next.jsのキャッシュをクリア
rm -rf .next

# 再起動
npm run dev
```

## 📋 よくある質問（FAQ）

### Q: APIキーを取得せずにアプリケーションを試したい
**A:** `npm run dev:mock` を実行してください。モック環境でAPIキーなしで動作します。

### Q: Docker環境と通常環境の違いは？
**A:** 
- **通常環境**: `.env`ファイルのAPIキーを使用
- **Docker環境**: `secrets/exchangerate_api_key.txt`ファイルのAPIキーを使用（よりセキュア）

### Q: 環境変数が正しく読み込まれているか確認したい
**A:** ブラウザの開発者ツール > Network タブでAPIリクエストを確認してください。

### Q: 本番環境でもモックデータを使用したい
**A:** `FORCE_MOCK_API=true`を環境変数に設定してください。

### Q: テストが失敗する場合は？
**A:** 
1. 依存関係を再インストール: `npm ci`
2. キャッシュをクリア: `npm run test -- --clearCache`
3. Node.jsバージョンを確認: Node.js 18以上が必要

## 🔧 トラブルシューティング

### 一般的な問題と解決方法

#### 1. 環境変数が読み込まれない
```bash
# 開発サーバーを完全に停止
Ctrl+C

# プロセスが残っている場合は強制終了
pkill -f "next"

# 再起動
npm run dev
```

#### 2. APIリクエストが失敗する
- APIキーが正しく設定されているか確認
- ExchangeRate.host のAPIキークォータを確認
- ネットワーク接続を確認
- モック環境での動作確認: `npm run dev:mock`

#### 3. Docker関連の問題
```bash
# Dockerコンテナとイメージを完全にクリーンアップ
docker compose down --rmi all --volumes --remove-orphans

# 再ビルド
docker compose build

# 再起動
docker compose up dev
```

#### 4. パッケージのインストール問題
```bash
# node_modulesとpackage-lock.jsonを削除
rm -rf node_modules package-lock.json

# 依存関係を再インストール
npm install
```

#### 5. ポート3000が使用中の場合
```bash
# ポートを使用中のプロセスを確認
lsof -ti:3000

# プロセスを停止（PIDを取得後）
kill -9 <PID>

# または、別のポートで起動
PORT=3001 npm run dev
```

## 📊 開発・テスト・品質管理

### テスト実行

```bash
# 全テスト実行
npm run test

# ウォッチモードでテスト実行
npm run test:watch

# カバレッジレポート生成
npm run test:coverage
```

### Storybook

```bash
# Storybook起動（開発用）
npm run storybook

# Storybookビルド
npm run build-storybook
```

### リンティング・フォーマット

```bash
# ESLintチェック
npm run lint

# Prettierフォーマット
npm run format
```

## 📚 プロジェクト構成

```
src/
├── app/           # Next.js App Routerページ
├── components/    # UIコンポーネント（Atomic Design）
├── domain/        # ビジネスロジック層
├── repository/    # データアクセス層
├── data/          # データソース実装
├── hooks/         # カスタムReactフック
├── lib/           # ユーティリティ関数
├── store/         # 状態管理（Zustand）
├── types/         # TypeScript型定義
└── stories/       # Storybookストーリー
```

### Docker本番環境

```bash
# 本番用イメージビルド
docker compose -f docker-compose.yml build prod

# 本番環境起動
docker compose -f docker-compose.yml up -d prod
```

## 📧 サポート

質問やバグ報告は、GitHubのIssuesをご利用ください。


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
