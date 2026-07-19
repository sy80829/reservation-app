import { registerUser } from './actions';

const errorMessages: Record<string, string> = {
  name_required: '名前を入力してください',
  name_too_long: '名前は50文字以内で入力してください',
  tel_invalid: '電話番号の形式が正しくありません（ハイフンなしの数字10〜11桁で入力してください）',
  db_error: '登録に失敗しました。もう一度お試しください',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error
    ? (errorMessages[params.error] ?? '入力内容を確認してください')
    : null;

  return (
    <form action={registerUser}>
      <p className="text-center font-bold text-xl max-w-md mx-auto mt-3 mb-3 bg-white">
        会員登録
      </p>

      {errorMessage && (
        <p className="text-red-500 text-center mb-3">{errorMessage}</p>
      )}

      <div className="grid grid-cols-[auto_1fr] items-center gap-2">
        <input
          type="hidden"
          name="redirectTo"
          value={params.redirectTo ?? ''}
        />

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
          required
          maxLength={50}
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
          type="tel"
          required
          pattern="0[0-9\-]{9,12}"
          placeholder="09012345678"
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
