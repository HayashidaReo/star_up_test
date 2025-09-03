#!/bin/sh

# Docker Secretsから環境変数を設定するスクリプト

# ExchangeRate APIキーをセット
if [ -f /run/secrets/exchangerate_api_key ]; then
  export EXCHANGERATE_API_KEY=$(cat /run/secrets/exchangerate_api_key)
  echo "✅ ExchangeRate APIキーがシークレットから設定されました"
elif [ -f .env ]; then
  # .envファイルから環境変数を読み込み
  . ./.env
  echo "✅ ExchangeRate APIキーが.envから設定されました"
elif [ -n "$EXCHANGERATE_API_KEY" ]; then
  echo "✅ ExchangeRate APIキーが既に環境変数に設定されています"
else
  echo "⚠️  ExchangeRate APIキーが設定されていません（開発/テスト環境）"
  export EXCHANGERATE_API_KEY="test_api_key_for_development"
fi

# デバッグ情報（APIキーの先頭部分のみ表示）
if [ -n "$EXCHANGERATE_API_KEY" ]; then
  echo "API Key設定確認: ${EXCHANGERATE_API_KEY:0:8}..."
fi

# 引数で渡されたコマンドを実行
exec "$@"
