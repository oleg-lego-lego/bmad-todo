# Story 1.3: TrustBadge и ProductCard

Status: review

## Story

As a покупатель,
I want видеть карточку товара в каталоге с рейтингом прозрачности,
So that могу с первого взгляда оценить доверие к товару.

## Acceptance Criteria

1. **AC1: TrustBadge — compact вариант (каталог)**
   - Given товар имеет `trustRating` от 0 до 100
   - When отображается TrustBadge в compact варианте
   - Then ≥80 — зелёный фон (#22C55E на #F0FDF4), 50-79 — жёлтый (#EAB308 на #FEFCE8), <50 — красный (#EF4444 на #FEF2F2)
   - And показывает число (rating) и текст «Рейтинг прозрачности»
   - And `aria-label="Рейтинг прозрачности: X из 100"`

2. **AC2: TrustBadge — full вариант (карточка товара)**
   - Given товар имеет `trustRating` и значение `condition`
   - When отображается TrustBadge в full варианте
   - Then показывает расширенную информацию: рейтинг + уровень доверия текстом + цветовой индикатор
   - And `aria-label="Рейтинг прозрачности: X из 100, уровень: высокий/средний/низкий"`

3. **AC3: ProductCard — карточка товара в каталоге**
   - Given API-слой отдаёт данные о товарах через `useItems` hook
   - When отображается список товаров
   - Then каждый товар показывает ProductCard: фото, TrustBadge (compact, наложение правый верхний угол), цена, название, состояние, ломбард
   - And mobile (default): фото сверху → бейдж → цена крупно → название → состояние и ломбард
   - And desktop (lg:): фото слева, контент справа (горизонтальная компоновка)
   - And `next/image` с `sizes` и `lazy loading`

4. **AC4: ProductCard — состояния default/hover/loading**
   - When карточка в default состоянии — стандартный вид
   - When hover — subtle lift (shadow) или border highlight
   - When loading — skeleton-заглушка (фото + текстовые строки)

5. **AC5: ProductCard — доступность**
   - And touch targets min 44x44px на mobile
   - And семантический HTML: `<article>`, заголовок, alt для изображения
   - And карточка кликабельна — ведёт на `/item/[id]` (ссылка)

6. **AC6: Интеграция с каталогом**
   - When открывается `/catalog`
   - Then товары отображаются в сетке ProductCard вместо текущих plain-карточек
   - And grid: 2 col mobile (sm:), 3 col tablet (md:), 4 col desktop (lg:)
   - And skeleton минимум 3 карточки при загрузке
   - And пустое состояние: текст + CTA при отсутствии результатов

7. **AC7: Данные о ломбарде в карточке**
   - Given товар содержит `shopId`
   - When отображается ProductCard
   - Then показывается название ломбарда (lookup из shops.json через hook или в данных товара)

## Tasks / Subtasks

- [x] Task 1: TrustBadge компонент (AC: #1, #2)
  - [x] 1.1 Создать `src/components/shared/TrustBadge.tsx` — compact и full варианты
  - [x] 1.2 Логика уровней: high (≥80), medium (50-79), low (<50) — маппинг на trust CSS vars
  - [x] 1.3 ARIA: `aria-label` с рейтингом и уровнем

- [x] Task 2: ProductCard компонент (AC: #3, #4, #5)
  - [x] 2.1 Создать `src/components/shared/ProductCard.tsx` — карточка товара
  - [x] 2.2 Компоновка: mobile (вертикальная) / desktop (горизонтальная) через Tailwind responsive
  - [x] 2.3 TrustBadge наложение на фото — `absolute` позиционирование правый верхний угол
  - [x] 2.4 Состояние hover — shadow/border transition
  - [x] 2.5 Состояние loading — ProductCardSkeleton с shadcn Skeleton
  - [x] 2.6 Обёртка в Link → `/item/[id]`, семантика `<article>`

- [x] Task 3: Hook для данных ломбарда (AC: #7)
  - [x] 3.1 Создать `src/hooks/use-shops.ts` — useShops, useShop(id) с key factory
  - [x] 3.2 Создать `src/api/shops.ts` — getShops, getShopById
  - [x] 3.3 Создать `src/mocks/handlers/shops.ts` — GET /api/shops, GET /api/shops/:id

- [x] Task 4: Интеграция с каталогом (AC: #6)
  - [x] 4.1 Обновить `src/app/catalog/page.tsx` — заменить plain-карточки на ProductCard
  - [x] 4.2 Grid layout: 2/3/4 col responsive
  - [x] 4.3 Skeleton: минимум 3 ProductCardSkeleton при загрузке
  - [x] 4.4 Пустое состояние: текст + CTA «Перейти в каталог»

- [x] Task 5: Верификация (AC: все)
  - [x] 5.1 `pnpm build` — без ошибок
  - [x] 5.2 `pnpm dev` — каталог показывает ProductCard с TrustBadge, hover, skeleton
  - [x] 5.3 `tsc --noEmit` — без ошибок типов
  - [x] 5.4 Проверка responsive: mobile / tablet / desktop

## Dev Notes

### Архитектурный контекст

**Слои данных (ЗАПРЕЩЕНО нарушать):**
```
Components → hooks/ → api/ → MSW handlers → JSON data
```
- Компоненты НЕ знают об источнике данных — только hooks
- Hooks НЕ знают о fetch-реализации — только api-функции

**Запрещено**: вызывать `api/` напрямую из компонентов. Только через hooks. [Source: architecture.md]

### Существующая кодовая база (Story 1-1 + 1-2)

**Уже существует:**
- `src/types/item.ts` — Item (id, title, description, price, categoryId, condition, trustRating, shopId, images, status, createdAt, timeline)
- `src/types/shop.ts` — Shop (id, name, address, phone, inn, rating, verified)
- `src/hooks/use-items.ts` — useItems(filters), useItem(id), itemKeys factory
- `src/hooks/use-categories.ts` — useCategories(), categoryKeys factory
- `src/lib/format-price.ts` — formatPrice() через Intl.NumberFormat
- `src/lib/constants.ts` — DEFAULT_PAGE_SIZE=12, STALE_TIMES (catalog 5min, item 10min), MAX_CART_ITEMS
- `src/mocks/data/items.json` — 55 товаров (20 jewelry, 15 electronics, 15 watches + 5 extra)
- `src/mocks/data/shops.json` — 5 ломбардов (shop-1 .. shop-5)
- `src/mocks/data/categories.json` — 3 категории с filterOptions
- `src/mocks/handlers/index.ts` — композиция handlers (нужно добавить shops)
- `src/mocks/browser.ts` — MSW browser setup
- `src/components/ui/badge.tsx` — shadcn Badge (base-nova стиль, @base-ui/react)
- `src/components/ui/card.tsx` — shadcn Card (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction)
- `src/components/ui/skeleton.tsx` — shadcn Skeleton (animate-pulse, bg-muted, rounded-md)
- `src/components/layout/PageContainer.tsx` — max-width 1280px wrapper
- `src/app/catalog/page.tsx` — текущая plain-страница каталога (ЗАМЕНИТЬ на ProductCard)
- `src/app/providers.tsx` — QueryClientProvider + MSW init

**Версии**: Next.js 16.2.6, React 19.2.4, React Query v5.100.9, MSW v2.14.5, shadcn/ui (base-nova)

**shadcn/ui стиль**: base-nova (НЕ New York). shadcn использует @base-ui/react. Badge использует `useRender` и `mergeProps` из `@base-ui/react`. [Source: Story 1-1]

### Структура файлов (строго соблюдать)

```
src/
  components/
    shared/                    # NEW — бизнес-компоненты
      TrustBadge.tsx           # NEW — рейтинг прозрачности
      ProductCard.tsx          # NEW — карточка товара в каталоге
  hooks/
    use-shops.ts              # NEW — useShops, useShop, shopKeys factory
  api/
    shops.ts                  # NEW — getShops, getShopById
  mocks/
    handlers/
      shops.ts                # NEW — GET /api/shops, GET /api/shops/:id
      index.ts                # UPDATE — добавить shops handlers
  app/
    catalog/
      page.tsx                # UPDATE — заменить plain на ProductCard grid
```

### TrustBadge — спецификация

**src/components/shared/TrustBadge.tsx:**

```typescript
interface TrustBadgeProps {
  rating: number;          // 0-100
  variant: 'compact' | 'full';
  className?: string;
}
```

Логика уровней:
- `rating >= 80` → high → цвет `var(--trust-high)`, фон `var(--trust-high-bg)`, текст «Высокий»
- `rating >= 50 && rating < 80` → medium → `var(--trust-medium)`, `var(--trust-medium-bg)`, текст «Средний»
- `rating < 50` → low → `var(--trust-low)`, `var(--trust-low-bg)`, текст «Низкий»

**compact**: маленький бейдж с числом, цветной фон. Использует CSS vars `--trust-high`, `--trust-high-bg` и т.д. из globals.css. НЕ использовать shadcn Badge — у него другие стили. Делать через Tailwind с inline style или CSS vars.

**full**: расширенный — крупное число + уровень текстом + цветовой индикатор. Используется в Story 1-5 (карточка товара).

**ARIA**: `aria-label="Рейтинг прозрачности: {rating} из 100{variant === 'full' ? `, уровень: ${level}` : ''}"`

**Важно**: цвета УЖЕ определены в globals.css как CSS variables:
```css
--trust-high: #22C55E; --trust-high-bg: #F0FDF4;
--trust-medium: #EAB308; --trust-medium-bg: #FEFCE8;
--trust-low: #EF4444; --trust-low-bg: #FEF2F2;
```
Использовать Tailwind `bg-[var(--trust-high-bg)]` и `text-[var(--trust-high)]` или вынести в utility классы.

### ProductCard — спецификация

**src/components/shared/ProductCard.tsx:**

```typescript
interface ProductCardProps {
  item: Item;
  shop?: Shop;           // опционально — может быть loading
  className?: string;
}
```

**Mobile (default) — вертикальная компоновка:**
```
┌──────────────────────┐
│ [фото]               │  ← aspect-ratio: 4/3, relative
│            [TrustBadge]│  ← absolute top-2 right-2 (compact)
├──────────────────────┤
│ 25 000 ₽             │  ← text-price, font-bold
│ Золотое кольцо...    │  ← text-body, line-clamp-2
│ Сост: 9/10 · Ломбард │  ← text-caption, text-secondary
└──────────────────────┘
```

**Desktop (lg:) — горизонтальная компоновка:**
```
┌────────┬─────────────┐
│ [фото] │ 25 000 ₽    │
│ [Badge]│ Золотое...  │
│        │ Сост: 9/10  │
└────────┴─────────────┘
```

**hover**: `transition-shadow hover:shadow-md` или `hover:ring-1 hover:ring-primary/20`

**Кликабельность**: вся карточка обёрнута в `<Link href={`/item/${item.id}`}>`. Не `<a>` напрямую — использовать Next.js Link. Доступность: `role` не нужен, `<article>` внутри ссылки — семантично.

**Изображение**: `next/image` с `src={item.images[0] || '/images/placeholder.webp'}`, `alt={item.title}`, `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`, `fill` или `width/height` с object-cover.

**TrustBadge наложение**: внутри `relative` контейнера с фото, TrustBadge — `absolute top-2 right-2 z-10`.

**Название ломбарда**: передать через props `shop`. В каталоге делать lookup через `useShops()` hook — получить Map<shopId, Shop>, передать shop в ProductCard.

### ProductCardSkeleton — спецификация

В том же файле `ProductCard.tsx` или рядом:

```typescript
export function ProductCardSkeleton() { ... }
```

Использует shadcn `Skeleton` для:
- Фото-блока (aspect-ratio 4/3)
- Цены (широкая полоса)
- Названия (2 строки)
- Мета-информации (короткая полоса)

Структура идентична ProductCard — чтобы не прыгал layout при загрузке.

### Hook для ломбардов — спецификация

**src/hooks/use-shops.ts:**
```typescript
const shopKeys = {
  all: ['shops'] as const,
  lists: () => [...shopKeys.all, 'list'] as const,
  list: () => [...shopKeys.lists()] as const,
  details: () => [...shopKeys.all, 'detail'] as const,
  detail: (id: string) => [...shopKeys.details(), id] as const,
};

export function useShops() {
  return useQuery({
    queryKey: shopKeys.list(),
    queryFn: getShops,
    staleTime: STALE_TIMES.catalog,
  });
}

export function useShop(id: string) {
  return useQuery({
    queryKey: shopKeys.detail(id),
    queryFn: () => getShopById(id),
    staleTime: STALE_TIMES.catalog,
    enabled: !!id,
  });
}
```

**src/api/shops.ts:**
```typescript
export function getShops(): Promise<Shop[]> { ... }
export function getShopById(id: string): Promise<Shop> { ... }
```

**src/mocks/handlers/shops.ts:**
- `GET /api/shops` — вернуть все ломбарды из shops.json: `{ data: shops }`
- `GET /api/shops/:id` — вернуть по id или 404

**Обновить `src/mocks/handlers/index.ts`**: добавить `shopsHandlers` в массив.

### Обновление каталога — спецификация

**src/app/catalog/page.tsx** — полная замена текущего plain-контента:

1. Загрузка: `useItems()` + `useShops()` параллельно
2. Создать Map shopId → Shop из `useShops` данных
3. Skeleton: если `itemsLoading` — показать 6-12 `ProductCardSkeleton` в grid
4. Grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4`
5. Каждое место: `<ProductCard item={item} shop={shopsMap.get(item.shopId)} />`
6. Пустое состояние: PageContainer с текстом «Товары не найдены» + кнопка «Сбросить фильтры» (пока заглушка)
7. Мета-инфо: количество товаров (временно)

**НЕ добавлять**: поиск, фильтры, сортировку — это Story 1-4.

### Именование (строго соблюдать)

| Элемент | Паттерн | Пример |
|---------|---------|--------|
| Компоненты | PascalCase.tsx | `TrustBadge.tsx`, `ProductCard.tsx` |
| Hook файлы | use-kebab-case | `use-shops.ts` → экспорт `useShops`, `useShop` |
| API файлы | kebab-case | `shops.ts` → экспорт `getShops`, `getShopById` |
| Типы | PascalCase | `Shop` (уже существует в types/shop.ts) |
| Пропсы | ComponentNameProps | `TrustBadgeProps`, `ProductCardProps` |
| Query key factories | camelCase + Keys | `shopKeys` |

### Порядок импортов (строго)

```typescript
// 1. React/Next.js
import Link from 'next/link';
import Image from 'next/image';
// 2. Сторонние библиотеки
import { useQuery } from '@tanstack/react-query';
// 3. Внутренние модули (@/)
import { useItems } from '@/hooks/use-items';
import { useShops } from '@/hooks/use-shops';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format-price';
import { Skeleton } from '@/components/ui/skeleton';
// 4. Типы
import type { Item } from '@/types/item';
import type { Shop } from '@/types/shop';
```

### Anti-patterns (ЗАПРЕЩЕНО)

- `any` тип — использовать `unknown` + type guard
- Прямой `fetch()` из компонентов — только через hooks
- Inline стили — только Tailwind классы (исключение: CSS vars через `style` или Tailwind `[]` синтаксис)
- `index.ts` barrel exports — импортировать напрямую из файлов
- `console.log` — только `console.error` для ошибок
- `// @ts-ignore` — исправлять типы

### Accessibility замечания

- TrustBadge: `aria-label` обязателен для обоих вариантов
- ProductCard: `<article>` семантика, `<Link>` для клика
- Изображения: `alt={item.title}` для фото товара
- Touch targets: min 44x44px — вся карточка кликабельна (Link)
- Focus-visible: Next.js Link наследует focus стили от Tailwind

### Performance замечания

- `next/image` с `sizes` для правильной генерации srcset
- TrustBadge рендерится чистой функцией от rating — memo не нужен
- ProductCard: можно обернуть в `React.memo` если будут проблемы (пока не нужно)
- Skeleton использует `animate-pulse` — уважает `prefers-reduced-motion` (уже в globals.css)
- `useShops()` вызывается один раз на уровне catalog page, данные шарятся через React Query

### Insignts из предыдущих stories

**Из Story 1-2 (Review findings):**
- categoryId содержит slug вместо ID — работает корректно, но несогласовано. Для ProductCard это значит: `categoryId` в Item — это slug категории (например "jewelry"), не UUID.
- MSW init работает корректно, MSW стартует только при `NEXT_PUBLIC_MSW_ENABLED=true`
- apiFetch/apiFetchPaginated дублирование — работает, не трогать

**Из Story 1-1:**
- shadcn/ui стиль: base-nova. Badge использует `@base-ui/react` (`useRender`, `mergeProps`) — не стандартный React-компонент. Для TrustBadge НЕ использовать shadcn Badge — делать свой компонент с Tailwind.
- ThemeProvider поддерживает dark mode — trust colors имеют dark mode варианты в globals.css

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Frontend Architecture, Component Boundaries, Project Structure, Naming Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md — Story 1.3 AC]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — UX-DR5 (TrustBadge), UX-DR7 (ProductCard), UX-DR19 (responsive), UX-DR23 (skeleton)]
- [Source: _bmad-output/planning-artifacts/prd.md — FR7-FR9 (карточка, рейтинг, состояние)]
- [Source: _bmad-output/implementation-artifacts/1-2-mokovye-dannye-i-api-sloj-dlya-tovarov.md — Previous story file list, review findings]
- [Source: src/app/globals.css — trust CSS variables, font-size utilities]
- [Source: src/components/ui/badge.tsx — shadcn Badge (base-nova, @base-ui/react)]
- [Source: src/components/ui/card.tsx — shadcn Card]
- [Source: src/components/ui/skeleton.tsx — shadcn Skeleton]

## Dev Agent Record

### Agent Model Used

GLM-5

### Debug Log References

### Completion Notes List

- TrustBadge: compact и full варианты с CSS vars (--trust-high/medium/low), ARIA labels, 3 уровня доверия
- ProductCard: mobile вертикальная + desktop горизонтальная (lg:) компоновка, hover shadow, TrustBadge overlay, Link + article семантика
- ProductCardSkeleton: 4 skeleton-блока (фото, цена, название, мета) идентичные ProductCard layout
- API shops: getShops/getShopById через apiFetch (общий клиент)
- useShops/useShop hooks: React Query с shopKeys factory, staleTime из STALE_TIMES.catalog
- MSW shops handlers: GET /api/shops (все), GET /api/shops/:id (по ID, 404 если не найден)
- Catalog page: параллельная загрузка useItems + useShops, shopsMap для lookup, responsive grid 2/3/4 col, 8 skeleton при загрузке, пустое состояние
- Placeholder SVG создан для изображений, fallback при ошибке загрузки
- Все типы чистые, сборка успешна

### File List

- src/components/shared/TrustBadge.tsx (NEW)
- src/components/shared/ProductCard.tsx (NEW)
- src/api/shops.ts (NEW)
- src/hooks/use-shops.ts (NEW)
- src/mocks/handlers/shops.ts (NEW)
- src/mocks/handlers/index.ts (MODIFIED)
- src/app/catalog/page.tsx (MODIFIED)
- public/images/placeholder.svg (NEW)

## Change Log

- 2026-05-10: Реализована Story 1.3 — TrustBadge, ProductCard, hooks для ломбардов, интеграция каталога
