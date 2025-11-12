# インシデントレポート

| 項目        | 内容                                           |
| --------- | -------------------------------------------- |
| **エラー名**  | Self-Curse Error (自己いいねエラー)                |
| **発生環境**  | Next.js 16.0.1 (Frontend) + Go/Gin (Backend) |
| **メッセージ** | `cannot curse your own post` |
| **原因**    | フロントエンドで自分の投稿かどうかをチェックせずに「怨念」ボタンをクリック可能だったため、バックエンドのビジネスルールエラーがそのままユーザーに表示されていた |
| **解決方法**  | 1. フロントエンドで現在のユーザーIDを取得<br>2. 投稿の `user_id` と比較して自分の投稿か判定<br>3. 自分の投稿の場合は「怨念」ボタンを無効化（視覚的にも明示）<br>4. エラーハンドリングを改善してユーザーフレンドリーなメッセージを表示 |
| **備考**    | 再現頻度：高（自分の投稿にいいねしようとした場合） / バックエンドのビジネスルールは正しいが、UIでの事前チェックが不足していた |

## 詳細情報

### 発生日時
2025年11月12日

### エラーの流れ（修正前）
1. ユーザーが自分の投稿の「怨念」（いいね）ボタンをクリック
2. フロントエンド: `apiClient.cursePost(id)` を呼び出し
3. バックエンド: ビジネスルールにより `cannot curse your own post` エラーを返す
4. フロントエンド: エラーを throw してコンソールに出力
5. ❌ ユーザーには何が起きたのか分からない

### スタックトレース
```
Error: cannot curse your own post
    at ApiClient.handleResponse (src/lib/api.ts:107:13)
    at async ApiClient.cursePost (src/lib/api.ts:235:5)
    at async handleLike (src/components/Timeline.tsx:85:9)
```

### 根本原因
- **バックエンド**: ビジネスルールとして「自己いいね不可」が正しく実装されている ✅
- **フロントエンド**: UIレベルでのバリデーションが不足
  - 自分の投稿でもボタンがクリック可能
  - エラーメッセージがユーザーフレンドリーでない

### 実装した解決策

#### 1. ユーザーIDの取得と判定
```typescript
// Timeline.tsx
const [currentUserId, setCurrentUserId] = useState<string | null>(null);

const loadUserInfo = async () => {
  const profile = await apiClient.getProfile();
  setCurrentUserId(profile.id);
};

// 投稿データに isOwnPost フラグを追加
const transformedPosts = fetchedPosts.map((post: Post) => ({
  // ...
  isOwnPost: currentUserId === post.user_id,
}));
```

#### 2. 事前チェックとエラーメッセージ
```typescript
const handleLike = async (id: string) => {
  const post = posts.find((p) => p.id === id);

  // Prevent cursing own post
  if (post.isOwnPost) {
    setError('自分の投稿に怨念をつけることはできません');
    setTimeout(() => setError(''), 3000);
    return;
  }

  // API呼び出し...
};
```

#### 3. UIでのボタン無効化
```typescript
// CurseCard.tsx
<motion.button
  onClick={() => !post.isOwnPost && onLike(post.id)}
  disabled={post.isOwnPost}
  className={`
    ${
      post.isOwnPost
        ? 'bg-transparent border border-moonlight-800 text-bone-600 cursor-not-allowed opacity-50'
        : // 通常のスタイル
    }
  `}
  whileHover={post.isOwnPost ? {} : { scale: 1.05 }}
>
  🔥 {post.likeCount}
</motion.button>
```

### 修正後の動作
1. ✅ 自分の投稿の「怨念」ボタンは視覚的に無効化される（グレーアウト + opacity: 0.5）
2. ✅ クリックしても何も起こらない（`disabled` 属性）
3. ✅ 万が一クリックされた場合も、フロントエンドで事前チェックしてユーザーフレンドリーなメッセージを表示
4. ✅ バックエンドへの無駄なリクエストを防ぐ

### ベストプラクティス
- **Defense in Depth（多層防御）**: フロントエンドとバックエンドの両方でバリデーション
  - フロントエンド: UX向上、無駄なリクエスト削減
  - バックエンド: セキュリティ、ビジネスルール強制
- **ユーザーフレンドリーなエラーメッセージ**: 技術的なエラーを分かりやすい日本語に変換
- **視覚的フィードバック**: ボタンの無効化で操作不可を明確に示す

### 関連ファイル
- `frontend/src/components/Timeline.tsx` (ユーザー情報取得、事前チェック)
- `frontend/src/components/CurseCard.tsx` (UIボタン無効化)
- `backend/internal/usecase/curse_usecase.go` (バックエンドのビジネスルール)

### 予防策
- 今後、他のアクションボタン（削除、編集など）も同様のパターンで実装
- UIコンポーネントのプロパティに `isOwn` や `canInteract` のようなフラグを追加して、権限チェックを明示的に行う
