import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // グローバルにdescribe, it, expectなどを使えるようにする
    globals: true,

    // ブラウザ環境をシミュレート
    environment: 'jsdom',

    // テストファイルのパターン
    include: ['**/*.test.{ts,tsx}'],

    // セットアップファイルを実行
    setupFiles: ['./__tests__/setup.ts'],

    // カバレッジ設定（オプション）
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '*.config.*',
      ],
    },
  },
  resolve: {
    // TypeScriptのパスエイリアスを解決
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
