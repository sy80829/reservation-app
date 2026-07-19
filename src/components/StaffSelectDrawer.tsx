import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { StaffSelectDrawerType } from '@/types';
import StylistCard from './StylistCard';
import { RadioGroup } from './ui/radio-group';

export default function StaffSelectDrawer({
  stylists,
  selectedStylist,
  setOpen,
  open,
  onSelect,
}: StaffSelectDrawerType) {
  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Button variant="outline">スタイリスト予約</Button>
        </SheetTrigger>
        {/* 左から出るように、幅を指定、内側の余白 */}
        <SheetContent side="left" className="p-6">
          {/* 視覚障害者の方向け情報を非表示にする */}
          <SheetHeader className="">
            <SheetTitle className="text-2xl">スタイリスト</SheetTitle>
            <SheetDescription className="sr-only">
              担当者一覧を表示
            </SheetDescription>
          </SheetHeader>
          <RadioGroup value={selectedStylist} onValueChange={onSelect}>
            {stylists?.map((stylist) => (
              <StylistCard
                key={stylist.id}
                stylist={stylist}
                selectedStylist={selectedStylist}
                onSelect={onSelect}
              />
            ))}
          </RadioGroup>
        </SheetContent>
      </Sheet>
    </div>
  );
}
