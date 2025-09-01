# 割り勘精算アプリ プロンプト設計書

## 1. プロジェクト概要

### プロジェクト名
- 旅行費用割り勘精算アプリケーション

### 目的
- 旅行で発生した費用を参加者間で公平に割り勘し、誰が誰にいくら支払うべきかを計算・表示するWebアプリケーションを作成する。データはDBに保存せず、セッション内（ページをリロードするまで）で完結させる。

### 主要機能
- 参加者の追加と削除
- 費用の追加（支払者、金額、内容、通貨）
- 精算結果の表示（合計金額、一人当たりの金額、誰が誰にいくら支払うかのリスト）
- (追加要件) 複数の通貨に対応し、指定の通貨に換算して計算する

---

## 2. 技術スタック

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **UI**: Tailwind CSS, Shadcn/ui
- **状態管理**: Zustand
- **フォーム**: React Hook Form, Zod
- **テスト**: Vitest, React Testing Library, Storybook
- **Node.jsバージョン管理**: Volta

---

## 3. データモデル (TypeScript型定義)

```typescript
// 旅行参加者
interface Participant {
  id: string; // UUID or any unique string
  name: string;
}

// 支払い費用
interface Expense {
  id: string;
  description: string; // 何に使ったか (e.g., "夕食")
  amount: number; // 金額
  payerId: string; // 支払った人のParticipant ID
  currency: 'JPY' | 'USD'; // 対応する通貨
}