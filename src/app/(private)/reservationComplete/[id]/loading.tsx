export default function Loading() {
  return (
    <div className="p-4 animate-pulse max-w-md mx-auto">
      <div className="h-6 w-48 rounded bg-gray-200 mb-4 mx-auto" />

      <div className="space-y-3 rounded-lg border p-4">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}
