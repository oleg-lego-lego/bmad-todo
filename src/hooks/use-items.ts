import { useQuery } from '@tanstack/react-query';
import { getItems, getItemById } from '@/api/items';
import { STALE_TIMES } from '@/lib/constants';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import type { ItemFilters } from '@/types/item';

export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (filters: ItemFilters) => [...itemKeys.lists(), filters] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
};

export function useItems(filters?: ItemFilters) {
  const mergedFilters: ItemFilters = {
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    ...filters,
  };

  return useQuery({
    queryKey: itemKeys.list(mergedFilters),
    queryFn: () => getItems(mergedFilters),
    staleTime: STALE_TIMES.catalog,
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => getItemById(id),
    staleTime: STALE_TIMES.item,
    enabled: !!id,
  });
}
