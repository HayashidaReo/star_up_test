#!/bin/sh

# Docker Secretsから環境変数を設定するスクリプト

# ExchangeRate APIキーをセット
if [ -f /run/secrets/exchangerate_api_key ]; then
  export EXCHANGERATE_API_KEY=$(cat /run/secrets/exchangerate_api_key)
  echo "✅ ExchangeRate APIキーが設定されました"
else
  echo "⚠️  ExchangeRate APIキーのシークレットが見つかりません"
fi

# 引数で渡されたコマンドを実行
exec "$@"
