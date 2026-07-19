'use client';

import { Card, CardContent } from './ui/card';
import { login } from '@/app/(auth)/login/actions';
import { logout } from '@/app/(auth)/logout/action';
import { useRouter } from 'next/navigation';
import FormSubmitButton from './FormSubmitButton';

type Props = {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MenuCard({ setMenuOpen }: Props) {
  const router = useRouter();
  const reservCheck = () => {
    router.push('/reservation/confirm');
  };

  return (
    <div>
      <Card className="">
        <CardContent>
          <form action={login}>
            <FormSubmitButton
              pendingText="ログイン中..."
              className="hover:bg-accent transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ログイン
            </FormSubmitButton>
          </form>
          <button
            onClick={() => {
              setMenuOpen(false);
              reservCheck();
            }}
            className="hover:bg-accent transition-colors duration-200 cursor-pointer"
          >
            予約確認・変更
          </button>
          <form action={logout}>
            <FormSubmitButton
              pendingText="ログアウト中..."
              className="hover:bg-accent transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ログアウト
            </FormSubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
