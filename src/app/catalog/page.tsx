"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { useItems } from "@/hooks/use-items";
import { useCategories } from "@/hooks/use-categories";
import { formatPrice } from "@/lib/format-price";

export default function CatalogPage() {
  const { data: itemsResponse, isLoading: itemsLoading, error: itemsError } = useItems();
  const { data: categories, isLoading: catLoading } = useCategories();

  if (itemsLoading || catLoading) {
    return (
      <PageContainer>
        <h1 className="text-2xl font-bold text-foreground mb-4">Каталог</h1>
        <p className="text-muted-foreground">Загрузка...</p>
      </PageContainer>
    );
  }

  if (itemsError) {
    return (
      <PageContainer>
        <h1 className="text-2xl font-bold text-foreground mb-4">Каталог</h1>
        <p className="text-red-500">Ошибка: {itemsError.message}</p>
      </PageContainer>
    );
  }

  const items = itemsResponse?.data ?? [];
  const meta = itemsResponse?.meta;

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-foreground mb-4">Каталог</h1>

      <div className="mb-4 text-sm text-muted-foreground">
        Категории: {categories?.map((c) => c.name).join(", ")}
        {meta && ` | Товаров: ${meta.total} (стр. ${meta.page}/${meta.totalPages})`}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 bg-card text-card-foreground"
          >
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-lg font-bold text-primary mb-1">
              {formatPrice(item.price)}
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>Состояние: {item.condition}/10</span>
              <span>Доверие: {item.trustRating}%</span>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
