export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-20 rounded bg-gray-200 mt-5 mb-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="h-32 rounded-lg bg-gray-200" />
        <div className="h-32 rounded-lg bg-gray-200" />
        <div className="h-32 rounded-lg bg-gray-200" />
      </div>

      <div className="h-8 w-28 rounded bg-gray-200 mt-8 mb-4" />
      <div className="flex gap-2">
        <div className="h-40 flex-1 rounded-lg bg-gray-200" />
        <div className="h-40 flex-1 rounded-lg bg-gray-200" />
        <div className="h-40 flex-1 rounded-lg bg-gray-200" />
        <div className="h-40 flex-1 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
