# 開発(dev)ステージ
FROM node:22-alpine AS development
WORKDIR /app

# 環境変数の引数を定義
ARG EXCHANGERATE_API_KEY
ENV EXCHANGERATE_API_KEY=$EXCHANGERATE_API_KEY

COPY package*.json ./
RUN npm install
COPY . .
# 開発サーバーを起動
CMD ["npm", "run", "dev"]

# 本番(prod)ステージ
FROM node:22-alpine AS production
WORKDIR /app

# 環境変数の引数を定義
ARG EXCHANGERATE_API_KEY
ENV EXCHANGERATE_API_KEY=$EXCHANGERATE_API_KEY

COPY package*.json ./
# devDependenciesを除いてインストール
RUN npm install --omit=dev
COPY . .
RUN npm run build
# 本番サーバーを起動
CMD ["npm", "start"]