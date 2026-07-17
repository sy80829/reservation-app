'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ReserveButtonProps } from '@/types';
import { useNewReservationDataStore } from '@/atoms/newReservationDataState';

export default function ReserveButton({
  isSelect,
  courseId,
  stylistId,
  selectedDate,
  selectedTime,
}: ReserveButtonProps) {
  const router = useRouter();
  const { setNewReservationData } = useNewReservationDataStore();

  const handleCheck = async () => {
    setNewReservationData({
      courseId,
      stylistId,
      date: selectedDate,
      time: selectedTime,
    });
    router.push('/reservation');
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
        予約する
      </button>
    </div>
  );
}
