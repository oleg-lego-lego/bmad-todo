'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useItemsInfinite } from '@/hooks/use-items';
import { useShops } from '@/hooks/use-shops';
import { ProductCard, ProductCardSkeleton } from '@/components/shared/ProductCard';
import type { ItemFilters } from '@/types/item';
import type { Shop } from '@/types/shop';

interface CatalogGridProps {
  filters: ItemFilters;
}

export function CatalogGrid({ filters }: CatalogGridProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useItemsInfinite(filters);

  const { data: shops } = useShops();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const shopsMap = new Map<string, Shop>(
    shops?.map((s) => [s.id, s]) ?? [],
  );

  // Infinite scroll via Intersection Observer
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allItems = data?.pages.flatMap((page) => page.data) ?? [];

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Ошибка: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        aria-busy="true"
        aria-label="Загрузка товаров"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12" aria-live="polite">
        <p className="text-body text-secondary">Товары не найдены</p>
        <Link
          href="/catalog"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px] flex items-center"
        >
          Сбросить фильтры
        </Link>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {allItems.map((item) => (
          <ProductCard key={item.id} item={item} shop={shopsMap.get(item.shopId)} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-4 text-center">
        {isFetchingNextPage && (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            aria-busy="true"
            aria-label="Загрузка товаров"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={`more-${i}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
