'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UpdateReseervationButton } from '@/types';

export default function UpdateReservationButton({
  isSelect,
  id,
  UpdateReservationButtonClick,
}: UpdateReseervationButton) {
  const router = useRouter();

  const handleCheck = async () => {
    //編集時の選択状態をグローバル状態にセットする
    UpdateReservationButtonClick();
    router.push(`/updateReservation/${id}`);
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handleCheck()}
        disabled={!isSelect}
        className={cn(
          'w-full md:w-70 border rounded-3xl py-2.5 font-bold text-xl',
          isSelect
            ? 'bg-[#EC1C5E] text-white hover:bg-[#d81a55] transition cursor-pointer'
            : 'bg-gray-200 opacity-50 cursor-not-allowed',
        )}
      >
        予約を変更する
      </button>
    </div>
  );
}
