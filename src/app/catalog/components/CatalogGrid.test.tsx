import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CatalogGrid } from '@/app/catalog/components/CatalogGrid';
import type { Item } from '@/types/item';

const mockItems: Item[] = [
  {
    id: 'item-1',
    title: 'Кольцо золотое',
    description: 'Описание кольца',
    price: 15000,
    categoryId: 'cat-1',
    condition: 9,
    trustRating: 4.5,
    shopId: 'shop-1',
    images: ['/images/ring.jpg'],
    status: 'active',
    createdAt: '2026-01-15T10:00:00Z',
    timeline: [],
  },
  {
    id: 'item-2',
    title: 'Ноутбук MacBook',
    description: 'Описание ноутбука',
    price: 45000,
    categoryId: 'cat-2',
    condition: 7,
    trustRating: 3.8,
    shopId: 'shop-2',
    images: ['/images/macbook.jpg'],
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    timeline: [],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockInfiniteResult: any;

vi.mock('@/hooks/use-items', () => ({
  useItemsInfinite: () => mockInfiniteResult,
}));

vi.mock('@/hooks/use-shops', () => ({
  useShops: () => ({
    data: [
      { id: 'shop-1', name: 'Ломбард Золото' },
      { id: 'shop-2', name: 'ТехноЛомбард' },
    ],
  }),
}));

describe('CatalogGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: loaded with items
    mockInfiniteResult = {
      data: {
        pages: [{ data: mockItems, meta: { page: 1, totalPages: 1, total: 2, limit: 12 } }],
      },
      isLoading: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    };
  });

  it('renders product cards', () => {
    render(<CatalogGrid filters={{}} />);
    expect(screen.getByText('Кольцо золотое')).toBeInTheDocument();
    expect(screen.getByText('Ноутбук MacBook')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockInfiniteResult = {
      ...mockInfiniteResult,
      data: undefined,
      error: new Error('Network error'),
    };

    render(<CatalogGrid filters={{}} />);
    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it('shows empty state with reset link when no items', () => {
    mockInfiniteResult = {
      ...mockInfiniteResult,
      data: {
        pages: [{ data: [], meta: { page: 1, totalPages: 0, total: 0, limit: 12 } }],
      },
    };

    render(<CatalogGrid filters={{}} />);
    expect(screen.getByText('Товары не найдены')).toBeInTheDocument();
    expect(screen.getByText('Сбросить фильтры')).toBeInTheDocument();
  });

  it('renders loading skeletons', () => {
    mockInfiniteResult = {
      ...mockInfiniteResult,
      data: undefined,
      isLoading: true,
    };

    render(<CatalogGrid filters={{}} />);
    expect(screen.getByLabelText('Загрузка товаров')).toBeInTheDocument();
  });
});
