'use client';

import StaffSelectDrawer from '@/components/StaffSelectDrawer';
import CourseCard from '@/components/CourseCard';
import type {
  CourseCardType,
  reservCalendar,
  stylistsType,
  TopPageProps,
} from '@/types';

// API取得直後（idがstring変換前）の生データ型
type RawCourse = Omit<CourseCardType, 'id'> & { id: number };
type RawStylist = Omit<stylistsType, 'id'> & { id: number };
import { useEffect, useRef, useState } from 'react';
import CalendarCard from '@/components/CalendarCard';
import useEmblaCarousel from 'embla-carousel-react';
import { X } from 'lucide-react';
import ReserveButton from '@/components/ReserveButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import UpdateReservationButton from './UpdateReservationButton';
import { useEditReservationDataStore } from '@/atoms/editReservationDataState';
import DateJumpCalendar from './DateJumpCalendar';
import DateJumpCalendarButton from './DateJumpCalendarButton';
import { useNewReservationDataStore } from '@/atoms/newReservationDataState';

type Props = {
  reservation?: TopPageProps;
  mode?: string;
  error?: string;
};

export default function TopPage({ reservation, mode, error }: Props) {
  const router = useRouter();
  const { newReservationData } = useNewReservationDataStore(); //確認画面から戻った場合の下書き
  const [courses, setCourses] = useState<CourseCardType[]>([]); //コース
  // 選択中のコース（予約確認ページから遷移した場合はreservationの内容、
  // それ以外は確認画面（/reservation）から「予約を変更する」で戻った場合の下書きで初期化）
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(() =>
    reservation ? String(reservation.courses.id) : newReservationData.courseId,
  );
  const [stylists, setStylists] = useState<stylistsType[]>([]); //スタイリスト
  //選択中のスタイリスト（フリー予約の場合は非選択状態にする）
  const [selectedStylist, setselectedStylist] = useState<string | null>(() => {
    if (reservation) {
      return reservation.is_free ? null : String(reservation.stylists.id);
    }
    return newReservationData.stylistId;
  });
  //選択中の日付
  const [selectedDate, setSelectedDate] = useState<string | null>(
    () => reservation?.reserv_date ?? newReservationData.date,
  );
  //選択中の時間
  const [selectedTime, setSelectedTime] = useState<string | null>(() =>
    reservation
      ? reservation.reserv_time_st.slice(0, 5)
      : newReservationData.time,
  );
  const [reservCalendar, setReservCalendar] = useState<reservCalendar[]>([]);
  const [open, setOpen] = useState(false); //スタイリストモーダル状態
  const excludeId = mode === 'edit' ? reservation?.id : null; //予約変更画面
  const { setEditReservationData } = useEditReservationDataStore(); //予約編集時のデータ状態
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const showCalendarButtonRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //画面外メニューボタンとメニュー以外をクリックしたとき
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node) &&
        !showCalendarButtonRef.current?.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //Embla初期化
  // slidesToScrollはデフォルト(1枚単位)のままにする。'auto'にするとscrollTo(index)の
  // indexがスライド番号ではなくグループ番号扱いになり、日付ジャンプの飛び先がずれるため
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
  });

  // 矢印ボタン用：画面に映っている枚数分まとめて進める
  const scrollByPage = (direction: 1 | -1) => {
    if (!emblaApi) return;
    const slidesPerView = emblaApi.slidesInView().length || 1;
    const current = emblaApi.selectedScrollSnap();
    emblaApi.scrollTo(current + direction * slidesPerView);
  };
  //コース、スタイリスト取得
  // setStateはfetch内のawait後（非同期）に呼ばれるため実質同期呼び出しではない
  useEffect(() => {
    //コース取得
    const fetchCourse = async () => {
      try {
        const res = await fetch('/api/course'); //APIを呼び出す
        const data = await res.json(); //JSON文字列 → JavaScriptオブジェクトに戻す
        setCourses(
          data.courses.map((s: RawCourse) => ({
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
        setStylists(
          data.stylists.map((s: RawStylist) => ({
            ...s,
            id: String(s.id),
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourse();
    fetchStylist();
  }, []);

  // ユーザー操作だけリセット
  const handleCourseSelect = (id: string) => {
    setSelectedCourseId(id);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  //コースが変わるたび日付と時間をリセット
  const [calendarLoading, setCalendarLoading] = useState(false);
  useEffect(() => {
    // コース/スタイリスト切り替え中に古い取得結果が後から上書きしないようにするフラグ
    let ignore = false;
    //予約カレンダー取得
    const fetchCalendar = async () => {
      setCalendarLoading(true);
      try {
        const res = await fetch(
          `/api/calendar?course_id=${selectedCourseId}&stylist_id=${selectedStylist}&excludeId=${excludeId}`,
        );
        const data: reservCalendar[] = await res.json(); //JSON文字列 → JavaScriptオブジェクトに戻す
        if (!ignore) {
          setReservCalendar(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!ignore) {
          setCalendarLoading(false);
        }
      }
    };

    fetchCalendar();

    return () => {
      ignore = true;
    };
  }, [selectedCourseId, selectedStylist, excludeId]);

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
      courseId: selectedCourseId,
      stylistId: selectedStylist,
    });
  };

  //DateJumpCalendarクリック時発火
  const dateClick = async (date: string) => {
    const index = reservCalendar.findIndex((c) => c.date === date);
    emblaApi?.scrollTo(index);
    setSelectedDate(date);
  };

  //ローディング
  if (courses.length === 0) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-20 rounded bg-gray-200 mt-5 mb-5" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 rounded-lg bg-gray-200" />
          <div className="h-32 rounded-lg bg-gray-200" />
          <div className="h-32 rounded-lg bg-gray-200" />
        </div>

        <div className="h-8 w-28 rounded bg-gray-200 mt-8 mb-4" />
        <div className="flex gap-2">
          <div className="h-40 flex-1 rounded-lg bg-gray-200" />
          <div className="h-40 flex-1 rounded-lg bg-gray-200" />
          <div className="h-40 flex-1 rounded-lg bg-gray-200" />
          <div className="h-40 flex-1 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <>
      {error === 'already_reserved' && (
        <div className="text-red-500">既に予約済みのため予約できません。</div>
      )}
      {error === 'invalid_operation' && (
        <div className="text-red-500">予期せぬエラーが発生しました</div>
      )}
      {error === 'out_of_hours' && (
        <div className="text-red-500">
          選択した時間は営業時間外のため予約できません。
        </div>
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
        <div className="grid grid-cols-3 gap-4">
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSelected={course.id === selectedCourseId}
              onSelect={() => handleCourseSelect(course.id)}
            />
          ))}
        </div>
      </div>
      <div className="text-2xl font-bold pt-5">空き状況</div>
      <div className="flex flex-wrap items-center justify-between pt-3 gap-4">
        <div className="flex flex-wrap items-center gap-4">
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
              <Image
                src={selectedStylistData.image_url}
                alt={selectedStylistData.name}
                width={36}
                height={36}
                className="w-9 h-9"
              />
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
        {selectedCourseId && (
          <div className="relative flex items-center gap-4">
            {/* 📅 日付ジャンプ：スマホ・タブレットは右下floatで常に押せるように、md以上は今まで通り行内表示 */}
            <div className="fixed bottom-4 right-4 z-30 md:static md:z-auto">
              <DateJumpCalendarButton
                onSelect={() => {
                  setShowCalendar(!showCalendar);
                }}
                showCalendarButtonRef={showCalendarButtonRef}
                disabled={calendarLoading}
              />
              {showCalendar && (
                <div
                  className="fixed bottom-24 right-4 z-30 md:absolute md:bottom-auto md:top-full md:right-0 md:mt-2 md:z-20"
                  ref={calendarRef}
                >
                  <DateJumpCalendar
                    reservCalendar={reservCalendar}
                    selectedDate={selectedDate}
                    onSelect={dateClick}
                    setShowCalendar={setShowCalendar}
                  />
                </div>
              )}
            </div>
            {/* カレンダーめくりボタン：スマホ・タブレットはスワイプで操作するので非表示、md以上のみ表示 */}
            <button
              onClick={() => scrollByPage(-1)}
              disabled={calendarLoading}
              className="hidden md:block bg-white shadow rounded-full w-8 h-8 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={() => scrollByPage(1)}
              disabled={calendarLoading}
              className="hidden md:block bg-white shadow rounded-full w-8 h-8 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}
      </div>
      <div className="relative">
        <div className="overflow-hidden px-2" ref={emblaRef}>
          {/* calendar表示 */}
          <div className="flex pb-2 -mx-2 mt-2">
            {selectedCourseId && calendarLoading
              ? // コース/スタイリスト切り替え直後は空き状況が古いままなので、
                // 取得が終わるまで時間ボタンごと隠して選択できないようにする
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-[0_0_calc(100%/2)] sm:flex-[0_0_calc(100%/3)] md:flex-[0_0_calc(100%/4)] lg:flex-[0_0_calc(100%/7)] px-1 md:px-2"
                  >
                    <div className="h-40 rounded-lg bg-gray-200 animate-pulse" />
                  </div>
                ))
              : selectedCourseId &&
                reservCalendar.map((calendar) => (
                  <div
                    key={calendar.date}
                    className="flex-[0_0_calc(100%/2)] sm:flex-[0_0_calc(100%/3)] md:flex-[0_0_calc(100%/4)] lg:flex-[0_0_calc(100%/7)] px-1 md:px-2"
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
        {/* 予約編集モード */}
        {mode === 'edit' ? (
          <div className="flex items-center flex-col">
            <UpdateReservationButton
              isSelect={
                selectedCourseId != null &&
                selectedDate != null &&
                selectedTime != null
              }
              id={reservation?.id}
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
          selectedCourseId && (
            <ReserveButton
              isSelect={
                selectedCourseId != null &&
                selectedDate != null &&
                selectedTime != null
              }
              courseId={selectedCourseId}
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
