# 通貨換算機能実装

## 🎯 実装概要

ARCHITECTURE.mdに従い、旅行費用割り勘精算アプリケーションに通貨換算機能を3層アーキテクチャで実装しました。

## 📁 実装したアーキテクチャ

### 1. ドメイン層 (domain/)
- **ConvertCurrencyUseCase**: 通貨変換のビジネスロジック
- **SettlementUseCase**: 通貨変換を含む精算計算のビジネスロジック

### 2. リポジトリ層 (repository/)
- **CurrencyRepository**: 通貨データアクセスの抽象インターフェース

### 3. データ層 (data/)
- **CurrencyApiRepositoryImpl**: ExchangeRate.host APIの具体的な実装

## 🔧 実装した機能

### 1. 通貨情報取得
- `https://api.exchangerate.host/list` から利用可能通貨リストを取得
- `https://api.exchangerate.host/live` から最新為替レートを取得

### 2. 通貨変換
- 異なる通貨間での金額変換
- 複数費用の一括変換（効率的なAPI呼び出し）
- 小数点2桁での丸め処理

### 3. 精算計算の統合
- 既存の精算ロジックと通貨変換機能の統合
- 指定通貨での統一精算計算
- 端数調整の維持

### 4. UI統合
- **CurrencySelectApi**: APIから取得した通貨リストの選択コンポーネント
- **SettlementSection**: 通貨選択機能付きの精算セクション
- 通貨変換詳細の表示
- エラーハンドリングとローディング状態

### 5. カスタムフック
- **useCurrency**: 通貨リスト管理とキャッシュ
- **useSettlementWithCurrency**: 通貨変換付き精算計算

## ✅ 品質保証

### テスト実装
- **ConvertCurrencyUseCaseTest**: ドメインロジックの包括的テスト
  - 同一通貨での変換なし
  - 異通貨での為替レート取得・変換
  - エラーハンドリング
  - 複数費用の効率的変換
  - API呼び出し最適化の検証

### 型安全性
- TypeScript + Zodによる実行時型チェック
- 全レイヤーでの型安全な実装
- APIレスポンスの型マッピング

### エラーハンドリング
- ネットワークエラー処理
- API通信タイムアウト（10秒）
- ユーザーフレンドリーなエラーメッセージ

## 🔄 設計パターンと原則

### 依存性注入
- リポジトリパターンによる疎結合
- インターフェース分離の原則
- テスタビリティの確保

### レスポンシビリティの分離
- ドメイン: ビジネスロジック
- リポジトリ: データアクセス抽象化
- データ: 外部API通信の具象化

### エラー境界
- 各レイヤーでの適切なエラーハンドリング
- ユーザー体験を損なわないフェイルセーフ

## 🚀 使用方法

### 1. 通貨選択
```typescript
// 利用可能な通貨リストを取得
const currencies = await convertCurrencyUseCase.getAvailableCurrencies();
```

### 2. 単一金額変換
```typescript
// 100 USD を JPY に変換
const result = await convertCurrencyUseCase.convertAmount(100, 'USD', 'JPY');
```

### 3. 精算計算
```typescript
// 指定通貨での精算計算
const result = await settlementUseCase.calculateSettlementsWithCurrency(
  participants, 
  expenses, 
  'USD'
);
```

## 📊 技術的な特徴

### パフォーマンス最適化
- 重複する通貨のAPI呼び出しを集約
- 通貨リストのキャッシング
- 効率的な精算アルゴリズムの維持

### 拡張性
- 新しい為替レートプロバイダーの追加が容易
- ビジネスロジックの変更に対する柔軟性
- UI独立性の確保

### 保守性
- 明確な責務分離
- 包括的なテストカバレッジ
- self-documenting code

## 🎉 次のステップ

1. **キャッシュ戦略の強化**: Redis等を使った為替レートキャッシュ
2. **オフライン対応**: ローカルストレージでの為替レートキャッシュ
3. **リアルタイム更新**: WebSocketによる為替レート自動更新
4. **履歴機能**: 過去の為替レートでの再計算機能

## 📋 実装ファイル一覧

### ドメイン層
- `src/domain/ConvertCurrencyUseCase.ts`
- `src/domain/SettlementUseCase.ts`
- `src/domain/__tests__/ConvertCurrencyUseCase.test.ts`

### リポジトリ層
- `src/repository/CurrencyRepository.ts`

### データ層
- `src/data/CurrencyApiRepositoryImpl.ts`

### UI層
- `src/components/molecules/CurrencySelectApi.tsx`
- `src/components/organisms/SettlementSection.tsx`
- `src/hooks/useCurrency.ts`

### 型定義
- `src/types/index.ts`

この実装により、プロジェクトの設計思想である「シンプルさと表現力」「型安全性の徹底」「開発者体験と所有権」を満たした、保守性と拡張性の高い通貨換算機能が完成しました。
