'use client';

import { useMemo } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProductCard, ProductCardSkeleton } from '@/components/shared/ProductCard';
import { useItems } from '@/hooks/use-items';
import { useShops } from '@/hooks/use-shops';

export default function CatalogPage() {
  const { data: itemsResponse, isLoading: itemsLoading, error: itemsError } = useItems();
  const { data: shops } = useShops();

  const shopsMap = useMemo(() => {
    if (!shops) return new Map<string, import('@/types/shop').Shop>();
    return new Map(shops.map((s) => [s.id, s]));
  }, [shops]);

  const items = itemsResponse?.data ?? [];
  const meta = itemsResponse?.meta;
  const isLoading = itemsLoading || !shops;

  if (isLoading) {
    return (
      <PageContainer>
        <h1 className="text-h1 font-bold text-foreground mb-4">Каталог</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (itemsError) {
    return (
      <PageContainer>
        <h1 className="text-h1 font-bold text-foreground mb-4">Каталог</h1>
        <p className="text-red-500">Ошибка: {itemsError.message}</p>
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return (
      <PageContainer>
        <h1 className="text-h1 font-bold text-foreground mb-4">Каталог</h1>
        <div className="flex flex-col items-center gap-4 py-12">
          <p className="text-body text-secondary">Товары не найдены</p>
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Перейти в каталог
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-h1 font-bold text-foreground">Каталог</h1>
        {meta && (
          <span className="text-caption text-secondary">
            {meta.total}{' '}
            {meta.total === 1
              ? 'товар'
              : meta.total < 5
                ? 'товара'
                : 'товаров'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {items.map((item) => (
          <ProductCard key={item.id} item={item} shop={shopsMap.get(item.shopId)} />
        ))}
      </div>
    </PageContainer>
  );
}
