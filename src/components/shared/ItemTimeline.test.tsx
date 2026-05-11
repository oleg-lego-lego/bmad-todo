import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ItemTimeline } from '@/components/shared/ItemTimeline';
import type { ItemTimelineEvent } from '@/types/item';

const mockEvents: ItemTimelineEvent[] = [
  {
    date: '2026-04-25T10:00:00Z',
    title: 'Принято ломбардом',
    description: 'Изделие принято на комиссию',
    status: 'completed',
  },
  {
    date: '2026-04-26T10:00:00Z',
    title: 'Оценено экспертом',
    description: 'Проведена профессиональная оценка',
    status: 'completed',
  },
  {
    date: '2026-04-28T10:00:00Z',
    title: 'Выставлено на продажу',
    description: 'Товар доступен для покупки',
    status: 'current',
  },
];

describe('ItemTimeline', () => {
  it('renders timeline events', () => {
    render(<ItemTimeline events={mockEvents} />);

    expect(screen.getByText('Принято ломбардом')).toBeInTheDocument();
    expect(screen.getByText('Оценено экспертом')).toBeInTheDocument();
    expect(screen.getByText('Выставлено на продажу')).toBeInTheDocument();
  });

  it('renders event descriptions', () => {
    render(<ItemTimeline events={mockEvents} />);

    expect(screen.getByText('Изделие принято на комиссию')).toBeInTheDocument();
    expect(screen.getByText('Проведена профессиональная оценка')).toBeInTheDocument();
    expect(screen.getByText('Товар доступен для покупки')).toBeInTheDocument();
  });

  it('renders formatted dates', () => {
    render(<ItemTimeline events={mockEvents} />);

    expect(screen.getByText('25 апреля 2026 г.')).toBeInTheDocument();
    expect(screen.getByText('26 апреля 2026 г.')).toBeInTheDocument();
    expect(screen.getByText('28 апреля 2026 г.')).toBeInTheDocument();
  });

  it('renders heading', () => {
    render(<ItemTimeline events={mockEvents} />);

    expect(screen.getByText('Биография вещи')).toBeInTheDocument();
  });

  it('renders list with ARIA roles', () => {
    render(<ItemTimeline events={mockEvents} />);

    const list = screen.getByRole('list', { name: 'Таймлайн жизни товара' });
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('renders nothing for empty events', () => {
    const { container } = render(<ItemTimeline events={[]} />);

    expect(container.innerHTML).toBe('');
  });

  it('renders single event without connectors', () => {
    const singleEvent = [mockEvents[0]];
    render(<ItemTimeline events={singleEvent} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(screen.getByText('Принято ломбардом')).toBeInTheDocument();
  });

  it('renders future status events', () => {
    const eventsWithFuture: ItemTimelineEvent[] = [
      ...mockEvents,
      {
        date: '2026-05-30T10:00:00Z',
        title: 'Продано',
        description: 'Товар будет доставлен покупателю',
        status: 'future',
      },
    ];

    render(<ItemTimeline events={eventsWithFuture} />);

    expect(screen.getByText('Продано')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
});
