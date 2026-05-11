import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFilters } from '@/hooks/use-filters';

// Mock next/navigation
const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/catalog',
}));

function clearSearchParams() {
  for (const key of [...mockSearchParams.keys()]) {
    mockSearchParams.delete(key);
  }
}

function setSearchParams(params: Record<string, string>) {
  clearSearchParams();
  for (const [key, value] of Object.entries(params)) {
    mockSearchParams.set(key, value);
  }
}

describe('useFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearSearchParams();
  });

  it('returns default sort when no URL params', () => {
    const { result } = renderHook(() => useFilters());
    expect(result.current.filters).toEqual({ sort: 'date' });
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('reads filters from URL params', () => {
    setSearchParams({
      search: 'золото',
      category: 'cat-1',
      priceMin: '1000',
      priceMax: '5000',
      condition: '8',
      sort: 'price_asc',
    });

    const { result } = renderHook(() => useFilters());
    expect(result.current.filters).toEqual({
      search: 'золото',
      category: 'cat-1',
      priceMin: 1000,
      priceMax: 5000,
      condition: 8,
      sort: 'price_asc',
    });
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('setFilter updates URL', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('search', 'test');
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('search=test'),
      { scroll: false },
    );
  });

  it('setFilter removes param when value is undefined', () => {
    setSearchParams({ search: 'test', sort: 'date' });

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.setFilter('search', undefined);
    });

    expect(mockReplace).toHaveBeenCalled();
    const lastCall = mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0] as string;
    expect(lastCall).not.toContain('search=');
  });

  it('clearFilters removes all params', () => {
    setSearchParams({ search: 'test', category: 'cat-1' });

    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.clearFilters();
    });

    expect(mockReplace).toHaveBeenCalledWith('/catalog', { scroll: false });
  });

  it('counts active filter groups correctly', () => {
    setSearchParams({
      search: 'test',
      category: 'cat-1',
      priceMin: '1000',
      condition: '8',
    });

    const { result } = renderHook(() => useFilters());
    expect(result.current.activeFilterCount).toBe(4);
  });

  it('counts price range as single filter', () => {
    setSearchParams({ priceMin: '1000', priceMax: '5000' });

    const { result } = renderHook(() => useFilters());
    expect(result.current.activeFilterCount).toBe(1);
  });

  it('sort does not count as a filter', () => {
    setSearchParams({ sort: 'price_asc' });

    const { result } = renderHook(() => useFilters());
    expect(result.current.activeFilterCount).toBe(0);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('falls back to default sort for invalid sort value', () => {
    setSearchParams({ sort: 'invalid_value' });

    const { result } = renderHook(() => useFilters());
    expect(result.current.filters.sort).toBe('date');
  });

  it('ignores non-numeric priceMin', () => {
    setSearchParams({ priceMin: 'abc' });

    const { result } = renderHook(() => useFilters());
    expect(result.current.filters.priceMin).toBeUndefined();
  });
});
