import { cn } from '@/lib/utils';

type TrustLevel = 'high' | 'medium' | 'low';

interface TrustBadgeProps {
  rating: number;
  variant: 'compact' | 'full';
  className?: string;
}

function getTrustLevel(rating: number): TrustLevel {
  if (rating >= 80) return 'high';
  if (rating >= 50) return 'medium';
  return 'low';
}

const levelLabels: Record<TrustLevel, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

const levelStyles: Record<TrustLevel, string> = {
  high: 'bg-trust-high-bg text-trust-high',
  medium: 'bg-trust-medium-bg text-trust-medium',
  low: 'bg-trust-low-bg text-trust-low',
};

export function TrustBadge({ rating, variant, className }: TrustBadgeProps) {
  const clampedRating = Math.max(0, Math.min(100, Math.round(rating)));
  const level = getTrustLevel(clampedRating);
  const label = levelLabels[level];
  const styles = levelStyles[level];

  const ariaLabel =
    variant === 'full'
      ? `Рейтинг прозрачности: ${clampedRating} из 100, уровень: ${label.toLowerCase()}`
      : `Рейтинг прозрачности: ${clampedRating} из 100`;

  if (variant === 'compact') {
    return (
      <span
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center justify-center gap-1 rounded-md min-w-[44px] min-h-[44px] px-2 py-2 text-[10px] font-semibold leading-none',
          styles,
          className,
        )}
      >
        <span>{clampedRating}</span>
        <span className="hidden sm:inline">Рейтинг прозрачности</span>
      </span>
    );
  }

  return (
    <div
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2',
        styles,
        className,
      )}
    >
      <span className="text-2xl font-bold">{clampedRating}</span>
      <div className="flex flex-col">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-[10px] opacity-70">Рейтинг прозрачности</span>
      </div>
    </div>
  );
}
