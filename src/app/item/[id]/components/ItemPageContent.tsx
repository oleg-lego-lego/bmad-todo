'use client';

import { useItem } from '@/hooks/use-items';
import { useShop } from '@/hooks/use-shops';
import { ProductGallery } from '@/components/shared/ProductGallery';
import { TrustBadge } from '@/components/shared/TrustBadge';
import { ItemTimeline } from '@/components/shared/ItemTimeline';
import { AddToCartButton } from './AddToCartButton';
import { formatPrice } from '@/lib/format-price';

interface ItemPageContentProps {
  id: string;
}

export function ItemPageContent({ id }: ItemPageContentProps) {
  const { data: item, isLoading, isError } = useItem(id);
  const { data: shop } = useShop(item?.shopId ?? '');

  if (isLoading) {
    return <ItemPageSkeleton />;
  }

  if (isError || !item) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {/* First screen: gallery + info */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Gallery — 60% on desktop */}
        <div className="w-full lg:w-[60%]">
          <ProductGallery
            images={item.images ?? []}
            title={item.title}
          />
        </div>

        {/* Info — 40% on desktop */}
        <div className="flex flex-col gap-4 w-full lg:w-[40%]">
          <TrustBadge rating={item.trustRating} variant="full" />

          <p className="text-price text-foreground">
            {formatPrice(item.price)}
          </p>

          <h1 className="text-h2 font-bold text-foreground">
            {item.title}
          </h1>

          <div className="flex items-center gap-2">
            <span className="text-body text-muted-foreground">Состояние:</span>
            <span className="text-body font-medium text-foreground">
              {item.condition ?? '-'}/10
            </span>
          </div>

          {/* Desktop: AddToCart inline */}
          <div className="hidden lg:block mt-2">
            <AddToCartButton />
          </div>

          {/* Shop info */}
          {shop && (
            <div className="mt-2 rounded-lg border border-border bg-card p-4">
              <h2 className="text-h3 font-semibold text-foreground mb-2">
                Информация о ломбарде
              </h2>
              <p className="text-body text-foreground font-medium">
                {shop.name}
              </p>
              <p className="text-body text-muted-foreground mt-1">
                {shop.address}
              </p>
              {shop.phone && (
                <p className="text-body text-muted-foreground">
                  {shop.phone}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll content */}
      <ItemTimeline events={item.timeline ?? []} />

      {/* Description */}
      {item.description && (
        <section>
          <h2 className="text-h3 font-semibold text-foreground mb-3">
            Описание
          </h2>
          <p className="text-body text-foreground whitespace-pre-line">
            {item.description}
          </p>
        </section>
      )}

      {/* Mobile: sticky AddToCart at bottom */}
      <div className="lg:hidden">
        <AddToCartButton />
      </div>
    </div>
  );
}

function ItemPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 animate-pulse">
      <div className="w-full lg:w-[60%] aspect-[4/3] rounded-lg bg-muted" />
      <div className="flex flex-col gap-3 w-full lg:w-[40%]">
        <div className="h-12 w-32 rounded-lg bg-muted" />
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="h-6 w-64 rounded bg-muted" />
        <div className="h-5 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}
