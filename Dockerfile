# 開発(dev)ステージ
FROM node:22-alpine AS development
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Entrypointスクリプトをコピー
COPY scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Entrypointを設定してシークレットから環境変数を読み込み
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# 開発サーバーを起動
CMD ["npm", "run", "dev"]

# 本番(prod)ステージ
FROM node:22-alpine AS production
WORKDIR /app

COPY package*.json ./
# devDependenciesを除いてインストール
RUN npm install --omit=dev
COPY . .

# ビルド用の一時的な環境変数設定とビルド実行
# シークレットはビルドレイヤーに残らない
RUN --mount=type=secret,id=exchangerate_api_key \
  EXCHANGERATE_API_KEY=$(cat /run/secrets/exchangerate_api_key 2>/dev/null || echo "") \
  npm run build

# Entrypointスクリプトをコピー
COPY scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Entrypointを設定してシークレットから環境変数を読み込み
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# 本番サーバーを起動
CMD ["npm", "start"]