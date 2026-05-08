'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { ReserveButtonProps } from '@/types';

export default function ReserveButton({
  isSelect,
  courseId,
  stylistId,
  selectedDate,
  selectedTime,
}: ReserveButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleCheck = async () => {
    // const { data } = await supabase.auth.getUser();

    // if (!data.user) {
    //   router.push('/login');
    //   return;
    // }

    console.log('stylistId:', stylistId);

    // スタイリストIDがある場合URLに含める
    if (stylistId) {
      console.log('push前', {
        courseId,
        stylistId,
        selectedDate,
        selectedTime,
      });
      router.push(
        `/reservation?courseId=${courseId}&stylistId=${stylistId}&date=${selectedDate}&time=${selectedTime}`,
      );
    } else {
      console.log('push前', {
        courseId,
        selectedDate,
        selectedTime,
      });
      router.push(
        `/reservation?courseId=${courseId}&date=${selectedDate}&time=${selectedTime}`,
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
        予約する
      </button>
    </div>
  );
}
