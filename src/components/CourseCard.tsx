import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CourseCardProps } from '@/types';

export default function CourseCard({
  course,
  isSelected,
  onSelect,
}: CourseCardProps) {
  return (
    <div>
      <Card
        className={cn(
          'mx-auto w-full max-w-sm hover:bg-accent transition-colors duration-200 cursor-pointer',
          isSelected ? 'ring-2 ring-[#007AFF]' : 'hover:bg-accent',
        )}
        onClick={() => {
          onSelect();
        }}
      >
        <CardHeader>
          <CardTitle className="min-h-12">{course.name}</CardTitle>
          <CardDescription>
            {course.duration}分 / ¥{course.price}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
