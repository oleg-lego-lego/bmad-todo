import { apiFetch } from './client';
import type { Shop } from '@/types/shop';

export function getShops(): Promise<Shop[]> {
  return apiFetch<Shop[]>('/shops');
}

export function getShopById(id: string): Promise<Shop> {
  return apiFetch<Shop>(`/shops/${id}`);
}
