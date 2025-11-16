# インシデントレポート

| 項目        | 内容                                           |
| --------- | -------------------------------------------- |
| **エラー名**  | JSON SyntaxError (JSONパースエラー)                |
| **発生環境**  | Next.js 16.0.1 (Frontend) + Go/Gin (Backend) + Docker |
| **メッセージ** | `Unexpected non-whitespace character after JSON at position 4 (line 1 column 5)` |
| **原因**    | バックエンドDockerコンテナが古いコードで動作しており、新規追加した `/api/v1/users/me/posts` エンドポイントが存在せず404エラーを返していた。フロントエンドがHTMLエラーページをJSONとしてパースしようとして失敗。 |
| **解決方法**  | `docker compose down` でコンテナを停止後、`docker compose up --build -d` で新しいコードを反映してコンテナを再ビルド・再起動 |
| **備考**    | 再現頻度：高（コード変更後にコンテナ再ビルドを忘れた場合） / 今後はバックエンドコード変更時は必ず `--build` オプションで再ビルドすること |

## 詳細情報

### 発生日時
2025年11月12日

### エラーの流れ
1. フロントエンド: `apiClient.getUserPosts()` を呼び出し
2. バックエンド: `/api/v1/users/me/posts` エンドポイントが存在しないため **404 Not Found** を返す
3. レスponse: HTMLエラーページ（"404 ..." で始まる文字列）が返される
4. フロントエンド: `response.json()` でHTMLをJSONとしてパース試行
5. ❌ JSONパースエラー発生

### ログからの確認
```
[GIN] 2025/11/12 - 09:39:25 | 404 | GET "/api/v1/users/me/posts"
```

404エラーが返されていることが確認できた。

### 解決後の確認
```
[GIN] 2025/11/12 - 10:46:18 | 401 | GET "/api/v1/users/me/posts"
```

再ビルド後は **401 Unauthorized** が返されるようになり、エンドポイントが正常に存在することを確認。

### 予防策
- バックエンドのコードを変更した場合は必ず以下を実行する：
  ```bash
  docker compose down
  docker compose up --build -d
  ```
- または Makefile に `make rebuild` コマンドを追加して手順を簡略化
- CI/CD パイプラインでは常に `--build` オプションを使用

### 関連ファイル
- `frontend/src/lib/api.ts` (getUserPosts メソッド)
- `backend/internal/handler/user_handler.go` (GetMyPosts ハンドラー)
- `backend/internal/handler/router.go` (エンドポイント登録)
- `docker-compose.yml`
