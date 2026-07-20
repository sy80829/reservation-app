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
      className="flex items-center justify-center w-8 h-8 disabled:opacity-40 disabled:cursor-not-allowed"
      onClick={() => onSelect()}
      disabled={disabled}
      ref={showCalendarButtonRef}
    >
      <Calendar className="w-4 h-4" />
    </button>
  );
}
