'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useFilters } from '@/hooks/use-filters';
import { useCategories } from '@/hooks/use-categories';

const CONDITION_OPTIONS = [
  { value: 8, label: 'Отличное (8-10)' },
  { value: 5, label: 'Хорошее (5-7)' },
  { value: 1, label: 'Удовл. (1-4)' },
];

export function FilterSheet() {
  const { filters, setFilter, clearFilters, activeFilterCount } = useFilters();
  const { data: categories } = useCategories();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="lg:hidden gap-1.5" />
        }
      >
        <SlidersHorizontal className="size-4" />
        Фильтры
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
            {activeFilterCount}
          </Badge>
        )}
      </SheetTrigger>

      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 px-4">
          {/* Category */}
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-muted-foreground">
              Категория
            </legend>
            <div className="space-y-2">
              {categories?.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-3 text-sm py-1 cursor-pointer min-h-[44px]"
                >
                  <input
                    type="radio"
                    name="category-mobile"
                    value={cat.id}
                    checked={filters.category === cat.id}
                    onChange={() =>
                      setFilter(
                        'category',
                        filters.category === cat.id ? undefined : cat.id,
                      )
                    }
                    className="size-5 accent-primary"
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
                  Сбросить категорию
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
                onChange={(e) => {
                  const v = e.target.value;
                  setFilter('priceMin', v === '' ? undefined : Number(v));
                }}
                aria-label="Минимальная цена"
                min={0}
                className="h-11 text-base"
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                placeholder="до"
                value={filters.priceMax ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setFilter('priceMax', v === '' ? undefined : Number(v));
                }}
                aria-label="Максимальная цена"
                min={0}
                className="h-11 text-base"
              />
            </div>
          </fieldset>

          <Separator />

          {/* Condition */}
          <fieldset>
            <legend className="mb-2 text-xs font-medium text-muted-foreground">
              Состояние
            </legend>
            <div className="space-y-2">
              {CONDITION_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 text-sm py-1 cursor-pointer min-h-[44px]"
                >
                  <input
                    type="radio"
                    name="condition-mobile"
                    value={opt.value}
                    checked={filters.condition === opt.value}
                    onChange={() =>
                      setFilter(
                        'condition',
                        filters.condition === opt.value ? undefined : opt.value,
                      )
                    }
                    className="size-5 accent-primary"
                    aria-label={opt.label}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <SheetFooter>
          {activeFilterCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Сбросить
            </Button>
          )}
          <SheetClose
            render={<Button className="flex-1" />}
          >
            Показать товары
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
