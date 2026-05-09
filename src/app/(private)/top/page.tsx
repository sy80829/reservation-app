import TopPage from '@/components/Top';

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  return <TopPage error={params.error} />;
}
