import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format-date';
import type { ItemTimelineEvent } from '@/types/item';

interface ItemTimelineProps {
  events: ItemTimelineEvent[];
  className?: string;
}

const statusStyles: Record<ItemTimelineEvent['status'], string> = {
  completed: 'bg-trust-high border-trust-high',
  current: 'bg-primary border-primary',
  future: 'bg-muted-foreground border-muted-foreground',
};

const lineStyles: Record<ItemTimelineEvent['status'], string> = {
  completed: 'bg-trust-high',
  current: 'bg-primary',
  future: 'bg-muted-foreground/30',
};

export function ItemTimeline({ events, className }: ItemTimelineProps) {
  if (events.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="text-h3 font-semibold text-foreground mb-4">
        Биография вещи
      </h2>
      <div
        role="list"
        aria-label="Таймлайн жизни товара"
        className="flex items-start gap-0 overflow-x-auto pb-2 lg:overflow-visible"
      >
        {events.map((event, i) => (
          <div
            key={`${event.date}-${event.title}`}
            role="listitem"
            className="flex flex-col items-center flex-shrink-0 min-w-[140px] flex-[1_1_0%]"
          >
            {/* Connector line + dot */}
            <div className="flex w-full items-center px-2">
              {i > 0 && (
                <div
                  className={cn('h-0.5 flex-1', lineStyles[events[i - 1].status])}
                />
              )}
              <div
                className={cn(
                  'h-3 w-3 flex-shrink-0 rounded-full border-2',
                  statusStyles[event.status],
                )}
              />
              {i < events.length - 1 && (
                <div
                  className={cn('h-0.5 flex-1', lineStyles[event.status])}
                />
              )}
            </div>

            {/* Content */}
            <div className="mt-2 text-center px-1">
              <p className="text-caption text-muted-foreground">
                {formatDate(event.date) || 'Дата не указана'}
              </p>
              <p className="text-body font-medium text-foreground mt-0.5">
                {event.title}
              </p>
              <p className="text-caption text-muted-foreground mt-0.5 line-clamp-2">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
