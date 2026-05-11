import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/app/catalog/components/SearchBar';

const mockSetFilter = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('@/hooks/use-filters', () => ({
  useFilters: () => ({
    filters: { search: mockSearchParams.get('search') ?? undefined },
    setFilter: mockSetFilter,
    clearFilters: vi.fn(),
    hasActiveFilters: false,
    activeFilterCount: 0,
  }),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of [...mockSearchParams.keys()]) {
      mockSearchParams.delete(key);
    }
  });

  it('renders with placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Поиск товаров...')).toBeInTheDocument();
  });

  it('has search role and aria-label', () => {
    render(<SearchBar />);
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByLabelText('Поиск товаров')).toBeInTheDocument();
  });

  it('calls setFilter with debounce on input', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ delay: null });

    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Поиск товаров...');

    await user.type(input, 'золото');

    // Wait for debounce (300ms)
    await vi.advanceTimersByTimeAsync(400);

    expect(mockSetFilter).toHaveBeenCalledWith('search', 'золото');

    vi.useRealTimers();
  });

  it('shows clear button when text is present', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Поиск товаров...');

    expect(screen.queryByLabelText('Очистить поиск')).not.toBeInTheDocument();

    await user.type(input, 'test');
    expect(screen.getByLabelText('Очистить поиск')).toBeInTheDocument();
  });

  it('clears input on clear button click', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByPlaceholderText('Поиск товаров...');

    await user.type(input, 'test');
    const clearBtn = screen.getByLabelText('Очистить поиск');
    await user.click(clearBtn);

    expect(mockSetFilter).toHaveBeenCalledWith('search', undefined);
  });
});
