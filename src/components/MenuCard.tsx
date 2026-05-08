'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { login } from '@/app/(auth)/login/actions';
import { logout } from '@/app/(auth)/logout/action';
import { useRouter } from 'next/navigation';

export default function MenuCard() {
  const router = useRouter();
  const reservCheck = () => {
    router.push('/reservation/confirm');
  };

  return (
    <div>
      <Card className="">
        <CardContent>
          <form
            className="hover:bg-accent transition-colors duration-200 cursor-pointer"
            action={login}
          >
            <button>ログイン</button>
          </form>
          <button
            onClick={() => reservCheck()}
            className="hover:bg-accent transition-colors duration-200 cursor-pointer"
          >
            予約確認・変更
          </button>
          <form
            className="hover:bg-accent transition-colors duration-200 cursor-pointer"
            action={logout}
          >
            <button>ログアウト</button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
