import { Calendar } from 'lucide-react';
import { RefObject } from 'react';
type Props = {
  onSelect: () => void;
  showCalendarButtonRef: RefObject<HTMLButtonElement | null>;
  disabled?: boolean;
};

export default function DateJumpCalendarButton({
  onSelect,
  showCalendarButtonRef,
  disabled,
}: Props) {
  return (
    <button
      className="flex items-center justify-center w-14 h-14 rounded-full border-0 border-gray-400 bg-white shadow-lg transition-transform duration-150 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      onClick={() => onSelect()}
      disabled={disabled}
      ref={showCalendarButtonRef}
    >
      <Calendar className="w-6 h-6" />
    </button>
  );
}
