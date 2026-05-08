import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="max-w-screen-md">
        <div>予約システム</div>
        <div className="">
          <div className="">
            <Link href={'/top'}>ご予約はこちら</Link>
          </div>
        </div>
      </div>
    </>
  );
}
