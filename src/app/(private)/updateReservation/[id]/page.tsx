'use server';

import UpdateReservationClient from '@/components/UpdateReservationClient';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  return <UpdateReservationClient id={id} />;
}
