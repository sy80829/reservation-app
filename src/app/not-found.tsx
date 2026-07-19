import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <p className="text-2xl font-bold">ページが見つかりません</p>
      <p className="text-gray-500 text-center">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/top"
        className="bg-[#EC1C5E] text-white hover:bg-[#d81a55] transition cursor-pointer w-full max-w-xs text-center border rounded-3xl py-2.5 font-bold mt-4"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
