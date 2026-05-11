import { useQuery } from '@tanstack/react-query';
import { getShops, getShopById } from '@/api/shops';
import { STALE_TIMES } from '@/lib/constants';

export const shopKeys = {
  all: ['shops'] as const,
  lists: () => [...shopKeys.all, 'list'] as const,
  list: () => [...shopKeys.lists()] as const,
  details: () => [...shopKeys.all, 'detail'] as const,
  detail: (id: string) => [...shopKeys.details(), id] as const,
};

export function useShops() {
  return useQuery({
    queryKey: shopKeys.list(),
    queryFn: getShops,
    staleTime: STALE_TIMES.catalog,
  });
}

export function useShop(id: string) {
  return useQuery({
    queryKey: shopKeys.detail(id),
    queryFn: () => getShopById(id),
    staleTime: STALE_TIMES.catalog,
    enabled: !!id,
  });
}
