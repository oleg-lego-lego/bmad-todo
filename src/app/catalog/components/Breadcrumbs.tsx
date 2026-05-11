import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  return (
    <nav aria-label="Хлебные крошки" className="mb-4">
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            Главная
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-3.5" />
        </li>
        <li>
          <span className="text-foreground font-medium" aria-current="page">
            Каталог
          </span>
        </li>
      </ol>
    </nav>
  );
}
