'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import MenuCard from './MenuCard';
import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  //メニューの開閉状態
  const [menuOpen, setMenuOpen] = useState(false);
  //ハンバーガーメニュー
  const menuRef = useRef<HTMLDivElement>(null);
  //ハンバーガーメニューのボタン
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState<User | null>(null);
  // CSSのactive:疑似クラスはiOS Safariだとtouch系のイベントリスナーが
  // 要素に無いと発火しないことがあるため、押下状態を自前で管理する
  const [menuButtonPressed, setMenuButtonPressed] = useState(false);
  const releaseMenuButtonPress = () => setMenuButtonPressed(false);

  //user情報取得
  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    //画面外メニューボタンとメニュー以外をクリックしたとき
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    //画面のいずれかがクリックされたら発火
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      //クリーンアップ
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-background h-16 fixed top-0 left-0 w-full z-50 border">
        {/* h-full:親の上下幅を引き継ぐ  / 左内側に余白 / 横方向に中央ぞろえ（縦はjustify-center） */}
        <div className="relative max-w-[1440px] mx-auto px-10 flex items-center justify-between h-16">
          <div
            className="text-2xl font-bold transition-colors duration-200 cursor-pointer"
            onClick={() => router.push('/top')}
          >
            美容室予約App
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <Image
                src={user.user_metadata?.avatar_url}
                alt={user.user_metadata?.name ?? 'ユーザーアイコン'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
            )}

            <button
              ref={buttonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              onPointerDown={() => setMenuButtonPressed(true)}
              onPointerUp={releaseMenuButtonPress}
              onPointerLeave={releaseMenuButtonPress}
              onPointerCancel={releaseMenuButtonPress}
              className={cn(
                'w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 shadow-lg transition-transform duration-150 cursor-pointer',
                menuButtonPressed && 'scale-90',
              )}
            >
              <Menu className="w-6 h-6 " />
            </button>

            {menuOpen && (
              <div ref={menuRef} className="absolute right-10 top-15 w-56">
                <MenuCard setMenuOpen={setMenuOpen} />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
