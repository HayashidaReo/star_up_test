# Docker Secrets セットアップガイド 🔐

このプロジェクトでは、APIキーなどの機密情報を安全に管理するためにDocker Secretsを使用しています。

## 🚨 なぜARGとENVは機密情報に不適切なのか

### ARG（ビルド引数）の問題
- `docker history` コマンドでビルド履歴を確認すると、ARGの値が平文で表示される
- ビルドキャッシュに機密情報が残る
- イメージを配布した際に機密情報が漏洩するリスク

### ENV（環境変数）の問題  
- `docker inspect` コマンドでコンテナの詳細を確認すると、ENVの値が見える
- 実行中のコンテナから環境変数が読み取り可能
- プロセスリストなどから値が漏洩する可能性

## ✅ Docker Secretsを使用した安全な解決策

### 1. シークレットファイルの作成

```bash
# APIキーを secure ファイルに保存
echo "your_actual_api_key_here" > secrets/exchangerate_api_key.txt
```

⚠️ **重要**: `secrets/` ディレクトリは `.gitignore` に追加済みです。Gitにコミットされることはありません。

### 2. Docker Composeでの使用

```yaml
services:
  dev:
    secrets:
      - exchangerate_api_key
    # ... その他の設定

secrets:
  exchangerate_api_key:
    file: ./secrets/exchangerate_api_key.txt
```

### 3. Dockerfileでのシークレット処理

```dockerfile
# ビルド時の一時的なシークレットマウント（ビルドレイヤーに残らない）
RUN --mount=type=secret,id=exchangerate_api_key \
  EXCHANGERATE_API_KEY=$(cat /run/secrets/exchangerate_api_key 2>/dev/null || echo "") \
  npm run build

# 実行時のシークレット読み込み
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
```

### 4. 実行方法

```bash
# 開発環境
docker compose up dev

# 本番環境
docker compose up prod
```

## 🛡️ セキュリティ上の利点

1. **ビルドキャッシュに残らない**: `--mount=type=secret`を使用することで、シークレットはビルドレイヤーに保存されません

2. **イメージに含まれない**: 最終的なDockerイメージにAPIキーは含まれません

3. **実行時のみアクセス可能**: シークレットは実行時に `/run/secrets/` にマウントされ、コンテナ終了後は自動的に削除されます

4. **アクセス制御**: Dockerのシークレット機能により、適切な権限管理が行われます

## 🔧 トラブルシューティング

### シークレットファイルが見つからない場合
```bash
# ファイルが存在するか確認
ls -la secrets/

# 内容を確認（デバッグ時のみ）
cat secrets/exchangerate_api_key.txt
```

### コンテナ内でのデバッグ
```bash
# コンテナ内のシークレット確認
docker exec -it <container_id> ls -la /run/secrets/

# 環境変数の確認
docker exec -it <container_id> printenv | grep EXCHANGERATE
```

## 📝 チェックリスト

- [ ] `secrets/exchangerate_api_key.txt` にAPIキーを設定
- [ ] `.gitignore` で `secrets/` ディレクトリを除外
- [ ] `docker compose up` でコンテナが正常に起動
- [ ] アプリケーションでAPIキーが正常に読み込まれる

これらの手順により、APIキーは安全に管理され、意図しない漏洩を防ぐことができます。
