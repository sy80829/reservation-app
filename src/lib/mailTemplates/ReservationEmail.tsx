import { getReservationType } from '@/types';
import { Html, Body, Text } from '@react-email/components';

type Props = {
  name: string;
  reservData: getReservationType;
};

export const ReservationEmail = ({ name, reservData }: Props) => (
  <Html>
    <Body>
      <Text>本メールは送信専用です。</Text>

      <Text>{name}様</Text>

      <Text>
        以下の内容でご予約が確定しました。
        <br />
        ご来店をお待ちしております。
      </Text>

      <Text>
        予約内容
        <br />
        日付：{reservData.reserv_date}
        <br />
        時間：{reservData.reserv_time_st}
        <br />
        コース：{reservData.courses.name}
        <br />
        金額：￥{reservData.courses.price}
        <br />
        スタイリスト：{reservData.stylists.name}
      </Text>

      <Text>
        以下ページから予約の確認・変更・キャンセルが行えます。
        <br />
        https://reservation-app-green-nine.vercel.app/reservation/confirm
      </Text>
    </Body>
  </Html>
);
