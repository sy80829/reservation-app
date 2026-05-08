import { registerUser } from './actions';

export default function Page({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = searchParams.next;

  return (
    <form action={registerUser}>
      <p className="text-center font-bold text-xl max-w-md mx-auto mt-3 mb-3 bg-white">
        会員登録
      </p>

      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <input type="hidden" name="next" value={next ?? ''} />

        <p>お名前：</p>
        <input
          className="
  border
  rounded-lg
  px-3
  py-2
  w-full
"
          name="name"
        />

        <p>電話番号：</p>
        <input
          className="
  border
  rounded-lg
  px-3
  py-2
  w-full
"
          name="tel"
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-[#EC1C5E] text-white hover:bg-[#d81a55] transition cursor-pointer w-full md:w-70 border rounded-3xl py-2.5 font-bold text-xl mb-3 mt-3"
        >
          登録
        </button>
      </div>
    </form>
  );
}
