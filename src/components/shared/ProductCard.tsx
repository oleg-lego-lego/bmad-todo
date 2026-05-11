'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format-price';
import { Skeleton } from '@/components/ui/skeleton';
import { TrustBadge } from '@/components/shared/TrustBadge';
import type { Item } from '@/types/item';
import type { Shop } from '@/types/shop';

interface ProductCardProps {
  item: Item;
  shop?: Shop;
  className?: string;
}

export function ProductCard({ item, shop, className }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = item.images[0] || '/images/placeholder.svg';

  return (
    <Link href={`/item/${item.id}`} className="group/block">
      <article
        className={cn(
          'overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md',
          'lg:flex lg:flex-row',
          className,
        )}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden lg:w-40 lg:aspect-auto lg:h-auto lg:min-h-[120px]">
          {imgError ? (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="text-muted-foreground"
              >
                <rect
                  x="8"
                  y="12"
                  width="32"
                  height="24"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="18" cy="21" r="3" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M8 32L18 24L26 30L32 24L40 32"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <Image
              src={imageSrc}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          )}

          {/* TrustBadge overlay */}
          <div className="absolute top-2 right-2 z-10">
            <TrustBadge rating={item.trustRating} variant="compact" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 p-3 lg:flex-1 lg:justify-center">
          <p className="text-price text-primary">{formatPrice(item.price)}</p>
          <h3 className="text-body line-clamp-2 font-medium text-card-foreground">
            {item.title}
          </h3>
          <p className="text-caption text-secondary">
            Сост: {item.condition}/10{shop ? ` · ${shop.name}` : ''}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card lg:flex lg:flex-row">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full lg:w-40 lg:aspect-auto lg:h-auto lg:min-h-[120px]" />

      {/* Content skeleton */}
      <div className="flex flex-col gap-2 p-3 lg:flex-1 lg:justify-center">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}
