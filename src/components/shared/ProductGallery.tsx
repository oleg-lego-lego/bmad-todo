'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

const PLACEHOLDER = '/images/placeholder.svg';

export function ProductGallery({ images, title, className }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (images.length === 0) {
    return (
      <div
        role="region"
        aria-label="Галерея фото"
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted ${className ?? ''}`}
      >
        <Image
          src={PLACEHOLDER}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div role="region" aria-label="Галерея фото" className={className}>
      {/* Main slider */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={8}
        slidesPerView={1}
        className="aspect-[4/3] w-full overflow-hidden rounded-lg"
      >
        {images.map((src, i) => (
          <SwiperSlide key={src + i}>
            <div className="relative h-full w-full bg-muted">
              <Image
                src={src}
                alt={`${title} — фото ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails — desktop only */}
      {images.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={6}
          slidesPerView={Math.min(images.length, 5)}
          watchSlidesProgress
          className="mt-2 hidden lg:block"
        >
          {images.map((src, i) => (
            <SwiperSlide key={src + i}>
              <div className="relative aspect-square cursor-pointer overflow-hidden rounded-md bg-muted">
                <Image
                  src={src}
                  alt={`${title} — миниатюра ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
