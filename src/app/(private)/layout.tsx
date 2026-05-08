import Header from '@/components/header';
import React from 'react';

export default function PrivatePageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="max-w-[1440px] mx-auto">
      <Header />
      <main className="px-10  pt-16">{children}</main>
    </div>
  );
}
