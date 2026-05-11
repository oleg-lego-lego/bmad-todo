# Story 1.5: Карточка товара — «Биография вещи»

Status: done

## Story

As a покупатель,
I want видеть полную информацию о товаре с «биографией вещи» — рейтингом прозрачности, таймлайном жизни, фото-галереей,
so that могу принять обоснованное решение о покупке.

## Acceptance Criteria

1. **AC1 — Первый экран без скролла:** При открытии `/item/[id]` покупатель видит без скролла: ProductGallery (swiper), TrustBadge (full variant), цена крупным шрифтом, название, состояние, кнопку «В корзину» (UI-заглушка, без функционала до Epic 3).
2. **AC2 — Скролл-контент:** При скролле вниз: ItemTimeline (таймлайн жизни), описание товара, информация о ломбарде (название, адрес самовывоза), все фото.
3. **AC3 — ProductGallery:** Swiper-галерея: основной слайдер + миниатюры (desktop), свайп (mobile). `role="region"` `aria-label="Галерея фото"`. Используется `next/image` с `sizes` и lazy loading.
4. **AC4 — ItemTimeline:** Горизонтальная лента событий товара. Состояния: completed (зелёный), current (синий), future (серый). `role="list"` / `role="listitem"`.
5. **AC5 — SSR и SEO:** Страница рендерится серверно. `generateMetadata` возвращает title, description, og:image. JSON-LD (schema.org/Product) встроен в страницу.
6. **AC6 — Loading/error состояния:** `loading.tsx` — skeleton при навигации. 404 страница при несуществующем товаре (not-found или redirect).
6. **AC7 — Хлебные крошки:** Breadcrumbs на странице товара: Главная > Каталог > Название товара.
7. **AC8 — Кнопка «В корзину»:** Фиксирована внизу экрана (sticky bottom bar). UI-заглушка — обработчик `onClick` без реализации (alert или toast «Функция будет доступна в следующем обновлении»).

## Tasks / Subtasks

