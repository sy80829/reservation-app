import { registerUser } from './actions';

export default function Page({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = searchParams.next;

  return (
    <form action={registerUser}>
      <p className="text-center text-xl font-bold">会員登録</p>

      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <input type="hidden" name="next" value={next ?? ''} />

        <p>お名前：</p>
        <input className="border" name="name" />

        <p>電話番号：</p>
        <input className="border" name="tel" />
      </div>

      <button
        type="submit"
        className="bg-[#EC1C5E] text-white hover:bg-[#d81a55] transition cursor-pointer w-full md:w-70 border rounded-3xl py-2.5 font-bold text-xl mb-3"
      >
        登録
      </button>
    </form>
  );
}
