import { atom, useAtom } from 'jotai'

export type EditReservationData = {
  version?: number | null
  date: string | null
  time: string | null
  courseId: string | null
  stylistId: string | null
}

const editReservationAtom = atom<EditReservationData>({
  version: 0,
  date: '',
  time: '',
  courseId: '',
  stylistId: '',
});

export const useEditReservationDataStore = () => {
  const [editReservationData, setEditReservationData] = useAtom(editReservationAtom);
  return { editReservationData, setEditReservationData }
}