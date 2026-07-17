import { Card, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CalendarCardProps } from '@/types';
import TimeButton from './TimeButton';

export default function CalendarCard({
  calendar,
  selectedDate,
  selectedTime,
  onSelectTime,
  onSelectDate,
}: CalendarCardProps) {
  const isSelected = selectedDate === calendar.date;

  return (
    <div>
      <Card
        className={cn('', isSelected ? 'ring-2 ring-[#007AFF]' : '')}
        onClick={() => {
          onSelectDate();
        }}
      >
        <div>
          <CardTitle className="text-center">{calendar.date}</CardTitle>
          <div className="grid text-center grid-cols-2 gap-3 mt-2">
            {calendar.slots.map((time) => (
              <TimeButton
                key={time.start}
                time={time}
                isSelected={selectedTime === time.start && isSelected}
                onSelect={() => {
                  onSelectDate();
                  onSelectTime(time.start);
                }}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
