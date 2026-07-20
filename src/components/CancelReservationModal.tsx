'use client';

import React, { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    //　キャンセル処理
    setIsLoading(true);
    try {
      await cancelReservation({
        id,
        version,
      });
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
              onClick={(e) => {
                // デフォルトだとクリック直後にダイアログが閉じてしまい、
                // 処理中表示が一瞬も見えないため自動クローズを防止する
                e.preventDefault();
                handleClick();
              }}
            >
              {isLoading ? '処理中...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
