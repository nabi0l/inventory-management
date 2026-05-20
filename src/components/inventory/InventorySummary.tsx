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
}: {
  label: string;
  value: number;
  subtext: string;
  icon: typeof Package;
  variant?: 'default' | 'accent' | 'warning' | 'alert';
}) {
  const styles = {
    default: {
      card: 'border-zinc-200 bg-white',
      icon: 'bg-zinc-100 text-zinc-600',
      value: 'text-zinc-900',
      sub: 'text-zinc-500',
    },
    accent: {
      card: 'border-amber-200 bg-amber-50',
      icon: 'bg-amber-500 text-white',
      value: 'text-amber-900',
      sub: 'text-amber-700',
    },
    warning: {
      card: 'border-orange-200 bg-orange-50',
      icon: 'bg-orange-500 text-white',
      value: 'text-orange-900',
      sub: 'text-orange-700',
    },
    alert: {
      card: 'border-rose-200 bg-rose-50',
      icon: 'bg-rose-500 text-white',
      value: 'text-rose-900',
      sub: 'text-rose-700',
    },
  }[variant];

  return (
    <div className={`rounded-lg border p-4 ${styles.card}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {label}
          </p>
          <p className={`mt-1 text-2xl font-bold tabular-nums ${styles.value}`}>
            {value}
          </p>
          <p className={`mt-1 text-xs ${styles.sub}`}>
            {subtext}
          </p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
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

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
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
        subtext="Units in inventory"
        icon={TrendingUp}
        variant="accent"
      />
      <div className="col-span-2 lg:col-span-1">
        <StatCard
          label="Low stock"
          value={lowStockCount}
          subtext={
            lowStockCount > 0
              ? 'Below 10 units'
              : 'Looking good'
          }
          icon={AlertTriangle}
          variant={lowStockCount > 0 ? (lowStockCount >= 3 ? 'alert' : 'warning') : 'default'}
        />
      </div>
    </div>
  );
}
