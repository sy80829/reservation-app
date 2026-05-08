import { render } from '@react-email/render';
import { Resend } from 'resend';
import { ReservationEmail } from '@/lib/mailTemplates/ReservationEmail';
import { getReservationType } from '@/types';
import { CancelReservationEmail } from './mailTemplates/CancelReservationEmail';
import { UpdateReservationEmail } from './mailTemplates/UpdateReservationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail({
  type,
  email,
  name,
  reservData,
}: {
  type: 'reservation' | 'update' | 'cancel';
  email: string;
  name: string;
  reservData: getReservationType;
}) {
  let subject = '';
  let html = '';

  if (type === 'reservation') {
    subject = '予約が確定しました';
    html = await render(
      <ReservationEmail name={name} reservData={reservData} />,
    );
  } else if (type === 'update') {
    subject = '予約が変更されました';
    html = await render(
      <UpdateReservationEmail name={name} reservData={reservData} />,
    );
  } else if (type === 'cancel') {
    subject = '予約がキャンセルされました';
    html = await render(
      <CancelReservationEmail name={name} reservData={reservData} />,
    );
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject,
      html,
    });
  } catch (e) {
    console.error(e);
  }
}
