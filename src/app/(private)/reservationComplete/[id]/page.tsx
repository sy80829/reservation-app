'use server';

import ReservCompleteCard from '@/components/ReservCompleteCard';
import { getOwnReservation } from '@/lib/getOwnReservation';
import { ReservCompleteCardProps } from '@/types';

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = await params;
  const numId = Number(id);

  const data = await getOwnReservation<ReservCompleteCardProps>(
    numId,
    `
    reserv_date,
    reserv_time_st,
    reserv_time_ed,
    courses (
      name,
      duration,
      price
    ),
    stylists (
      name
    )
  `,
  );

  return <ReservCompleteCard reservDetails={data} />;
}
