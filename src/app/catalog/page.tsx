'use client';

import { Suspense } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SearchBar } from './components/SearchBar';
import { SortSelect } from './components/SortSelect';
import { FilterSidebar } from './components/FilterSidebar';
import { FilterSheet } from './components/FilterSheet';
import { CatalogGrid } from './components/CatalogGrid';
import { Breadcrumbs } from './components/Breadcrumbs';
import { useFilters } from '@/hooks/use-filters';
import { useItemsInfinite } from '@/hooks/use-items';

function pluralize(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}

function CatalogContent() {
  const { filters } = useFilters();
  const { data } = useItemsInfinite(filters);
  const totalCount = data?.pages[0]?.meta?.total ?? 0;

  return (
    <PageContainer>
      <Breadcrumbs />

      {/* Toolbar */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FilterSheet />
          <SortSelect />
          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground ml-auto">
              {totalCount}{' '}
              {pluralize(totalCount, ['товар', 'товара', 'товаров'])}
            </span>
          )}
        </div>
      </div>

      {/* Layout: sidebar + grid */}
      <div className="flex gap-6">
        <FilterSidebar />
        <div className="flex-1 min-w-0">
          <CatalogGrid filters={filters} />
        </div>
      </div>
    </PageContainer>
  );
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  );
}
