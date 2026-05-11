'use client';

import Link from 'next/link';
import { useItem } from '@/hooks/use-items';
import { PageContainer } from '@/components/layout/PageContainer';
import { ItemPageContent } from './components/ItemPageContent';

import { useParams } from 'next/navigation';

export default function ItemPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: item, isLoading } = useItem(id);

  if (!isLoading && !item) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <h1 className="text-h2 font-bold text-foreground">Товар не найден</h1>
          <p className="text-body text-muted-foreground">
            Возможно, он был удалён или ссылка неверна.
          </p>
          <Link
            href="/catalog"
            className="rounded-button bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Вернуться в каталог
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Breadcrumbs */}
      <nav aria-label="Хлебные крошки" className="mb-4">
        <ol className="flex items-center gap-1.5 text-caption text-muted-foreground overflow-hidden min-w-0">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Главная
            </Link>
          </li>
          <li aria-hidden="true" className="flex-shrink-0">/</li>
          <li>
            <Link href="/catalog" className="hover:text-foreground transition-colors">
              Каталог
            </Link>
          </li>
          <li aria-hidden="true" className="flex-shrink-0">/</li>
          <li className="min-w-0">
            {item ? (
              <span className="text-foreground truncate block" aria-current="page">
                {item.title}
              </span>
            ) : (
              <span className="inline-block h-4 w-32 animate-pulse rounded bg-muted" />
            )}
          </li>
        </ol>
      </nav>

      <ItemPageContent id={id} />
    </PageContainer>
  );
}
