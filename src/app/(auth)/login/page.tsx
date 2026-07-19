import React from 'react';
import { login } from './actions';
import Image from 'next/image';
import FormSubmitButton from '@/components/FormSubmitButton';

type Props = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <form className="min-h-screen pt-5 pl-5" action={login}>
      <div className="w-full max-w-md">
        <h1 className="text-lg font-semibold mb-6">
          操作にはログインが必要です
        </h1>

        <input
          type="hidden"
          name="redirectTo"
          value={params.redirectTo ?? ''}
        />

        <FormSubmitButton
          pendingText="ログイン中..."
          className="flex items-center gap-3 border rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src="/images/g-logo.png" alt="google" width={20} height={20} />
          <span>Googleでログイン</span>
        </FormSubmitButton>
      </div>
    </form>
  );
}
