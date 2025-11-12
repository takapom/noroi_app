.PHONY: install install-deps install-dev-deps install-test-deps test test-ui test-coverage help

# すべての依存関係をインストール（本番 + 開発）
install:
	@echo "Installing all dependencies..."
	npm install
	@echo "All dependencies installed successfully!"

# Next.jsの本番依存関係をインストール
install-deps:
	@echo "Installing production dependencies..."
	npm install next react react-dom framer-motion lottie-react react-icons zustand
	@echo "Production dependencies installed successfully!"

# Next.jsの開発依存関係をインストール
install-dev-deps:
	@echo "Installing development dependencies..."
	npm install -D @tailwindcss/postcss tailwindcss @types/node @types/react @types/react-dom typescript eslint eslint-config-next
	@echo "Development dependencies installed successfully!"

# テストライブラリのインストール
install-test-deps:
	@echo "Installing testing libraries..."
	npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react
	@echo "Testing libraries installed successfully!"

# テストの実行
test:
	npm test

# UIモードでテストを実行
test-ui:
	npm run test:ui

# カバレッジ付きでテストを実行
test-coverage:
	npm run test:coverage

# ヘルプメッセージ
help:
	@echo "Available commands:"
	@echo "  make install           - Install all dependencies (npm install)"
	@echo "  make install-deps      - Install production dependencies (Next.js, React, etc.)"
	@echo "  make install-dev-deps  - Install development dependencies (TypeScript, Tailwind, etc.)"
	@echo "  make install-test-deps - Install testing libraries"
	@echo "  make test              - Run tests in watch mode"
	@echo "  make test-ui           - Run tests with UI"
	@echo "  make test-coverage     - Run tests with coverage report"
	@echo "  make help              - Show this help message"
