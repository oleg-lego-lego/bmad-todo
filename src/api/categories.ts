import { apiFetch } from './client';
import type { Category } from '@/types/category';

export function getCategories() {
  return apiFetch<Category[]>('/categories');
}
