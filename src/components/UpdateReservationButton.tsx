'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UpdateReseervationButton } from '@/types';

export default function UpdateReservationButton({
  isSelect,
  id,
  courseId,
  stylistId,
  selectedDate,
  selectedTime,
  UpdateReservationButtonClick,
}: UpdateReseervationButton) {
  const router = useRouter();

  const handleCheck = async () => {
    //編集時の選択状態をグローバル状態にセットする
    UpdateReservationButtonClick();
    console.log('stylistId:', stylistId);

    // スタイリストIDがある場合URLに含める
    if (stylistId) {
      console.log('push前', {
        id,
        courseId,
        stylistId,
        selectedDate,
        selectedTime,
      });
      router.push(
        // `/updateReservation/${id}?courseId=${courseId}&stylistId=${stylistId}&date=${selectedDate}&time=${selectedTime}`,
        `/updateReservation/${id}`,
      );
    } else {
      console.log('push前', {
        id,
        courseId,
        selectedDate,
        selectedTime,
      });
      router.push(
        // `/updateReservation/${id}?courseId=${courseId}&date=${selectedDate}&time=${selectedTime}`,
        `/updateReservation/${id}`,
      );
    }
  };

  console.log('props1', {
    courseId,
    stylistId,
    selectedDate,
    selectedTime,
  });

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
