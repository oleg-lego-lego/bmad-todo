import { apiFetch, apiFetchPaginated } from './client';
import type { Item, ItemFilters } from '@/types/item';

export function getItems(filters?: ItemFilters) {
  const params = new URLSearchParams();

  if (filters?.page != null) params.set('page', String(filters.page));
  if (filters?.limit != null) params.set('limit', String(filters.limit));
  if (filters?.category) params.set('category', filters.category);
  if (filters?.priceMin != null) params.set('priceMin', String(filters.priceMin));
  if (filters?.priceMax != null) params.set('priceMax', String(filters.priceMax));
  if (filters?.condition != null) params.set('condition', String(filters.condition));
  if (filters?.sort) params.set('sort', filters.sort);
  if (filters?.search) params.set('search', filters.search);

  const qs = params.toString();
  const path = qs ? `/items?${qs}` : '/items';

  return apiFetchPaginated<Item[]>(path);
}

export function getItemById(id: string) {
  return apiFetch<Item>(`/items/${id}`);
}
