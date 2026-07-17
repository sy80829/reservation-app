export default function Loading() {
  return (
    <div className="p-4 animate-pulse">
      <div className="h-6 w-40 rounded bg-gray-200 mb-4" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="h-24 rounded-lg bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-200" />
        <div className="h-24 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
