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
}: PanelCardProps) {
  return (
    <div className={`overflow-hidden rounded-lg bg-white border border-zinc-200 ${className}`}>
      <div className="border-b border-zinc-200 px-5 py-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500">
              <Icon className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
          )}
          <div className="min-w-0 pt-0.5">
            <h2 className="text-base font-semibold text-zinc-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-zinc-600">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {toolbar && (
        <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3">
          {toolbar}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}
