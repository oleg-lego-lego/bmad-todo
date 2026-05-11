'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { ItemFilters } from '@/types/item';

type SortValue = ItemFilters['sort'];

export function useFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters: ItemFilters = useMemo(() => {
    const result: ItemFilters = {};

    const search = searchParams.get('search');
    if (search) result.search = search;

    const category = searchParams.get('category');
    if (category) result.category = category;

    const priceMin = searchParams.get('priceMin');
    if (priceMin) result.priceMin = Number(priceMin);

    const priceMax = searchParams.get('priceMax');
    if (priceMax) result.priceMax = Number(priceMax);

    const condition = searchParams.get('condition');
    if (condition) result.condition = Number(condition);

    const sort = searchParams.get('sort') as SortValue;
    if (sort) result.sort = sort;

    return result;
  }, [searchParams]);

  const setFilter = useCallback(
    (key: string, value: string | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === '' || value === 0) {
        params.delete(key);
      } else {
        params.set(key, String(value));
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
      searchParams.has('condition') ||
      searchParams.has('sort')
    );
  }, [searchParams]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchParams.has('search')) count++;
    if (searchParams.has('category')) count++;
    if (searchParams.has('priceMin') || searchParams.has('priceMax')) count++;
    if (searchParams.has('condition')) count++;
    // sort is not counted as a "filter"
    return count;
  }, [searchParams]);

  return { filters, setFilter, clearFilters, hasActiveFilters, activeFilterCount };
}
