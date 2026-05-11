'use client';

import { Suspense, useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SearchBar } from './components/SearchBar';
import { SortSelect } from './components/SortSelect';
import { FilterSidebar } from './components/FilterSidebar';
import { FilterSheet } from './components/FilterSheet';
import { CatalogGrid } from './components/CatalogGrid';
import { Breadcrumbs } from './components/Breadcrumbs';
import { useFilters } from '@/hooks/use-filters';

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
  const [totalCount, setTotalCount] = useState(0);
  const handleTotalCount = useCallback((count: number) => setTotalCount(count), []);

  return (
    <PageContainer>
      <Breadcrumbs />

      <h1 className="text-h1 font-bold text-foreground mb-4">Каталог</h1>

      {/* Toolbar */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar />
          </div>
          <SortSelect />
          <FilterSheet />
          {totalCount > 0 && (
            <span className="text-sm text-muted-foreground">
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
          <CatalogGrid filters={filters} onTotalCount={handleTotalCount} />
        </div>
      </div>
    </PageContainer>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="mb-4 h-9 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </PageContainer>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
