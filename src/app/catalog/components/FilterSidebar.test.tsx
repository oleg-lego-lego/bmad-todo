import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterSidebar } from '@/app/catalog/components/FilterSidebar';

const mockSetFilter = vi.fn();
const mockClearFilters = vi.fn();

vi.mock('@/hooks/use-filters', () => ({
  useFilters: () => ({
    filters: {},
    setFilter: mockSetFilter,
    clearFilters: mockClearFilters,
    hasActiveFilters: false,
    activeFilterCount: 0,
  }),
}));

vi.mock('@/hooks/use-categories', () => ({
  useCategories: () => ({
    data: [
      { id: 'cat-1', name: 'Ювелирные изделия', slug: 'jewelry', filterOptions: [] },
      { id: 'cat-2', name: 'Техника', slug: 'electronics', filterOptions: [] },
      { id: 'cat-3', name: 'Часы', slug: 'watches', filterOptions: [] },
    ],
  }),
}));

describe('FilterSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filter sections', () => {
    render(<FilterSidebar />);
    expect(screen.getByText('Категория')).toBeInTheDocument();
    expect(screen.getByText('Цена, ₽')).toBeInTheDocument();
    expect(screen.getByText('Состояние')).toBeInTheDocument();
  });

  it('renders category options', () => {
    render(<FilterSidebar />);
    expect(screen.getByLabelText('Ювелирные изделия')).toBeInTheDocument();
    expect(screen.getByLabelText('Техника')).toBeInTheDocument();
    expect(screen.getByLabelText('Часы')).toBeInTheDocument();
  });

  it('renders condition options', () => {
    render(<FilterSidebar />);
    expect(screen.getByLabelText('Отличное (8-10)')).toBeInTheDocument();
    expect(screen.getByLabelText('Хорошее (5-7)')).toBeInTheDocument();
    expect(screen.getByLabelText('Удовл. (1-4)')).toBeInTheDocument();
  });

  it('calls setFilter when category is selected', async () => {
    const user = userEvent.setup();
    render(<FilterSidebar />);
    await user.click(screen.getByLabelText('Техника'));
    expect(mockSetFilter).toHaveBeenCalledWith('category', 'cat-2');
  });

  it('calls setFilter when condition is selected', async () => {
    const user = userEvent.setup();
    render(<FilterSidebar />);
    await user.click(screen.getByLabelText('Отличное (8-10)'));
    expect(mockSetFilter).toHaveBeenCalledWith('condition', 8);
  });

  it('renders price inputs', () => {
    render(<FilterSidebar />);
    expect(screen.getByLabelText('Минимальная цена')).toBeInTheDocument();
    expect(screen.getByLabelText('Максимальная цена')).toBeInTheDocument();
  });
});
