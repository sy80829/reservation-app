'use client';

import StaffSelectDrawer from '@/components/StaffSelectDrawer';
import CourseCard from '@/components/CourseCard';
import type {
  CourseCardType,
  reservCalendar,
  stylistsType,
  TopPageProps,
} from '@/types';
import { useEffect, useState } from 'react';
import CalendarCard from '@/components/CalendarCard';
import useEmblaCarousel from 'embla-carousel-react';
import { X } from 'lucide-react';
import ReserveButton from '@/components/ReserveButton';
import { useRouter } from 'next/navigation';
import UpdateReservationButton from './UpdateReservationButton';
import { useEditReservationDataStore } from '@/atoms/editReservationDataState';

type Props = {
  reservation?: TopPageProps;
  mode?: string;
  error?: string;
};

export default function TopPage({ reservation, mode, error }: Props) {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseCardType[]>([]); //コース
  const [selectedCurseId, setSelectedCurseId] = useState<string | null>(null); // 選択中のコース
  const [stylists, setStylists] = useState<stylistsType[]>([]); //スタイリスト
  const [selectedStylist, setselectedStylist] = useState<string | null>(null); //選択中のスタイリスト
  const [selectedDate, setSelectedDate] = useState<string | null>(null); //選択中の日付
  const [selectedTime, setSelectedTime] = useState<string | null>(null); //選択中の時間
  const [reservCalendar, setRservCalendar] = useState<reservCalendar[]>([]);
  const [open, setOpen] = useState(false); //スタイリストモーダル状態
  const excludeId = mode === 'edit' ? reservation?.id : null; //予約変更画面
  const { setEditReservationData } = useEditReservationDataStore(); //予約編集時のデータ状態

  useEffect(() => {
    //予約確認ぺージから遷移したときの初期表示
    if (reservation) {
      setSelectedCurseId(String(reservation.courses.id));
      setselectedStylist(String(reservation.stylists.id));
      setSelectedDate(reservation.reserv_date);
      setSelectedTime(reservation.reserv_time_st.slice(0, 5));
      //フリー予約の場合スタイリストidは非選択状態にする
      if (reservation.is_free) {
        setselectedStylist(null);
      } else {
        setselectedStylist(String(reservation.stylists.id));
      }
    }
  }, [reservation]);

  //Embla初期化
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
  });
  //コース取得
  const fetchCourse = async () => {
    try {
      const res = await fetch('/api/course'); //APIを呼び出す
      const data = await res.json(); //JSON文字列 → JavaScriptオブジェクトに戻す
      setCourses(
        data.courses.map((s: any) => ({
          ...s,
          id: String(s.id),
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };
  //スタイリスト取得
  const fetchStylist = async () => {
    try {
      const res = await fetch('/api/stylist'); //APIを呼び出す
      const data = await res.json(); //JSON文字列 → JavaScriptオブジェクトに戻す

      console.log('APIレスポンス', data); // ←追加

      setStylists(
        data.stylists.map((s: any) => ({
          ...s,
          id: String(s.id),
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };
  //予約カレンダー取得
  const fetchCalendar = async () => {
    try {
      const res = await fetch(
        `/api/calendar?course_id=${selectedCurseId}&stylist_id=${selectedStylist}&excludeId=${excludeId}`,
      );
      const data: reservCalendar[] = await res.json(); //JSON文字列 → JavaScriptオブジェクトに戻す

      setRservCalendar(data);
    } catch (error) {
      console.error(error);
    }
  };

  //コース、スタイリスト取得
  useEffect(() => {
    fetchCourse();
    fetchStylist();
  }, []);

  // ユーザー操作だけリセット
  const handleCourseSelect = (id: string) => {
    setSelectedCurseId(id);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  //コースが変わるたび日付と時間をリセット
  useEffect(() => {
    fetchCalendar();
  }, [selectedCurseId, selectedStylist]);

  //スタイリスト選択時発火
  const handleStylistSelect = (id: string) => {
    setselectedStylist(id);
    setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  const selectedStylistData = stylists.find((s) => s.id === selectedStylist);

  const UpdateReservationButtonClick = () => {
    setEditReservationData({
      version: reservation?.version,
      date: selectedDate,
      time: selectedTime,
      courseId: selectedCurseId,
      stylistId: selectedStylist,
    });
  };

  if (courses.length === 0) {
    return <p>読み込み中...</p>;
  }

  return (
    <>
      {error === 'already_reserved' && (
        <div className="text-red-500">既に予約済みのため予約できません。</div>
      )}
      {error === 'invalid_operation' && (
        <div className="text-red-500">予期せぬエラーが発生しました</div>
      )}
      <div>
        {mode === 'edit' && (
          <div className="text-center">
            <div className="font-bold text-2xl pt-2">予約変更ページ</div>
            <div className=" text-blue-600">
              現在の予約：{reservation?.reserv_date}{' '}
              {reservation?.reserv_time_st}~{reservation?.reserv_time_ed}{' '}
              {reservation?.courses.name} ({reservation?.stylists.name})
            </div>
          </div>
        )}
        <div className="font-bold text-2xl pt-5 pb-5">コース</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSelected={course.id === selectedCurseId}
              onSelect={() => handleCourseSelect(course.id)}
            />
          ))}
        </div>
      </div>
      <div className="flex pt-5 gap-4">
        {/* <div className="pt-5 text-2xl pb-5 font-bold">空き状況</div> */}
        <div className="text-2xl font-bold">空き状況</div>
        <div className="flex gap-4">
          <div>
            <StaffSelectDrawer
              stylists={stylists}
              selectedStylist={selectedStylist}
              setOpen={setOpen}
              open={open}
              onSelect={handleStylistSelect}
            />
          </div>
          {selectedStylistData && (
            <div className="flex items-center gap-2">
              <img src={selectedStylistData.image_url} className="w-9 h-9" />
              <span className="font-bold -mr-1">
                {selectedStylistData.name}
              </span>
              <button
                onClick={() => {
                  setselectedStylist(null);
                }}
                className="p-1 rounded-full hover:bg-gray-200 pt-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="relative pt-5">
        <div className="overflow-hidden" px-2 ref={emblaRef}>
          {/* calendar表示 */}
          <div className="flex pb-2 -mx-2 mt-2">
            {selectedCurseId &&
              reservCalendar.map((calendar) => (
                <div
                  key={calendar.date}
                  className="flex-[0_0_calc(100%/2)] md:flex-[0_0_calc(100%/7)] px-1 md:px-2"
                >
                  <CalendarCard
                    calendar={calendar}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                    onSelectDate={() => setSelectedDate(calendar.date)}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* カレンダーめくりボタン */}
        {selectedCurseId && (
          <div className="absolute right-2 top-0 flex gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="-translate-y-1/2 bg-white shadow rounded-full w-8 h-8"
            >
              ←
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="-translate-y-1/2 bg-white shadow rounded-full w-8 h-8"
            >
              →
            </button>
          </div>
        )}
        {mode === 'edit' ? (
          <div className="flex items-center flex-col">
            {/* <button>変更を確定する</button> */}
            <UpdateReservationButton
              isSelect={
                selectedCurseId != null &&
                selectedDate != null &&
                selectedTime != null
              }
              id={reservation?.id}
              courseId={selectedCurseId}
              stylistId={selectedStylist}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              UpdateReservationButtonClick={UpdateReservationButtonClick}
            />
            <button
              onClick={() => {
                router.push('/reservation/confirm');
              }}
              className="bg-[#EF4444] text-white hover:bg-[#d83d3d] transition cursor-pointer w-full md:w-70 border rounded-3xl py-2.5 font-bold text-xl mb-3 shadow"
            >
              変更をキャンセル
            </button>
          </div>
        ) : (
          selectedCurseId && (
            <ReserveButton
              isSelect={
                selectedCurseId != null &&
                selectedDate != null &&
                selectedTime != null
              }
              courseId={selectedCurseId}
              stylistId={selectedStylist}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          )
        )}
      </div>
    </>
  );
}
