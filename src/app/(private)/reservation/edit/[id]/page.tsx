'use server';

import TopPage from '@/components/Top';
import { getOwnReservation } from '@/lib/getOwnReservation';
import { TopPageProps } from '@/types';

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const idNum = Number(id);
  const today = new Date().toLocaleDateString('sv-SE');

  const reservation = await getOwnReservation<TopPageProps>(
    idNum,
    `
        id,
        reserv_date,
        reserv_time_st,
        reserv_time_ed,
        version,
        is_free,
        courses (
          id,
          name
        ),
        stylists (
          id,
          name
        )
      `,
    (query) => query.gte('reserv_date', today),
  );

  return <TopPage reservation={reservation} mode="edit" />;
}
