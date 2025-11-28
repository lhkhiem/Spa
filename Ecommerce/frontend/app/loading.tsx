export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-purple-600"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
