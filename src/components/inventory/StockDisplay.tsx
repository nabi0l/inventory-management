'use client';

type StockLevel = 'out' | 'low' | 'ok';

const STOCK_CAP = 100;

function getStockLevel(stock: number): StockLevel {
  if (stock === 0) return 'out';
  if (stock < 10) return 'low';
  return 'ok';
}

const styles: Record<
  StockLevel,
  {
    label: string;
    number: string;
    track: string;
    fill: string;
  }
> = {
  out: {
    label: 'Out of stock',
    number: 'text-rose-600',
    track: 'bg-rose-100',
    fill: 'bg-rose-500',
  },
  low: {
    label: 'Low stock',
    number: 'text-amber-700',
    track: 'bg-amber-100',
    fill: 'bg-amber-500',
  },
  ok: {
    label: 'In stock',
    number: 'text-zinc-900',
    track: 'bg-zinc-200/80',
    fill: 'bg-emerald-500',
  },
};

function barWidth(stock: number, level: StockLevel): number {
  if (level === 'out') return 0;
  return Math.min(Math.round((stock / STOCK_CAP) * 100), 100);
}

interface StockDisplayProps {
  stock: number;
  variant?: 'table' | 'card' | 'detail';
}

export default function StockDisplay({ stock, variant = 'table' }: StockDisplayProps) {
  const level = getStockLevel(stock);
  const s = styles[level];
  const fill = barWidth(stock, level);
  const isCard = variant === 'card';
  const isDetail = variant === 'detail';
  const showLabel = variant === 'table' || isDetail;
  const minFill = level === 'out' ? 0 : Math.max(fill, 6);

  return (
    <div
      className={`flex flex-col ${
        isCard || isDetail ? 'w-full min-w-[5.5rem]' : 'w-[4.5rem]'
      } ${isCard || isDetail ? 'items-start gap-1.5' : 'items-end gap-1.5'}`}
      title={`${stock} units — ${s.label}`}
    >
      <div
        className={`flex w-full items-baseline gap-1.5 ${
          isCard || isDetail ? 'justify-between' : 'justify-end'
        }`}
      >
        <span
          className={`font-semibold tabular-nums leading-none ${s.number} ${
            isCard || isDetail ? 'text-lg' : 'text-[15px]'
          }`}
        >
          {stock}
        </span>
        {showLabel && (
          <span className="text-[10px] font-medium text-zinc-400">{s.label}</span>
        )}
      </div>

      <div className={`h-1 w-full overflow-hidden rounded-full ${s.track}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${s.fill}`}
          style={{ width: `${minFill}%` }}
        />
      </div>
    </div>
  );
}
