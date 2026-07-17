export default function Loading() {
  return (
    <div className="p-4 animate-pulse">
      <div className="h-6 w-32 rounded bg-gray-200 mb-4" />

      <div className="space-y-2">
        <div className="h-4 rounded bg-gray-200" />
        <div className="h-4 rounded bg-gray-200" />
        <div className="h-4 rounded bg-gray-200" />
      </div>
    </div>
  );
}
