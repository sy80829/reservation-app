export default function Loading() {
  return (
    <div className="p-4 animate-pulse">
      <div className="h-6 w-32 rounded bg-gray-200 mx-auto mb-3" />

      <div className="grid grid-cols-[auto_1fr] items-center gap-2 max-w-md mx-auto">
        <div className="h-4 w-16 rounded bg-gray-200" />
        <div className="h-10 rounded-lg bg-gray-200" />
        <div className="h-4 w-16 rounded bg-gray-200" />
        <div className="h-10 rounded-lg bg-gray-200" />
      </div>

      <div className="flex justify-center mt-3">
        <div className="h-11 w-full md:w-70 rounded-3xl bg-gray-200" />
      </div>
    </div>
  );
}
