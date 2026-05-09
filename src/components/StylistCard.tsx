import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { StylistCardProps, stylistsType } from '@/types';
// import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export default function StylistCard({
  stylist,
  selectedStylist,
  onSelect,
}: StylistCardProps) {
  return (
    <>
      <div
        onClick={() => onSelect(stylist.id)}
        className={cn(
          'flex items-center gap-5 border p-3  rounded-3xl cursor-pointer',
          selectedStylist === stylist.id
            ? 'ring-2 ring-[#007AFF]'
            : 'hover:bg-accent',
        )}
      >
        {/* <RadioGroupItem value={stylist.id} id={stylist.id} /> */}

        {/* DBから取得した値で置き換え */}
        <Avatar className="w-20 h-20">
          <AvatarImage src={stylist.image_url} />
          <AvatarFallback>ユーザー名</AvatarFallback>
        </Avatar>

        <div>
          <div className="font-bold text-xl">{stylist.name}</div>
          <div>{stylist.bio}</div>
        </div>
      </div>
    </>
  );
}
