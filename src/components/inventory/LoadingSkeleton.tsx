'use client';

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-3 sm:p-4 md:space-y-0 md:divide-y md:divide-zinc-100">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-zinc-100 bg-white md:flex md:items-center md:gap-4 md:rounded-none md:border-0 md:px-5 md:py-4"
        >
          <div className="aspect-[2/1] w-full bg-zinc-200 md:aspect-auto md:h-12 md:w-12 md:shrink-0 md:rounded-xl" />
          <div className="space-y-2 p-4 md:flex-1 md:p-0">
            <div className="h-4 w-3/4 rounded-lg bg-zinc-200" />
            <div className="h-3 w-1/2 rounded-lg bg-zinc-100" />
            <div className="h-8 w-full rounded-lg bg-zinc-100 md:hidden" />
          </div>
        </div>
      ))}
    </div>
  );
}
