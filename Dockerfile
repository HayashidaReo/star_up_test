# ベースとなるNode.jsイメージを選択
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションのコードをコピー
COPY . .

# Next.jsアプリをビルド
RUN npm run build

# アプリケーションを実行
CMD ["npm", "start"]