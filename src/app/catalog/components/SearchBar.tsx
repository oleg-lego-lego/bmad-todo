'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useFilters } from '@/hooks/use-filters';

const DEBOUNCE_MS = 300;

export function SearchBar() {
  const { filters, setFilter } = useFilters();
  const externalSearch = filters.search ?? '';
  const [draft, setDraft] = useState(externalSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync local draft when external search param changes (browser nav, external clear)
  useEffect(() => {
    setDraft(externalSearch); // eslint-disable-line react-hooks/set-state-in-effect -- legitimate sync from URL to local input state
  }, [externalSearch]);

  const handleChange = useCallback(
    (value: string) => {
      setDraft(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        setFilter('search', value || undefined);
      }, DEBOUNCE_MS);
    },
    [setFilter],
  );

  const handleClear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setDraft('');
    setFilter('search', undefined);
  }, [setFilter]);

  return (
    <div role="search" className="relative">
      <Search
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="text"
        value={draft}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Поиск товаров..."
        aria-label="Поиск товаров"
        className="flex h-8 w-full rounded-lg border border-input bg-transparent px-9 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {draft && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Очистить поиск"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
