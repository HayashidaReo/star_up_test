import { NextResponse } from 'next/server';

const API_KEY = process.env.EXCHANGERATE_API_KEY;
const BASE_URL = 'https://api.exchangerate.host';

/**
 * 通貨リスト取得API
 * ExchangeRate.host APIをプロキシしてCORS問題を回避
 */
export async function GET() {
  try {
    if (!API_KEY) {
      throw new Error('API Key が設定されていません');
    }

    const response = await fetch(`${BASE_URL}/list?access_key=${API_KEY}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // サーバーサイドでは30秒のタイムアウトを設定
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error('通貨リストの取得に失敗しました');
    }

    // APIレスポンスをフロントエンド用に整形
    const currencies = Object.entries(data.currencies).map(
      ([code, description]) => ({
        code,
        description: description as string,
      }),
    );

    return NextResponse.json({
      success: true,
      currencies,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '通貨リストの取得に失敗しました';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
