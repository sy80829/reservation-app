import React from 'react';

type Props = {
  searchParams: {
    error?: string;
  };
};

export default function page({ searchParams }: Props) {
  const error = searchParams.error;
  return (
    <div>
      {/* {error === 'already_reserved' && (
        <p className="text-red-500">既に予約があります</p>
      )} */}
      <p className="pt-2 text-center">既に予約があります</p>
    </div>
  );
}
