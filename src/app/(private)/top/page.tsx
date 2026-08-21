import TopPage from '@/components/Top';

type Props = {
  searchParams: Promise<{
    error?: string;
    restoreDraft?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <TopPage
      error={params.error}
      restoreDraft={params.restoreDraft === '1'}
    />
  );
}
