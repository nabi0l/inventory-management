'use client';

import { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

interface InventorySummaryProps {
  totalItems: number;
  totalStock: number;
  lowStockCount: number;
  lastUpdated?: Date | null;
}

function formatRelativeTime(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return 'Updated just now';
  if (seconds < 60) return `Updated ${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  return `Updated at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  progress,
}: {
  label: string;
  value: number;
  subtext: string;
  icon: typeof Package;
  variant?: 'default' | 'accent' | 'warning' | 'alert';
  progress?: number;
}) {
  const styles = {
    default: {
      card: 'border-zinc-200/90 bg-white hover:border-zinc-300',
      icon: 'bg-zinc-100 text-zinc-600 border-zinc-200',
      value: 'text-zinc-900',
      sub: 'text-zinc-500',
      bar: 'bg-zinc-200',
      barFill: 'bg-zinc-400',
    },
    accent: {
      card: 'border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-white hover:border-amber-300',
      icon: 'bg-amber-100 text-amber-700 border-amber-200',
      value: 'text-amber-600',
      sub: 'text-amber-700/70',
      bar: 'bg-amber-100',
      barFill: 'bg-amber-400',
    },
    warning: {
      card: 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/40 hover:border-amber-400',
      icon: 'bg-amber-200 text-amber-800 border-amber-300',
      value: 'text-amber-700',
      sub: 'text-amber-800/80',
      bar: 'bg-amber-100',
      barFill: 'bg-amber-500',
    },
    alert: {
      card: 'border-rose-300/80 bg-gradient-to-br from-rose-50/80 to-amber-50/40 hover:border-rose-400',
      icon: 'bg-rose-100 text-rose-700 border-rose-200',
      value: 'text-rose-700',
      sub: 'text-rose-700/80',
      bar: 'bg-rose-100',
      barFill: 'bg-rose-500',
    },
  }[variant];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-3 shadow-sm ring-1 ring-zinc-900/[0.02] transition-[box-shadow,border-color] duration-200 sm:rounded-2xl sm:p-4 sm:shadow-[0_2px_12px_-4px_rgba(24,24,27,0.08)] sm:hover:shadow-[0_8px_24px_-8px_rgba(24,24,27,0.12)] motion-safe:animate-[fadeIn_0.35s_ease-out] ${styles.card}`}
    >
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 sm:text-[11px]">
            {label}
          </p>
          <p className={`mt-0.5 text-xl font-bold tabular-nums sm:mt-1 sm:text-2xl ${styles.value}`}>
            {value}
          </p>
          <p className={`mt-0.5 line-clamp-2 text-[11px] sm:mt-1 sm:text-xs ${styles.sub}`}>
            {subtext}
          </p>
        </div>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border sm:h-11 sm:w-11 sm:rounded-xl ${styles.icon}`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
        </div>
      </div>
      {progress !== undefined && progress > 0 && (
        <div className={`mt-3 h-1 overflow-hidden rounded-full ${styles.bar}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${styles.barFill}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function InventorySummary({
  totalItems,
  totalStock,
  lowStockCount,
  lastUpdated,
}: InventorySummaryProps) {
  const [updatedLabel, setUpdatedLabel] = useState('Synced');

  useEffect(() => {
    if (!lastUpdated) {
      setUpdatedLabel('Loading…');
      return;
    }
    const update = () => setUpdatedLabel(formatRelativeTime(lastUpdated));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const lowStockRatio =
    totalItems > 0 ? Math.round((lowStockCount / totalItems) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
      <StatCard
        label="Products"
        value={totalItems}
        subtext={updatedLabel}
        icon={Package}
        variant="default"
      />
      <StatCard
        label="Total stock"
        value={totalStock}
        subtext="Units across all products"
        icon={TrendingUp}
        variant="accent"
      />
      <div className="col-span-2 lg:col-span-1">
        <StatCard
          label="Low stock"
          value={lowStockCount}
          subtext={
            lowStockCount > 0
              ? 'Items below 10 units'
              : 'All items well stocked'
          }
          icon={AlertTriangle}
          variant={lowStockCount > 0 ? (lowStockCount >= 3 ? 'alert' : 'warning') : 'default'}
          progress={lowStockCount > 0 ? Math.max(lowStockRatio, 12) : undefined}
        />
      </div>
    </div>
  );
}