- [x] Task 1: Установить Swiper (AC: #3)
  - [x] `pnpm add swiper`
  - [x] Проверить совместимость с Next.js 16 / React 19
- [x] Task 2: Создать `ProductGallery` компонент (AC: #3)
  - [x] Создать `src/components/shared/ProductGallery.tsx`
  - [x] Swiper с модулями: Navigation, Pagination, Thumbs (desktop)
  - [x] Основной слайдер + миниатюры на desktop (lg:), только основной на mobile
  - [x] Свайп-жесты на mobile (builtin Swiper touch)
  - [x] `next/image` для каждого слайда с `sizes` и fallback на placeholder
  - [x] `role="region"`, `aria-label="Галерея фото"`, alt-тексты
  - [x] Empty state если `images.length === 0` — placeholder
- [x] Task 3: Создать `ItemTimeline` компонент (AC: #4)
  - [x] Создать `src/components/shared/ItemTimeline.tsx`
  - [x] Принимает `events: ItemTimelineEvent[]`
  - [x] Горизонтальная лента: линия-коннектор + точки-события
  - [x] Цвета: completed — `--trust-high` (зелёный), current — `--primary` (синий), future — `--muted-foreground` (серый)
  - [x] `role="list"`, каждый event — `role="listitem"`
  - [x] Форматирование дат через `formatDate` из `src/lib/format-date.ts`
  - [x] Responsive: горизонтально на desktop, вертикально на mobile (опционально)
- [x] Task 4: Создать `ItemPageContent` компонент (AC: #1, #2, #8)
  - [x] Создать `src/app/item/[id]/components/ItemPageContent.tsx`
  - [x] Клиентский компонент (`'use client'`), вызывает `useItem(id)` и `useShop(item.shopId)`
  - [x] Первый экран: ProductGallery + TrustBadge (full) + цена + название + состояние + AddToCartButton
  - [x] Скролл-контент: ItemTimeline + описание + информация о ломбарде
  - [x] Использовать `formatPrice` для цены, `formatDate` для дат
  - [x] Responsive: mobile — всё вертикально, desktop — gallery 60% / info 40%
- [x] Task 5: Создать `AddToCartButton` компонент (AC: #8)
  - [x] Создать `src/app/item/[id]/components/AddToCartButton.tsx`
  - [x] Sticky bottom bar на mobile, обычная кнопка на desktop
  - [x] UI-заглушка: `onClick` показывает toast «Функция будет доступна позже»
  - [x] Touch target min 44x44px, `aria-label="Добавить в корзину"`
- [x] Task 6: Создать страницу товара (AC: #5, #6, #7)
  - [x] Создать `src/app/item/[id]/page.tsx` — серверный компонент
  - [x] `generateMetadata` — title: `item.title — PawnMarket`, description из item.description, og:image из item.images[0]
  - [x] JSON-LD: schema.org/Product с name, description, image, offers (price, priceCurrency RUB, availability InStock), seller (ломбард)
  - [x] Breadcrumbs: Главная > Каталог > {item.title}
  - [x] Рендерит `ItemPageContent` с передачей `id` из `params`
  - [x] Обработка not-found: если товар не найден — `notFound()`
- [x] Task 7: Создать `loading.tsx` (AC: #6)
  - [x] Создать `src/app/item/[id]/loading.tsx` — skeleton карточки товара
  - [x] Skeleton gallery (прямоугольник 16:9) + skeleton текстовых блоков
- [x] Task 8: Тестирование (AC: #1-8)
  - [x] Unit-тесты для ItemTimeline (события, состояния, форматирование)
  - [x] Component-тесты для ProductGallery (рендер изображений, навигация)
  - [x] Build и lint проходят без ошибок

## Dev Notes

### Существующий код — НЕ ПЕРЕПИСЫВАТЬ

**Уже готовы и работают (ИСПОЛЬЗОВАТЬ КАК ЕСТЬ):**

| Что | Где | Что делает |
|-----|-----|------------|
| `useItem(id)` | `src/hooks/use-items.ts:51` | React Query hook, staleTime 10min, enabled только если !!id |
| `getItemById(id)` | `src/api/items.ts:22` | `apiFetch<Item>('/items/${id}')` — возвращает `Item` (data уже развёрнут) |
| `useShop(id)` | `src/hooks/use-shops.ts:21` | React Query hook для данных ломбарда |
| `TrustBadge` | `src/components/shared/TrustBadge.tsx` | `variant='full'` — крупный бейдж с числом + уровень + подпись |
| `formatPrice` | `src/lib/format-price.ts` | `Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })` |
| `formatDate` | `src/lib/format-date.ts` | `Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })` |
| `PageContainer` | `src/components/layout/PageContainer.tsx` | Wrapper с max-width 1280px и padding |
| MSW handler | `src/mocks/handlers/items.ts:77` | `GET /api/items/:id` — возвращает `{ data: item }` или 404 |
| `itemKeys.detail(id)` | `src/hooks/use-items.ts:13` | Query key `['items', 'detail', id]` |

### Типы данных (УЖЕ ОПРЕДЕЛЕНЫ в `src/types/item.ts`)

```typescript
interface Item {
  id: string; title: string; description: string; price: number;
  categoryId: string; condition: number; trustRating: number;
  shopId: string; images: string[]; status: ItemStatus;
  createdAt: string; timeline: ItemTimelineEvent[];
}

interface ItemTimelineEvent {
  date: string; title: string; description: string;
  status: 'completed' | 'current' | 'future';
}
```

### Структура моковых данных (items.json)

Каждый item имеет `timeline` с 2-3 событиями, `images` — массив путей (пока все `/images/placeholder.webp`), `shopId` для связи с ломбардом.

### Архитектурные правила (ОБЯЗАТЕЛЬНО)

1. **Data flow:** `Components → hooks/ → api/ → MSW handlers → JSON data`. ЗАПРЕЩЁН прямой вызов api/ из компонентов.
2. **Naming:** PascalCase для компонентов, camelCase для файлов хуков, `ComponentNameProps` интерфейс для пропсов.
3. **Import order:** React/Next → сторонние → `@/` внутренние → типы.
4. **Anti-patterns:** ЗАПРЕЩЕНО `any`, inline styles, barrel exports, `console.log`, `@ts-ignore`.
5. **Mobile-first:** стили по умолчанию mobile, `md:` / `lg:` для расширения.
6. **CSS:** только Tailwind классы, CSS vars уже в globals.css (`--trust-high`, `--primary`, etc.).

### Ключевые решения

1. **Страница = серверный компонент** с `generateMetadata` для SEO. Контент — клиентский `ItemPageContent` (`'use client'`), т.к. использует hooks.
2. **Swiper.js** для ProductGallery — стандартная библиотека для слайдеров. Установить как зависимость.
3. **JSON-LD** через `<script type="application/ld+json">` в JSX страницы — стандартный подход для Next.js.
4. **Кнопка «В корзину»** — UI-заглушка. Реализация корзины в Epic 3 (Story 3.1).

### File Structure

```
src/
  app/
    item/
      [id]/
        page.tsx                    # NEW — серверный, generateMetadata + JSON-LD
        loading.tsx                 # NEW — skeleton
        components/
          ItemPageContent.tsx       # NEW — 'use client', основная разметка
          AddToCartButton.tsx       # NEW — sticky кнопка-заглушка
          ItemBreadcrumbs.tsx       # NEW — хлебные крошки товара
  components/
    shared/
      ProductGallery.tsx           # NEW — swiper-галерея
      ItemTimeline.tsx             # NEW — горизонтальная лента событий
```

### Responsive Layout

```
Desktop (lg: 1024+):
┌──────────────────────────────────────────────────────┐
│ Breadcrumbs: Главная > Каталог > Кольцо с рубином    │
├────────────────────────┬─────────────────────────────┤
│ ProductGallery (60%)   │ TrustBadge (full)            │
│ [Main slider]          │ 120 000 ₽                    │
│ [thumb1] [thumb2]      │ Кольцо с рубином «Огонь»    │
│                        │ Состояние: 10/10             │
│                        │ Ломбард: Золотой Век         │
│                        │ [В корзину]                  │
├────────────────────────┴─────────────────────────────┤
│ ItemTimeline (горизонтальная лента)                   │
│ ● Принято → ● Оценено → ● На продаже                │
├──────────────────────────────────────────────────────┤
│ Описание товара                                       │
├──────────────────────────────────────────────────────┤
│ Информация о ломбарде                                 │
│ Название, адрес, телефон                              │
└──────────────────────────────────────────────────────┘

Mobile (< lg):
┌──────────────────────┐
│ Breadcrumbs          │
├──────────────────────┤
│ ProductGallery       │
│ [Main slider swipe]  │
│                      │
│ TrustBadge (full)    │
│ 120 000 ₽            │
│ Кольцо с рубином     │
│ Состояние: 10/10     │
├──────────────────────┤
│ ItemTimeline         │
├──────────────────────┤
│ Описание             │
├──────────────────────┤
│ Ломбард              │
├──────────────────────┤
│ [sticky: В корзину]  │
└──────────────────────┘
```

### Доступность (WCAG 2.1 AA)

- ProductGallery: `role="region"`, `aria-label="Галерея фото"`, alt-тексты для всех изображений
- ItemTimeline: `role="list"` / `role="listitem"`, форматирование дат
- TrustBadge: уже есть `aria-label` (full variant)
- Кнопка «В корзину»: `aria-label="Добавить в корзину"`, min 44x44px
- Breadcrumbs: `nav` с `aria-label="Хлебные крошки"`
- Focus-visible: 2px outline primary (из globals.css)
- `prefers-reduced-motion`: отключить анимации Swiper (уже в globals.css)

### JSON-LD формат (schema.org/Product)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "item.title",
  "description": "item.description",
  "image": ["item.images"],
  "offers": {
    "@type": "Offer",
    "price": "item.price",
    "priceCurrency": "RUB",
    "availability": "https://schema.org/InStock"
  }
}
```

### Уроки из предыдущих stories

1. **Accessibility issues в review (story 1-3)** — несколько a11y фиксов. Обязательно сразу добавлять aria-label, semantic HTML, focus management.
2. **Type safety** — никаких `any`, explicit type imports, null safety.
3. **Image safety** — `item.images?.[0]` с fallback на placeholder. Изображения могут быть пустым массивом.
4. **Data safety** — fallback для condition: `item.condition ?? '-'`, для timeline: `item.timeline ?? []`.
5. **URL encoding** — `encodeURIComponent` для path params.
6. **CSS vars** — trust colors уже в globals.css через `--trust-high`, `--trust-primary`, etc.
7. **React 19 strict** — `useRef` without initial value требует аргумент (TS2554), lint rules строже.
8. **Debounce cleanup** — timer cleanup в useEffect return (story 1-4).
9. **Sort validation** — валидация значений из URL перед использованием (story 1-4).

### Performance

- SSR для начального рендера (SEO)
- React Query staleTime: 10min для карточки товара
- `next/image` с `sizes` и lazy loading
- Swiper: import конкретных модулей, не весь пакет (`import { Navigation } from 'swiper/modules'`)
- Skeleton при навигации через loading.tsx

### Swiper.js подключение

```
pnpm add swiper
```

Импортировать только нужные модули:
```typescript
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
```

Для desktop: основной Swiper + Thumbs (миниатюры). Для mobile: только основной Swiper со свайпом.

### Проект НЕ использует route groups

Каталог находится по адресу `src/app/catalog/`, а НЕ `src/app/(public)/catalog/`. Страница товара должна быть по адресу `src/app/item/[id]/page.tsx`.

### Паттерн страницы каталога (для референса)

Catalog page (`src/app/catalog/page.tsx`) — клиентский (`'use client'`), обёрнут в `Suspense` с skeleton fallback, использует `PageContainer`. Этот паттерн отличается тем, что item page будет серверным компонентом с `generateMetadata`, а клиентская логика вынесена в `ItemPageContent`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5]
- [Source: _bmad-output/planning-artifacts/architecture.md#FR7-FR12, Item page structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Карточка товара, ProductGallery, ItemTimeline]
- [Source: _bmad-output/planning-artifacts/prd.md#FR7-FR12]

## Dev Agent Record

### Agent Model Used

GLM-5[1m]

### Debug Log References

### Completion Notes List

- ✅ Установлен Swiper 12.1.4 — совместим с Next.js 16 / React 19
- ✅ ProductGallery: Swiper с Navigation + Thumbs модулями, миниатюры на desktop, свайп на mobile, empty state с placeholder
- ✅ ItemTimeline: горизонтальная лента с ролью list/listitem, три цветовых состояния (completed/current/future), форматирование дат
- ✅ AddToCartButton: sticky на mobile, обычная кнопка на desktop, toast-заглушка, min 44x44px touch target
- ✅ ItemPageContent: клиентский компонент с useItem/useShop, responsive layout 60/40, skeleton loading
- ✅ Item page: серверный компонент с generateMetadata, JSON-LD (schema.org/Product), breadcrumbs, notFound()
- ✅ loading.tsx: skeleton с breadcrumbs, gallery, info блоками
- ✅ Тесты: 15 новых тестов (ItemTimeline — 8, ProductGallery — 7), все 50 тестов проходят
- ✅ Build и lint прошли без ошибок

### File List

- src/components/shared/ProductGallery.tsx (NEW)
- src/components/shared/ProductGallery.test.tsx (NEW)
- src/components/shared/ItemTimeline.tsx (NEW)
- src/components/shared/ItemTimeline.test.tsx (NEW)
- src/app/item/[id]/page.tsx (NEW)
- src/app/item/[id]/loading.tsx (NEW)
- src/app/item/[id]/components/ItemPageContent.tsx (NEW)
- src/app/item/[id]/components/AddToCartButton.tsx (NEW)
- package.json (MODIFIED — добавлен swiper 12.1.4)
- pnpm-lock.yaml (MODIFIED)

### Review Findings

- [x] [Review][Decision] Sticky-поведение кнопки «В корзину» на desktop — подтверждено: inline на desktop, sticky на mobile. Текущее поведение правильное.
- [x] [Review][Decision] `notFound()` при любой ошибке API — подтверждено: оставить как есть. Покрывает большинство кейсов.
- [x] [Review][Patch] XSS через JSON-LD injection [page.tsx:63] — добавлен `.replace(/<\/(script)/gi, '<\\/$1')` после JSON.stringify.
- [x] [Review][Patch] Клиентская ошибка рендерит error UI с кнопкой retry [ItemPageContent.tsx:23].
- [x] [Review][Patch] Breadcrumb: убраны сепараторы из `<li>`, добавлен overflow-hidden на `<ol>` и min-w-0 [page.tsx].
- [x] [Review][Patch] Placeholder: исправлен на `/images/placeholder.svg` [ProductGallery.tsx:19].
- [x] [Review][Patch] Inline style заменён на Tailwind `min-w-[140px] flex-[1_1_0%]` [ItemTimeline.tsx:39].
- [x] [Review][Patch] JSON-LD price: `String(item.price)` [page.tsx:55].
- [x] [Review][Patch] Import type Metadata перемещён в конец [page.tsx:8].
- [x] [Review][Patch] formatDate fallback: `|| 'Дата не указана'` [ItemTimeline.tsx:65].
- [x] [Review][Defer] Двойной fetch в SSR (generateMetadata + page) [page.tsx:17,38] — стандартный паттерн Next.js, дедупликация fetch встроена. Deferred: оптимизация при необходимости.
- [x] [Review][Defer] Захардкожен `InStock` в JSON-LD [page.tsx:59] — спека явно требует InStock. Deferred: маппинг status → availability в будущих эпиках.
- [x] [Review][Defer] Отсутствует `ItemBreadcrumbs.tsx` (спека требует отдельный компонент) — хлебные крошки работают корректно inline в `page.tsx`. Deferred: рефакторинг при необходимости.
- [x] [Review][Defer] `page.tsx` обходит hooks-слой, вызывает `@/api/items` напрямую [page.tsx:5] — серверный компонент не может использовать hooks. Это необходимый паттерн для SSR. Deferred: архитектурное решение.
- [x] [Review][Defer] `condition` отображается как `-/10` при nullish [ItemPageContent.tsx:54] — fallback `?? '-'` разумный для граничного случая. Deferred: уточнить дизайн при необходимости.

## Change Log

- 2026-05-11: Story created from epics, architecture, PRD, UX, and previous stories analysis
- 2026-05-11: Story implemented — карточка товара с галереей, таймлайном, SSR, SEO, breadcrumbs, sticky button
