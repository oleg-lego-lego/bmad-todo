'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/hooks/use-filters';
import type { ItemFilters } from '@/types/item';

const SORT_OPTIONS: { value: ItemFilters['sort']; label: string }[] = [
  { value: 'date', label: 'По дате' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
  { value: 'trust_rating', label: 'По рейтингу' },
];

export function SortSelect() {
  const { filters, setFilter } = useFilters();
  const currentValue = filters.sort ?? 'date';

  const handleValueChange = (value: string | null) => {
    setFilter('sort', value || undefined);
  };

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger aria-label="Сортировка" size="sm">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value!}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
