export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-t-transparent animate-spin border-gray-500" />
        <span className="text-sm text-gray-700 dark:text-gray-200">Loading…</span>
      </div>
    </div>
  );
}
