'use client';

import { LucideIcon } from 'lucide-react';

interface PanelCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
  headerVariant?: 'default' | 'inventory';
}

export default function PanelCard({
  title,
  subtitle,
  icon: Icon,
  children,
  toolbar,
  className = '',
  headerVariant = 'default',
}: PanelCardProps) {
  const headerBg =
    headerVariant === 'inventory'
      ? 'bg-gradient-to-br from-amber-50/25 via-white to-zinc-50/40'
      : 'bg-gradient-to-br from-amber-50/50 via-white to-zinc-50/30';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white border border-zinc-200/90 shadow-[0_4px_24px_-6px_rgba(24,24,27,0.1)] ring-1 ring-zinc-900/[0.03] motion-safe:animate-[fadeIn_0.35s_ease-out] ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-400/80 via-amber-500/80 to-orange-400/80" />

      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-400/5 blur-2xl" />

      <div className={`relative border-b border-zinc-100 px-4 py-3.5 sm:px-5 sm:py-4 ${headerBg}`}>
        <div className="flex items-start gap-2.5 sm:gap-3">
          {Icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm shadow-amber-500/20 sm:h-10 sm:w-10">
              <Icon className="h-4 w-4 text-white sm:h-5 sm:w-5" strokeWidth={2.25} />
            </div>
          )}
          <div className="min-w-0 pt-0.5">
            <h2 className="text-[15px] font-semibold tracking-tight text-zinc-900 sm:text-base">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs leading-snug text-zinc-500 sm:text-sm">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {toolbar && (
        <div className="relative border-b border-zinc-100 bg-zinc-50/50 px-3 py-3 sm:px-5">
          {toolbar}
        </div>
      )}

      <div className="relative">{children}</div>
    </div>
  );
}
