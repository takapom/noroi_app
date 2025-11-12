import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 簡単なテスト用ボタンコンポーネント
function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white">
      {children}
    </button>
  );
}

describe('Button コンポーネント', () => {
  it('ボタンが正しく表示される', () => {
    // Arrange（準備）
    const handleClick = vi.fn();

    // Act（実行）
    render(<Button onClick={handleClick}>クリック</Button>);

    // Assert（検証）
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('クリック')).toBeInTheDocument();
  });

  it('ボタンをクリックするとonClickが呼ばれる', async () => {
    // Arrange
    const handleClick = vi.fn();
    const user = userEvent.setup();

    // Act
    render(<Button onClick={handleClick}>クリック</Button>);
    await user.click(screen.getByRole('button'));

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('子要素が正しくレンダリングされる', () => {
    // Arrange
    const handleClick = vi.fn();

    // Act
    render(<Button onClick={handleClick}>テストボタン</Button>);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('テストボタン');
  });

  it('複数回クリックすると、その回数分onClickが呼ばれる', async () => {
    // Arrange
    const handleClick = vi.fn();
    const user = userEvent.setup();

    // Act
    render(<Button onClick={handleClick}>クリック</Button>);
    const button = screen.getByRole('button');
    await user.click(button);
    await user.click(button);
    await user.click(button);

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
