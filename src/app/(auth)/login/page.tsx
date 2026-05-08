import React from 'react';
import { login } from './actions';
import Image from 'next/image';

type Props = {
  searchParams: {
    next?: string;
  };
};

export default function LoginPage({ searchParams }: Props) {
  const next = searchParams.next;
  return (
    <form className="min-h-screen pt-5 pl-5">
      <div className="w-full max-w-md">
        <h1 className="text-lg font-semibold mb-6">
          予約するにはログインしてください
        </h1>

        <button
          formAction={login.bind(null, next)}
          className="flex items-center gap-3 border rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50"
        >
          <Image src="/images/g-logo.png" alt="google" width={20} height={20} />
          <span>Googleでログイン</span>
        </button>
      </div>
    </form>
  );
}
