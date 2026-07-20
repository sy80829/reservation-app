export default function Loading() {
  return (
    <div className="max-w-md mx-auto mt-12 mb-12 animate-pulse rounded-lg border p-6">
      <div className="h-5 w-24 rounded bg-gray-200 mx-auto mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}
