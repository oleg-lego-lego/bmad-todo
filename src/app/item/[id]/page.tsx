import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import { getItemById } from '@/api/items';
import { PageContainer } from '@/components/layout/PageContainer';
import { ItemPageContent } from './components/ItemPageContent';

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const item = await getItemById(id);

    return {
      title: `${item.title} — PawnMarket`,
      description: item.description,
      openGraph: {
        title: `${item.title} — PawnMarket`,
        description: item.description,
        images: item.images?.[0] ? [item.images[0]] : [],
      },
    };
  } catch {
    return { title: 'Товар не найден — PawnMarket' };
  }
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;

  let item;
  try {
    item = await getItemById(id);
  } catch {
    notFound();
  }

  if (!item) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    description: item.description,
    image: item.images ?? [],
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageContainer>
        {/* Breadcrumbs */}
        <nav aria-label="Хлебные крошки" className="mb-4">
          <ol className="flex items-center gap-1.5 text-caption text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/catalog" className="hover:text-foreground transition-colors">
                Каталог
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-foreground truncate" aria-current="page">
                {item.title}
              </span>
            </li>
          </ol>
        </nav>

        <ItemPageContent id={id} />
      </PageContainer>
    </>
  );
}
