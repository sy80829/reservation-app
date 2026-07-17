import { useAtom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export type NewReservationData = {
  courseId: string | null;
  stylistId: string | null;
  date: string | null;
  time: string | null;
};

const storage = createJSONStorage<NewReservationData>(() => sessionStorage);

const newReservationAtom = atomWithStorage<NewReservationData>(
  'newReservationData',
  {
    courseId: null,
    stylistId: null,
    date: null,
    time: null,
  },
  storage,
);

export const useNewReservationDataStore = () => {
  const [newReservationData, setNewReservationData] =
    useAtom(newReservationAtom);
  return { newReservationData, setNewReservationData };
};
