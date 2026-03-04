import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function HistoryLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Game History</h1>
      <div className="py-16">
        <LoadingSpinner size="lg" label="Loading game history..." />
      </div>
    </main>
  );
}
