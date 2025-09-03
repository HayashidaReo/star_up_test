import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.EXCHANGERATE_API_KEY;
const BASE_URL = 'https://api.exchangerate.host';

/**
 * 為替レート取得API
 * ExchangeRate.host APIをプロキシしてCORS問題を回避
 */
export async function GET(request: NextRequest) {
  try {
    if (!API_KEY) {
      throw new Error('API Key が設定されていません');
    }

    const { searchParams } = new URL(request.url);
    const base = searchParams.get('base') || 'USD';
    const symbols = searchParams.get('symbols');

    // APIリクエストのパラメータを構築
    const params = new URLSearchParams();
    params.set('access_key', API_KEY);
    params.set('source', base);

    if (symbols) {
      params.set('currencies', symbols);
    }

    const response = await fetch(`${BASE_URL}/live?${params.toString()}`, {
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
      throw new Error('為替レートの取得に失敗しました');
    }

    // quotesからratesに変換（USDXXXのプレフィックスを削除）
    const rates: Record<string, number> = {};
    const sourcePrefix = data.source;

    Object.entries(data.quotes).forEach(([pair, rate]) => {
      if (pair.startsWith(sourcePrefix)) {
        const targetCurrency = pair.substring(sourcePrefix.length);
        rates[targetCurrency] = rate as number;
      }
    });

    // APIレスポンスをフロントエンド用に整形
    const exchangeRate = {
      base: data.source,
      date: new Date(data.timestamp * 1000).toISOString().split('T')[0],
      rates,
    };

    return NextResponse.json({
      success: true,
      exchangeRate,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '為替レートの取得に失敗しました';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
