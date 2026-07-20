import { Database } from '@/types/supabase';

export interface CourseCardType {
  id: string;
  name: string;
  duration: number;
  price: number;
};

export interface CalendarCardType {
  id: string;
  date: string;
  times: string[];
};

export interface StaffSelectDrawerType {
  stylists: stylistsType[],
  selectedStylist: string | null,
  setOpen: (open: boolean) => void;
  open: boolean;
  onSelect: (stylist: string) => void;
};

export interface stylistsType {
      id: string,
      name: string,
      bio: string,
      image_url: string,
};

export interface CourseCardProps {
    course: CourseCardType;
    isSelected: boolean;
    onSelect: () => void;
}

export interface CalendarCardProps {
    calendar: reservCalendar;
    selectedDate: string | null;
    selectedTime: string | null;
    onSelectTime: (time: string | null) => void;
    onSelectDate: () => void;
}

export interface TimeButtonProps {
    time: formatedReservSlots;
    isSelected: boolean;
    onSelect: () => void;
}

export interface StylistCardProps {
  stylist: stylistsType;
  selectedStylist: string | null;
  onSelect: (stylistId: string) => void;
}

export interface ReserveButtonProps {
  isSelect: boolean;
  courseId: string | null;
  stylistId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
}

export interface UpdateReseervationButton {
  isSelect: boolean;
  id: number | undefined;
  UpdateReservationButtonClick: () => void;
}

export interface reservProps {
  courseId: string | null;
  stylistId: string | null;
  date: string | null;
  reserv_time_st: string | null;
  reserv_time_ed: string | null;
  userId: string;
}

export interface createReservationParams {
  target_date: string,
  new_start: string,
  course_id: string,
  stylist_id: string | null,
}

export interface updateReservation {
  reservationId: string,
  target_date: string,
  new_start: string,
  course_id: string,
  stylist_id: string | null,
}

export interface parsedUpdateReservationParams {
  reservationId: number,
  target_date: string,
  new_start: string,
  new_end: string,
  course_id: number,
  stylist_id: number | null,
}


export interface parsedCreateReservationParams {
  target_date: string,
  new_start: string,
  new_end: string,
  course_id: number,
  stylist_id: number | null,
}

export interface calendarProps {
  course_id: string,
  stylist_id: string,
}

export interface Reservation {
  reserv_date: string,
  reserv_time_st: string,
  reserv_time_ed: string,
  stylist_id?: number,
}

export interface formattedReservations {
  reserv_date: string,
  reserv_time_st: number,
  reserv_time_ed: number,
  stylist_id?: string,
}

export interface reservSlots {
  start: number,
  end: number,
  status: string,
  canReserve: boolean
}

export interface reservTime {
  reserv_time_st: number,
  reserv_time_ed: number,
}

export interface formatedReservSlots {
  start: string,
  end: string,
  status: string,
  canReserve: boolean
}

export interface reservCalendar {
  stylist_id?: string;
  date : string,
  slots: formatedReservSlots[]
}

export interface StylistResult {
  stylist_id: string;
  slots: reservSlots[];
};

export interface ReservationCardProps {
  course: Course,
  stylist?: Stylist,
  date: string | null,
  time: string | null,
}

export interface ReservCompleteCardProps {
  reserv_date: string,
  reserv_time_st: string,
  reserv_time_ed: string,
    courses: {
    name: string,
    duration: number,
    price: number
  },
  stylists: {
    name: string
  }
}

export interface confirmReservationProps {
  id: number,
  reserv_date: string,
  reserv_time_st: string,
  reserv_time_ed: string,
  version: number,
    courses: {
    name: string,
    duration: number,
    price: number
  },
  stylists: {
    name: string
  }
}

export interface TopPageProps {
  id : number;
  reserv_date: string;
  reserv_time_st: string;
  reserv_time_ed: string;
  is_free: boolean;
  version: number;
  courses: {
    id: number;
    name: string;
  };
  stylists: {
    id: number;
    name: string
  };
}

export interface getReservationType {
  id: number,
  reserv_date: string,
  reserv_time_st: string,
  reserv_time_ed: string,
  courses: {
    name: string,
    duration: number,
    price: number
  },
  stylists: {
    name: string
  }
}

export type Course = Database['public']['Tables']['courses']['Row'];
export type Stylist = Database['public']['Tables']['stylists']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];