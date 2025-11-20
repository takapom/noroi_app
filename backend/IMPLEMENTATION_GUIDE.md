# 呪癖スタイル実装ガイド

## 概要
「呪癖（じゅへき）」アプリにゴシックホラーテーマの呪癖スタイルシステムを実装しました。西洋の古い教会、廃墟、魔導書のモチーフを活かした装飾的なデザインです。

## コンポーネント構成

### 1. RitualStyleBadge.tsx
呪癖スタイルを表示するバッジコンポーネント

#### 特徴
- **3つの表示バリアント**
  - `icon`: アバター上の小さなインジケーター
  - `compact`: タイムライン用のコンパクト表示（デフォルト）
  - `full`: プロフィール用の詳細表示

- **5つの呪癖スタイル**
  ```typescript
  type RitualStyle =
    | 'infernal_rite'    // 炎獄の儀式
    | 'frozen_curse'     // 氷結の呪縛
    | 'shadow_whisper'   // 闇夜の囁き
    | 'blood_pact'       // 血盟の刻印
    | 'danse_macabre';   // 骸骨の舞踏
  ```

#### デザイン要素
- **Gothic装飾文字**: ✠, †, ☨, ✝, ☦
- **グラデーション背景**: 各スタイル固有の色
- **グロー効果**: ホバー時の発光演出
- **アニメーション**: 浮遊する装飾文字、光の走る効果

### 2. CurseCard_updated.tsx
呪癖スタイルを統合した投稿カードコンポーネント

#### 統合方法
```tsx
interface CursePost {
  // ... 既存のプロパティ
  ritualStyle?: RitualStyle; // 追加
}
```

#### 表示位置
1. **アバター右下**: アイコンバリアント
2. **ユーザー名下**: コンパクトバリアント
3. **右上コーナー**: 装飾的なシンボル

### 3. RitualStyleSelector.tsx
ユーザーが呪癖スタイルを選択するためのコンポーネント

#### 表示バリアント
- `grid`: 3列グリッド表示（デスクトップ向け）
- `list`: リスト表示（モバイル向け）
- `carousel`: カルーセル表示（未実装、将来の拡張用）

## 実装手順

### ステップ1: コンポーネントファイルの配置
```bash
# frontendディレクトリのcomponentsフォルダに移動
mv /Users/takagiyuuki/noroi_app/backend/RitualStyleBadge.tsx \
   /Users/takagiyuuki/noroi_app/frontend/src/components/

mv /Users/takagiyuuki/noroi_app/backend/RitualStyleSelector.tsx \
   /Users/takagiyuuki/noroi_app/frontend/src/components/
```

### ステップ2: CurseCardコンポーネントの更新
```tsx
// CurseCard.tsxを更新版に置き換え
// CurseCard_updated.tsxの内容をCurseCard.tsxにコピー
```

### ステップ3: データモデルの更新
バックエンドAPIで`ritualStyle`フィールドを追加：

```typescript
// backend側の投稿モデル
interface Post {
  // ... 既存フィールド
  ritual_style?: 'infernal_rite' | 'frozen_curse' | 'shadow_whisper' | 'blood_pact' | 'danse_macabre';
}
```

### ステップ4: ユーザープロフィール設定画面での統合
```tsx
import RitualStyleSelector from '@/components/RitualStyleSelector';

function ProfileSettings() {
  const [selectedStyle, setSelectedStyle] = useState<RitualStyle | null>(null);

  return (
    <RitualStyleSelector
      selectedStyle={selectedStyle}
      onStyleSelect={setSelectedStyle}
      variant="grid"
    />
  );
}
```

## スタイリングの詳細

### カラーマッピング
| スタイル | プライマリカラー | セカンダリカラー | グロー効果 |
|---------|----------------|-----------------|-----------|
| 炎獄の儀式 | bloodstain-700→900 | bloodstain-500 | 赤い光 |
| 氷結の呪縛 | moonlight-600→800 | moonlight-400 | 銀白の光 |
| 闇夜の囁き | abyss-800→950 | bone-600 | 漆黒の影 |
| 血盟の刻印 | bloodstain-800→abyss-900 | bloodstain-600 | 血の光 |
| 骸骨の舞踏 | bone-500→abyss-800 | bone-300 | 骨白の光 |

### フォント使用
- **font-mystical**: メインのスタイル名表示（IM Fell English）
- **font-accent**: ラテン語表記（UnifrakturMaguntia）
- **font-body**: 説明文（Noto Serif JP）

## パフォーマンス最適化

### アニメーションの制御
```tsx
// animate propでアニメーションのON/OFF制御
<RitualStyleBadge
  style={post.ritualStyle}
  animate={isHovered} // ホバー時のみアニメーション
/>
```

### 遅延読み込み
```tsx
// 必要に応じて動的インポート
const RitualStyleSelector = dynamic(
  () => import('@/components/RitualStyleSelector'),
  { ssr: false }
);
```

## 拡張可能性

### 新しいスタイルの追加
`ritualStyles`オブジェクトに新しいエントリを追加：
```typescript
new_style: {
  name: '新スタイル名',
  latinName: 'Novus Ritus',
  symbol: '🌙',
  primaryColor: 'from-color-start to-color-end',
  secondaryColor: 'text-color',
  glowColor: 'shadow-[0_0_10px_rgba(r,g,b,a)]',
  decorativeChar: '✤'
}
```

### カスタマイズポイント
1. **アニメーション速度**: transitionのduration値
2. **装飾文字**: decorativeCharの変更
3. **グロー強度**: shadow値のopacity調整
4. **コーナー装飾**: border幅とopacityの調整

## テストケース

### 表示テスト
- [ ] 5つすべてのスタイルが正しく表示される
- [ ] ラテン語と日本語の切り替えが機能する
- [ ] 各バリアント（icon/compact/full）が正しく表示される

### インタラクションテスト
- [ ] ホバー時のアニメーションが動作する
- [ ] 選択状態が正しく反映される
- [ ] レスポンシブデザインが機能する

### パフォーマンステスト
- [ ] 大量の投稿でもスムーズにスクロールする
- [ ] アニメーションがカクつかない
- [ ] メモリリークが発生しない

## トラブルシューティング

### フォントが表示されない場合
```css
/* globals.cssに以下を追加 */
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');
@import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap');
```

### カラーが反映されない場合
Tailwind CSSの設定でカスタムカラーが定義されているか確認：
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      abyss: { /* ... */ },
      bloodstain: { /* ... */ },
      bone: { /* ... */ },
      moonlight: { /* ... */ }
    }
  }
}
```

## まとめ
このシステムは、ゴシックホラーの世界観を維持しながら、ユーザーの個性を表現できる呪癖スタイル機能を提供します。装飾的なフォント、Gothic ornamental characters、そして各スタイル固有の色とアニメーションにより、没入感のある体験を創出します。