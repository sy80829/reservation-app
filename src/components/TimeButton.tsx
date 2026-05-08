import { cn } from '@/lib/utils';
import { TimeButtonProps } from '@/types';

export default function TimeButton({
  time,
  isSelected,
  onSelect,
}: TimeButtonProps) {
  return (
    <div>
      <button
        disabled={!time.canReserve}
        className={cn(
          'border rounded-md px-2 py-1 text-black hover:bg-black/5',
          'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
          isSelected && 'ring-2 ring-[#007AFF]',
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {time.start}
      </button>
    </div>
  );
}
