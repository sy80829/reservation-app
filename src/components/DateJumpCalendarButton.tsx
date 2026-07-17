import { Calendar } from 'lucide-react';
import { RefObject } from 'react';
type Props = {
  onSelect: () => void;
  showCalendarButtonRef: RefObject<HTMLButtonElement | null>;
};

export default function DateJumpCalendarButton({
  onSelect,
  showCalendarButtonRef,
}: Props) {
  return (
    <button
      className="-translate-y-1/2 w-8 h-8"
      onClick={() => onSelect()}
      ref={showCalendarButtonRef}
    >
      <Calendar className="w-4 h-4" />
    </button>
  );
}
