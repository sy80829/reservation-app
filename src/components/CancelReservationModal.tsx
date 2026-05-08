'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { cancelReservation } from '@/app/(private)/actions/cancelReservation';

type Props = {
  id: number;
  version: number;
};

export default function CancelReservationModal({ id, version }: Props) {
  const handleClick = async () => {
    //　キャンセル処理
    await cancelReservation({
      id,
      version,
    });
  };
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-[#EF4444] text-white hover:bg-[#d83d3d] transition cursor-pointer w-full md:w-70 border rounded-3xl py-6 font-bold text-xl mb-3 shadow">
            予約のキャンセル
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>予約をキャンセルしますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消しできません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleClick();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
