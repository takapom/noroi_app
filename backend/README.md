# 呪癖 (JUHEKI) Backend

## 概要
呪癖（じゅへき）のバックエンドAPI。Go + PostgreSQLで構築されたクリーンアーキテクチャベースのアプリケーション。

## 技術スタック
- **言語**: Go 1.21
- **データベース**: PostgreSQL 17
- **アーキテクチャ**: Clean Architecture + DDD
- **認証**: JWT
- **コンテナ**: Docker + Docker Compose

## ディレクトリ構造
```
backend/
├── cmd/
│   └── api/              # エントリーポイント
├── internal/
│   ├── domain/           # ドメイン層
│   │   ├── entity/       # エンティティ
│   │   └── value/        # 値オブジェクト
│   ├── usecase/          # ユースケース層
│   ├── repository/       # リポジトリインターフェース
│   └── infrastructure/   # インフラ層
│       ├── db/           # DB接続
│       └── repository/   # リポジトリ実装
├── migrations/           # DBマイグレーション
└── pkg/                  # 共通パッケージ
    ├── errors/           # エラー定義
    ├── jwt/              # JWT処理
    └── validator/        # バリデーション
```

## セットアップ

### 前提条件
- Docker & Docker Compose
- Go 1.21+ (ローカル開発の場合)

### 環境変数
`.env.example`をコピーして`.env`を作成：
```bash
cp .env.example .env
```

### Docker で起動

```bash
# すべてのサービスを起動（DB + マイグレーション + API）
make docker-up

# ログを確認
make docker-logs

# 停止
make docker-down
```

### ローカル開発

```bash
# 依存関係のダウンロード
make mod-download

# ビルド
make build

# 実行
make run
```

## マイグレーション

```bash
# マイグレーションを実行
make migrate-up

# ロールバック
make migrate-down

# 新しいマイグレーションファイルを作成
make migrate-create name=add_some_table
```

## API エンドポイント

### ヘルスチェック
```
GET /health
```

（その他のエンドポイントは実装後に追記）

## ドメインモデル

### エンティティ
- **User**: ユーザー
- **CurseStyle**: 呪癖スタイル
- **Post**: 投稿（通常/イベント）
- **Curse**: 怨念（いいね）
- **Ritual**: 儀式
- **RitualParticipant**: 儀式参加者
- **Ranking**: ランキング

### 主要なビジネスルール
- 投稿は10-300文字
- 怨念は1投稿1回のみ
- 儀式は毎日2:00-3:00、HP 300,000
- ダメージ: 投稿1000、怨念1000、クリティカル10%で2倍
- ランキングは2時間毎更新、毎週月曜リセット

## テスト

```bash
make test
```

## トラブルシューティング

### DockerのPostgreSQLバージョン不整合

症状: `database files are incompatible with server` と表示され、`detail: The data directory was initialized by PostgreSQL version 17, which is not compatible with this version 15.14.` のようなログが出てDBコンテナが停止する。

原因: `postgres_data` ボリュームに PostgreSQL 17 で初期化されたデータが残ったまま、より古いPostgreSQLイメージ（例: 15系）を起動すると発生する。コンテナを削除してもボリュームは残るので、バージョンを下げるとこの不整合が起きる。

対処:
1. 既存データが不要なら `docker compose down -v` でボリュームごと削除し、`docker compose up` で再作成する。
2. データを保持したい場合は `docker-compose.yml` の `db` サービスの `image` を `postgres:17-alpine`（このリポジトリのデフォルト）など、既存データと同じバージョンに合わせる。

再起動後に `make docker-logs` で正常に起動していることを確認する。

## ライセンス
Proprietary
