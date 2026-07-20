import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReserveButton from './ReserveButton';

// next/navigationのuseRouterを偽物に差し替える
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('ReserveButton', () => {
  beforeEach(() => {
    mockPush.mockClear(); // 前のテストの呼び出し履歴をリセット
  });

  it('選択済みの状態でクリックすると/reservationへ遷移する', async () => {
    const user = userEvent.setup();
    render(
      <ReserveButton
        isSelect={true}
        courseId="1"
        stylistId={null}
        selectedDate="2026-07-20"
        selectedTime="11:00"
      />,
    );

    await user.click(screen.getByRole('button', { name: '予約する' }));

    expect(mockPush).toHaveBeenCalledWith('/reservation');
  });

  it('未選択の状態ではボタンが無効化されている', () => {
    render(
      <ReserveButton
        isSelect={false}
        courseId={null}
        stylistId={null}
        selectedDate={null}
        selectedTime={null}
      />,
    );

    expect(screen.getByRole('button', { name: '予約する' })).toBeDisabled();
  });
});
