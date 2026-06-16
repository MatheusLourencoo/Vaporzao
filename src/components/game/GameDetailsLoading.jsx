export function GameDetailsLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-5xl mx-auto pt-8 px-6">
        <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="w-3/4 h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
            <div className="w-full h-[400px] bg-zinc-800 rounded-xl animate-pulse"></div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-32 h-20 bg-zinc-800 rounded-lg animate-pulse shrink-0"></div>
              ))}
            </div>
            <div className="space-y-4 pt-4">
              <div className="w-48 h-8 bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-full h-4 bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-full h-4 bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-5/6 h-4 bg-zinc-800 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl border border-white/5 sticky top-24">
              <div className="w-32 h-10 bg-zinc-800 rounded animate-pulse mb-6"></div>
              <div className="flex flex-col gap-3">
                <div className="w-full h-14 bg-zinc-800 rounded-lg animate-pulse"></div>
                <div className="w-full h-14 bg-zinc-800 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}