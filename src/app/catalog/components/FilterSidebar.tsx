'use client';

import { useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useFilters } from '@/hooks/use-filters';
import { useCategories } from '@/hooks/use-categories';

const CONDITION_OPTIONS = [
  { value: 8, label: 'Отличное (8-10)' },
  { value: 5, label: 'Хорошее (5-7)' },
  { value: 1, label: 'Удовл. (1-4)' },
];

const DEBOUNCE_MS = 300;

export function FilterSidebar() {
  const { filters, setFilter, clearFilters, activeFilterCount } = useFilters();
  const { data: categories } = useCategories();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const debouncedSetFilter = useCallback(
    (key: string, value: string | number | undefined) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setFilter(key, value);
      }, DEBOUNCE_MS);
    },
    [setFilter],
  );

  const handlePriceMinChange = (value: string) => {
    const num = value === '' ? undefined : Number(value);
    if (num !== undefined && num < 0) return;
    debouncedSetFilter('priceMin', num);
  };

  const handlePriceMaxChange = (value: string) => {
    const num = value === '' ? undefined : Number(value);
    if (num !== undefined && num < 0) return;
    debouncedSetFilter('priceMax', num);
  };

  return (
    <aside className="hidden lg:block w-60 shrink-0" aria-label="Фильтры">
      <div className="sticky top-4 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Фильтры</h2>
          {activeFilterCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {activeFilterCount} акт.
            </span>
          )}
        </div>

        <Separator />

        {/* Category */}
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted-foreground">
            Категория
          </legend>
          <div className="space-y-1.5">
            {categories?.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-sm cursor-pointer min-h-[44px]"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.slug}
                  checked={filters.category === cat.slug}
                  onChange={() =>
                    setFilter(
                      'category',
                      filters.category === cat.slug ? undefined : cat.slug,
                    )
                  }
                  className="size-4 accent-primary"
                  aria-label={cat.name}
                />
                {cat.name}
              </label>
            ))}
            {filters.category && (
              <button
                type="button"
                onClick={() => setFilter('category', undefined)}
                className="text-xs text-primary hover:underline min-h-[44px] flex items-center"
              >
                Сбросить
              </button>
            )}
          </div>
        </fieldset>

        <Separator />

        {/* Price range */}
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted-foreground">
            Цена, ₽
          </legend>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="от"
              value={filters.priceMin ?? ''}
              onChange={(e) => handlePriceMinChange(e.target.value)}
              aria-label="Минимальная цена"
              min={0}
              className="h-11 text-sm"
            />
            <span className="text-muted-foreground">—</span>
            <Input
              type="number"
              placeholder="до"
              value={filters.priceMax ?? ''}
              onChange={(e) => handlePriceMaxChange(e.target.value)}
              aria-label="Максимальная цена"
              min={0}
              className="h-11 text-sm"
            />
          </div>
        </fieldset>

        <Separator />

        {/* Condition */}
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted-foreground">
            Состояние
          </legend>
          <div className="space-y-1.5">
            {CONDITION_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm cursor-pointer min-h-[44px]"
              >
                <input
                  type="radio"
                  name="condition"
                  value={opt.value}
                  checked={filters.condition === opt.value}
                  onChange={() =>
                    setFilter(
                      'condition',
                      filters.condition === opt.value ? undefined : opt.value,
                    )
                  }
                  className="size-4 accent-primary"
                  aria-label={opt.label}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <Separator />

        {activeFilterCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            Сбросить фильтры
          </Button>
        )}
      </div>
    </aside>
  );
}
