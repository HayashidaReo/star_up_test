import { z } from 'zod';
import { CURRENCIES } from './constants';

// 参加者スキーマ
export const participantSchema = z.object({
  name: z
    .string()
    .min(1, '参加者名を入力してください')
    .max(50, '参加者名は50文字以内で入力してください')
    .trim()
    .refine((val) => val.length > 0, {
      message: '参加者名を入力してください'
    }),
});

// 費用スキーマ
export const expenseSchema = z.object({
  description: z
    .string()
    .min(1, '内容を入力してください')
    .max(100, '内容は100文字以内で入力してください')
    .trim(),
  amount: z
    .string()
    .min(1, '金額を入力してください')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: '有効な数値を入力してください' },
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num <= 1000000;
      },
      { message: '金額は1,000,000以下で入力してください' },
    ),
  payerId: z.string().min(1, '支払者を選択してください'),
  currency: z
    .string()
    .refine((val) => Object.values(CURRENCIES).includes(val as any), {
      message: '有効な通貨を選択してください',
    }),
});

// フォームデータの型を推論
export type ParticipantFormData = z.infer<typeof participantSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;

// バリデーション関数
export function validateParticipant(data: unknown) {
  return participantSchema.safeParse(data);
}

export function validateExpense(data: unknown) {
  return expenseSchema.safeParse(data);
}

// 個別のバリデーション関数（後方互換性のため）
export function isValidString(value: string): boolean {
  try {
    // 空白のみの文字列は拒否する
    const trimmed = value.trim();
    z.string().min(1).parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

export function isValidNumber(value: string | number): boolean {
  try {
    const schema = z
      .union([z.string(), z.number()])
      .transform((val) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        if (isNaN(num)) throw new Error();
        return num;
      })
      .refine((val) => val > 0); // ゼロより大きい値のみ受け入れる（費用用）

    schema.parse(value);
    return true;
  } catch {
    return false;
  }
}

// 一般的な数値検証（ゼロを含む）
export function isValidNumberIncludingZero(value: string | number): boolean {
  try {
    const schema = z
      .union([z.string(), z.number()])
      .transform((val) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        if (isNaN(num)) throw new Error();
        return num;
      })
      .refine((val) => val >= 0); // ゼロ以上の値を受け入れる

    schema.parse(value);
    return true;
  } catch {
    return false;
  }
}
