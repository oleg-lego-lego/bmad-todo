'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { ItemFilters } from '@/types/item';

const VALID_SORT_VALUES: readonly string[] = ['price_asc', 'price_desc', 'date', 'trust_rating'];
const DEFAULT_SORT = 'date';

function toNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);

  // Set default sort in URL on first visit
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (!searchParams.has('sort')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', DEFAULT_SORT);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
   
  }, []);

  const filters: ItemFilters = useMemo(() => {
    const result: ItemFilters = {};

    const search = searchParams.get('search');
    if (search) result.search = search;

    const category = searchParams.get('category');
    if (category) result.category = category;

    const priceMin = toNumber(searchParams.get('priceMin'));
    if (priceMin !== undefined) result.priceMin = priceMin;

    const priceMax = toNumber(searchParams.get('priceMax'));
    if (priceMax !== undefined) result.priceMax = priceMax;

    const condition = toNumber(searchParams.get('condition'));
    if (condition !== undefined) result.condition = condition;

    const sortRaw = searchParams.get('sort');
    if (sortRaw && VALID_SORT_VALUES.includes(sortRaw)) {
      result.sort = sortRaw as ItemFilters['sort'];
    } else {
      result.sort = DEFAULT_SORT;
    }

    return result;
  }, [searchParams]);

  const setFilter = useCallback(
    (key: string, value: string | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      // Validate price range: clear priceMax if priceMin exceeds it
      if (key === 'priceMin' && value !== undefined && value !== '') {
        const currentMax = Number(params.get('priceMax'));
        if (!Number.isNaN(currentMax) && Number(value) > currentMax) {
          params.delete('priceMax');
        }
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters = useMemo(() => {
    return (
      searchParams.has('search') ||
      searchParams.has('category') ||
      searchParams.has('priceMin') ||
      searchParams.has('priceMax') ||
      searchParams.has('condition')
    );
  }, [searchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchParams.has('search')) count++;
    if (searchParams.has('category')) count++;
    if (searchParams.has('priceMin') || searchParams.has('priceMax')) count++;
    if (searchParams.has('condition')) count++;
    return count;
  }, [searchParams]);

  return { filters, setFilter, clearFilters, hasActiveFilters, activeFilterCount };
}
