'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <p className="text-2xl font-bold">問題が発生しました</p>
      <p className="text-gray-500 text-center">
        一時的な不具合の可能性があります。もう一度お試しください。
      </p>
      <div className="flex flex-col gap-3 mt-4 w-full max-w-xs">
        <button
          onClick={() => reset()}
          className="bg-[#EC1C5E] text-white hover:bg-[#d81a55] transition cursor-pointer w-full border rounded-3xl py-2.5 font-bold"
        >
          もう一度試す
        </button>
        <button
          onClick={() => router.push('/top')}
          className="bg-[#F3F4F6] text-black hover:bg-[#e4d9d9] transition cursor-pointer w-full border rounded-3xl py-2.5 font-bold"
        >
          トップへ戻る
        </button>
      </div>
    </div>
  );
}
