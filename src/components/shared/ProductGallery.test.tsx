import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGallery } from '@/components/shared/ProductGallery';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill,
    sizes,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-fill={fill ? 'true' : undefined}
      data-sizes={sizes}
      {...props}
    />
  ),
}));

// Mock swiper
vi.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

vi.mock('swiper/modules', () => ({
  Navigation: {},
  Thumbs: {},
  Pagination: {},
}));

describe('ProductGallery', () => {
  it('renders gallery with images', () => {
    const images = ['/images/placeholder.webp', '/images/placeholder.webp'];

    render(<ProductGallery images={images} title="Test Item" />);

    expect(screen.getByRole('region', { name: 'Галерея фото' })).toBeInTheDocument();
  });

  it('renders alt texts for images', () => {
    const images = ['/images/img1.webp', '/images/img2.webp'];

    render(<ProductGallery images={images} title="Кольцо" />);

    const imgs = screen.getAllByRole('img');
    expect(imgs[0]).toHaveAttribute('alt', 'Кольцо — фото 1');
    expect(imgs[1]).toHaveAttribute('alt', 'Кольцо — фото 2');
  });

  it('renders empty state when no images', () => {
    render(<ProductGallery images={[]} title="Пустой товар" />);

    const region = screen.getByRole('region', { name: 'Галерея фото' });
    expect(region).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Пустой товар');
    expect(img).toHaveAttribute('src', '/images/placeholder.webp');
  });

  it('renders single image without thumbnails', () => {
    render(<ProductGallery images={['/images/single.webp']} title="Single" />);

    const slides = screen.getAllByTestId('swiper-slide');
    expect(slides).toHaveLength(1);
  });

  it('uses lazy loading for non-first images', () => {
    const images = ['/images/img1.webp', '/images/img2.webp', '/images/img3.webp'];

    render(<ProductGallery images={images} title="Test" />);

    const imgs = screen.getAllByRole('img');
    expect(imgs[0]).toHaveAttribute('loading', 'eager');
    expect(imgs[1]).toHaveAttribute('loading', 'lazy');
    expect(imgs[2]).toHaveAttribute('loading', 'lazy');
  });

  it('applies custom className', () => {
    render(
      <ProductGallery images={['/images/test.webp']} title="Test" className="custom-class" />,
    );

    const region = screen.getByRole('region', { name: 'Галерея фото' });
    expect(region.className).toContain('custom-class');
  });
});
