# Story 1.2: Моковые данные и API-слой для товаров

Status: review

## Story

As a разработчик,
I want иметь API-слой с моковыми данными,
So that компоненты получают данные через React Query hooks прозрачно.

## Acceptance Criteria

1. **AC1: MSW v2 инициализирован**
   - Given MSW v2 service worker инициализирован в браузере
   - When приложение загружается
   - Then все fetch-запросы к `/api/*` перехватываются MSW handlers
   - And MSW стартует только когда `NEXT_PUBLIC_MSW_ENABLED=true` в `.env.local`

2. **AC2: Моковые данные (items.json)**
   - Given файл `src/mocks/data/items.json` содержит 50+ товаров
   - When MSW handler обрабатывает `GET /api/items`
   - Then возвращаются товары из JSON с пагинацией и фильтрацией
   - And товары распределены по 3 категориям (ювелирные изделия, техника, часы)
   - And товары привязаны к 5+ ломбардам из `shops.json`
   - And каждый товар содержит: id, title, description, price, category, condition, trustRating, shopId, images, status, createdAt, timeline

3. **AC3: Моковые данные (shops.json, categories.json)**
   - Given `shops.json` содержит 5+ ломбардов с полями: id, name, address, phone, inn, rating, verified
   - And `categories.json` содержит 3 категории с полями: id, name, slug, filterOptions
   - When MSW handler обрабатывает соответствующие запросы
   - Then данные возвращаются корректно

4. **AC4: API клиент (api/client.ts)**
   - Given fetch-обёртка `api/client.ts` реализована
   - When вызывается API-функция
   - Then запрос идёт через统一的 client с обработкой ошибок
   - And `AppError` класс имеет типы: `network`, `notFound`, `validation`, `unauthorized`
   - And response format: успех `{ data: T, meta?: { page, totalPages, total } }`, ошибка `{ error: { code, message, details? } }`

5. **AC5: API функции для товаров (api/items.ts)**
   - Given `api/items.ts` реализован
   - When вызывается `getItems({ page, limit, category, priceMin, priceMax, condition, sort, search })`
   - Then возвращается пагинированный список товаров
   - When вызывается `getItemById(id)`
   - Then возвращается один товар с полной информацией

6. **AC6: API функции для категорий (api/categories.ts)**
   - Given `api/categories.ts` реализован
   - When вызывается `getCategories()`
   - Then возвращается список категорий с параметрами фильтров

7. **AC7: React Query hooks (hooks/use-items.ts)**
   - Given `hooks/use-items.ts` реализован
   - When компонент вызывает `useItems(filters)`
   - Then данные загружаются через React Query с кэшированием staleTime 5min
   - When компонент вызывает `useItem(id)`
   - Then данные загружаются с staleTime 10min
   - And React Query key factory паттерн используется для items

8. **AC8: React Query hooks (hooks/use-categories.ts)**
   - Given `hooks/use-categories.ts` реализован
   - When компонент вызывает `useCategories()`
   - Then возвращается список категорий с staleTime 5min

9. **AC9: TypeScript типы**
   - Given все типы определены в `src/types/`
   - When используются в API, hooks, components
   - Then типы: Item, ItemFilters, ItemStatus, Category, FilterOption, Shop, ApiResponse, PaginatedResponse, ApiError

10. **AC10: Утилиты**
    - Given `lib/format-price.ts` — форматирование цен через `Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })`
    - And `lib/format-date.ts` — форматирование дат через `Intl.DateTimeFormat('ru-RU')`
    - And `lib/constants.ts` — DEFAULT_PAGE_SIZE, STALE_TIMES, MAX_CART_ITEMS
    - And `lib/query-client.ts` — QueryClient конфигурация (если нужно вынести из providers.tsx)

11. **AC11: MSW handlers**
    - Given `src/mocks/handlers/items.ts` реализует `GET /api/items` с поддержкой фильтров, пагинации, сортировки, поиска
    - And `GET /api/items/:id` — возвращает товар по id или 404
    - And `src/mocks/handlers/categories.ts` — `GET /api/categories`
    - When handlers скомпонованы в `src/mocks/handlers/index.ts`
    - Then MSW worker использует все handlers

## Tasks / Subtasks

- [x] Task 1: TypeScript типы (AC: #9)
  - [x] 1.1 Создать `src/types/api.ts` — ApiResponse<T>, PaginatedResponse<T>, ApiError, AppError типы
  - [x] 1.2 Создать `src/types/item.ts` — Item, ItemFilters, ItemStatus, ItemTimelineEvent
  - [x] 1.3 Создать `src/types/category.ts` — Category, FilterOption
  - [x] 1.4 Создать `src/types/shop.ts` — Shop, ShopStatus

- [x] Task 2: Утилиты (AC: #10)
  - [x] 2.1 Создать `src/lib/format-price.ts` — formatPrice()
  - [x] 2.2 Создать `src/lib/format-date.ts` — formatDate()
  - [x] 2.3 Создать `src/lib/constants.ts` — DEFAULT_PAGE_SIZE, STALE_TIMES

- [x] Task 3: API клиент (AC: #4)
  - [x] 3.1 Создать `src/api/client.ts` — fetch обёртка + AppError класс

- [x] Task 4: Моковые данные (AC: #2, #3)
  - [x] 4.1 Создать `src/mocks/data/categories.json` — 3 категории с filterOptions
  - [x] 4.2 Создать `src/mocks/data/shops.json` — 5+ ломбардов
  - [x] 4.3 Создать `src/mocks/data/items.json` — 50+ товаров

- [x] Task 5: MSW handlers (AC: #11)
  - [x] 5.1 Создать `src/mocks/handlers/items.ts` — GET /api/items, GET /api/items/:id
  - [x] 5.2 Создать `src/mocks/handlers/categories.ts` — GET /api/categories
  - [x] 5.3 Создать `src/mocks/handlers/index.ts` — композиция всех handlers

- [x] Task 6: MSW browser setup (AC: #1)
  - [x] 6.1 Создать `src/mocks/browser.ts` — setupWorker
  - [x] 6.2 Обновить `src/app/providers.tsx` — условный старт MSW

- [x] Task 7: API функции (AC: #5, #6)
  - [x] 7.1 Создать `src/api/items.ts` — getItems, getItemById
  - [x] 7.2 Создать `src/api/categories.ts` — getCategories

- [x] Task 8: React Query hooks (AC: #7, #8)
  - [x] 8.1 Создать `src/hooks/use-items.ts` — itemKeys factory, useItems, useItem
  - [x] 8.2 Создать `src/hooks/use-categories.ts` — categoryKeys factory, useCategories

- [x] Task 9: Верификация (AC: все)
  - [x] 9.1 `pnpm build` — без ошибок
  - [x] 9.2 `pnpm dev` — MSW перехватывает запросы (проверить в Network tab)
  - [x] 9.3 `tsc --noEmit` — без ошибок типов
  - [x] 9.4 Временная страница для проверки: каталог загружает данные через useItems

## Dev Notes

### Критические архитектурные решения

**Строгое разделение слоёв** (ЗАПРЕЩЕНО нарушать):
```
Components → hooks/ → api/ → MSW handlers → JSON data
```
- Компоненты НЕ знают об источнике данных — только hooks
- Hooks НЕ знают о fetch-реализации — только api-функции
- API-функции НЕ знают о моках — MSW перехватывает прозрачно

**Запрещено**: вызывать `api/` напрямую из компонентов. Только через hooks. [Source: architecture.md]

### Существующая кодовая база (Story 1-1)

**Уже существует:**
- `src/app/providers.tsx` — QueryClientProvider с QueryClient (staleTime: 5min, retry: 1). **Обновить**: добавить условный старт MSW.
- `src/lib/utils.ts` — cn() утилита от shadcn/ui
- `public/mockServiceWorker.js` — MSW service worker уже создан
- `.env.local` — уже есть `NEXT_PUBLIC_MSW_ENABLED=true`
- `package.json` — MSW v2.14.5 установлен как devDependency

**shadcn/ui стиль**: base-nova (не New York). shadcn использует @base-ui/react. [Source: Story 1-1 completion notes]

**Версии**: Next.js 16.2.6, React 19.2.4, React Query v5.100.9, MSW v2.14.5, Zod v4.4.3, React Hook Form v7.75.0

### Структура файлов (строго соблюдать)

```
src/
  types/               # NEW — все TypeScript типы
    api.ts             # ApiResponse<T>, PaginatedResponse<T>, ApiError
    item.ts            # Item, ItemFilters, ItemStatus, ItemTimelineEvent
    category.ts        # Category, FilterOption
    shop.ts            # Shop
  lib/                 # EXTEND — утилиты
    utils.ts           # EXISTS — cn()
    format-price.ts    # NEW
    format-date.ts     # NEW
    constants.ts       # NEW
  api/                 # NEW — fetch обёртки
    client.ts          # fetch-обёртка + AppError
    items.ts           # getItems, getItemById
    categories.ts      # getCategories
  hooks/               # NEW — React Query hooks
    use-items.ts       # itemKeys factory, useItems, useItem
    use-categories.ts  # categoryKeys factory, useCategories
  mocks/               # NEW — MSW handlers + JSON данные
    browser.ts         # MSW browser setup
    handlers/
      index.ts         # Композиция всех handlers
      items.ts         # GET /api/items, GET /api/items/:id
      categories.ts    # GET /api/categories
    data/
      items.json       # 50+ товаров
      shops.json       # 5+ ломбардов
      categories.json  # 3 категории + параметры фильтров
  app/
    providers.tsx      # UPDATE — добавить MSW init
```

### TypeScript типы — спецификация

**src/types/api.ts:**
```typescript
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type AppErrorType = 'network' | 'notFound' | 'validation' | 'unauthorized';
```

**src/types/item.ts:**
```typescript
export type ItemStatus = 'active' | 'hidden' | 'moderation';

export interface ItemTimelineEvent {
  date: string;          // ISO 8601
  title: string;
  description: string;
  status: 'completed' | 'current' | 'future';
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  condition: number;      // 1-10
  trustRating: number;    // 0-100
  shopId: string;
  images: string[];       // URL массив
  status: ItemStatus;
  createdAt: string;      // ISO 8601
  timeline: ItemTimelineEvent[];
}

export interface ItemFilters {
  page?: number;
  limit?: number;
  category?: string;      // category slug
  priceMin?: number;
  priceMax?: number;
  condition?: number;     // минимальная оценка
  sort?: 'price_asc' | 'price_desc' | 'date' | 'trust_rating';
  search?: string;
}
```

**src/types/category.ts:**
```typescript
export interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  filterOptions: FilterOption[];
}
```

**src/types/shop.ts:**
```typescript
export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  inn: string;
  rating: number;      // 0-5
  verified: boolean;
}
```

### API Client — спецификация

**src/api/client.ts:**

AppError класс:
```typescript
export class AppError extends Error {
  constructor(
    public type: AppErrorType,
    message: string,
    public code?: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

fetch-обёртка `apiFetch<T>()`:
- Базовый URL: `/api` (MSW перехватывает)
- Headers: `Content-Type: application/json`
- Обработка: network error → `AppError('network')`, 404 → `AppError('notFound')`, 401 → `AppError('unauthorized')`, 422 → `AppError('validation')`, другие → `AppError('network')`
- Успешный ответ: распарсить как `ApiResponse<T>` и вернуть `data`
- Пагинированный: отдельный метод `apiFetchPaginated<T>()` который возвращает `{ data, meta }`

### React Query Key Factory — спецификация

**В hooks/use-items.ts:**
```typescript
const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (filters: ItemFilters) => [...itemKeys.lists(), filters] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
};
```

**В hooks/use-categories.ts:**
```typescript
const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
};
```

### React Query Hooks — спецификация

**useItems(filters?: ItemFilters):**
- `useQuery` с key `itemKeys.list(filters)`
- `staleTime: STALE_TIMES.catalog` (5min)
- Вызывает `getItems(filters)` из `api/items.ts`
- Дефолтные фильтры: `{ page: 1, limit: DEFAULT_PAGE_SIZE }`

**useItem(id: string):**
- `useQuery` с key `itemKeys.detail(id)`
- `staleTime: STALE_TIMES.item` (10min)
- `enabled: !!id`
- Вызывает `getItemById(id)` из `api/items.ts`

**useCategories():**
- `useQuery` с key `categoryKeys.list()`
- `staleTime: STALE_TIMES.catalog` (5min)
- Вызывает `getCategories()` из `api/categories.ts`

### MSW v2 — спецификация handlers

**src/mocks/handlers/items.ts:**

`GET /api/items` — логика фильтрации в handler:
1. Прочитать JSON из `../data/items.json`
2. Parse URL searchParams: page, limit, category, priceMin, priceMax, condition, sort, search
3. Фильтрация:
   - `category` — match по slug категории (item.categoryId → lookup в categories.json)
   - `priceMin/priceMax` — диапазон price
   - `condition` — item.condition >= condition
   - `search` — поиск по title и description (case-insensitive)
4. Сортировка: `price_asc`, `price_desc`, `date` (createdAt desc), `trust_rating` (desc)
5. Пагинация: slice по page/limit
6. Вернуть `{ data: items[], meta: { page, totalPages, total, limit } }`

`GET /api/items/:id`:
1. Найти товар по id в items.json
2. Если не найден — вернуть 404 `{ error: { code: 'NOT_FOUND', message: 'Товар не найден' } }`
3. Вернуть `{ data: item }`

**src/mocks/handlers/categories.ts:**

`GET /api/categories`:
1. Прочитать categories.json
2. Вернуть `{ data: categories[] }`

### MSW Browser Setup — спецификация

**src/mocks/browser.ts:**
```typescript
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

**Обновить src/app/providers.tsx:**
- Добавить условный MSW старт: если `process.env.NEXT_PUBLIC_MSW_ENABLED === 'true'`, импортировать и стартовать worker
- Использовать async init: `await worker.start({ onUnhandledRequest: 'bypass' })`
- MSW init должен быть ПЕРЕД рендером children (чтобы перехватывал все запросы)
- Важно: MSW старт асинхронный — использовать `useState` для tracking готовности

### Моковые данные — спецификация

**categories.json (3 категории):**

1. Ювелирные изделия (`jewelry`):
   - filterOptions: Тип (Кольца, Серьги, Подвески, Браслеты, Цепи), Металл (Золото 585, Золото 750, Серебро 925, Платина), Проба
2. Техника (`electronics`):
   - filterOptions: Тип (Смартфоны, Ноутбуки, Планшеты, Фотоаппараты, Наушники), Бренд (Apple, Samsung, Sony, Canon)
3. Часы (`watches`):
   - filterOptions: Тип (Мужские, Женские, Унисекс), Бренд (Rolex, Omega, Tissot, Casio), Механизм (Механика, Кварц)

**shops.json (5+ ломбардов):**

1. Золотой Ключ — verified: true, rating: 4.8
2. ТехноЛомбард — verified: true, rating: 4.5
3. Часовой Мастер — verified: true, rating: 4.7
4. Ломбард Премиум — verified: true, rating: 4.2
5. Алмаз-Ломбард — verified: false, rating: 3.8

Каждый с: id (uuid или 'shop-1'..'shop-5'), name, address (Москва), phone, inn (10 цифр)

**items.json (50+ товаров):**

Распределение:
- ~20 ювелирных изделий (от 3 000 до 150 000 ₽)
- ~15 техника (от 5 000 до 120 000 ₽)
- ~15 часы (от 2 000 до 500 000 ₽)

Каждый товар:
- id: `item-1` .. `item-50+`
- title: реалистичное название (напр. «Золотое кольцо с бриллиантом 0.5 карат», «MacBook Pro 14" M3 Pro», «Rolex Datejust 36»)
- description: 2-3 предложения
- price: число в рублях
- categoryId: slug категории
- condition: 4-10 (отличное-хорошее)
- trustRating: 45-98 (большинство 65-95)
- shopId: id ломбарда
- images: массив из 2-4 URL (placeholder — `/images/placeholder.webp` или внешние)
- status: 'active'
- createdAt: ISO 8601 дата за последний месяц
- timeline: 2-3 события (Оценено ломбардом, Выставлено на продажу)

**ВАЖНО по изображениям**: пока нет реальных фото, используй `/images/placeholder.webp` для всех товаров. Плейсхолдер-изображение будет создано позже. MSW handler для изображений не нужен — Next.js Image сам обработает.

### Именование (строго соблюдать)

| Элемент | Паттерн | Пример |
|---------|---------|--------|
| API файлы | kebab-case | `items.ts`, `categories.ts` |
| Hook файлы | use-kebab-case | `use-items.ts` → экспорт `useItems` |
| Тип файлы | kebab-case | `item.ts`, `api.ts` |
| Типы | PascalCase | `Item`, `ItemFilters`, `ApiResponse` |
| Константы | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE`, `STALE_TIMES` |
| API функции | глагол + сущность | `getItems`, `getItemById`, `getCategories` |
| Hook экспорты | use + PascalCase | `useItems`, `useItem`, `useCategories` |
| Query key factories | camelCase + Keys | `itemKeys`, `categoryKeys` |

### Порядок импортов (строго)

```typescript
// 1. React/Next.js
import { useState } from 'react';
// 2. Сторонние библиотеки
import { useQuery } from '@tanstack/react-query';
// 3. Внутренние модули (@/)
import { getItems } from '@/api/items';
import { itemKeys } from '@/hooks/use-items';
import { STALE_TIMES } from '@/lib/constants';
// 4. Типы
import type { Item, ItemFilters } from '@/types/item';
```

### Anti-patterns (ЗАПРЕЩЕНО)

- `any` тип — использовать `unknown` + type guard
- Прямой `fetch()` из компонентов — только через hooks
- Inline стили — только Tailwind классы
- `index.ts` barrel exports — импортировать напрямую из файлов
- `console.log` — только `console.error` для ошибок
- `// @ts-ignore` — исправлять типы

### Accessibility замечания

Эта история не создаёт UI-компоненты, но закладывает фундамент:
- Все текстовые данные (названия, описания) должны быть корректными строками для alt-текстов и aria-label в будущих компонентах
- Цены будут форматироваться через `Intl.NumberFormat` для экранного чтения

### Performance замечания

- QueryClient уже настроен с `staleTime: 5min` в providers.tsx
- Для `useItem` нужно явно указать `staleTime: 10min` (override дефолта)
- MSW handlers должны быть синхронными с JSON import (не async fetch файлов)
- JSON файлы импортируются через `import data from './data/items.json'` — Next.js поддерживает JSON import из коробки

### Deferred из Story 1-1

Следующие элементы были отложены из Story 1-1 и ЧАСТИЧНО реализуются в этой истории:
- MSW инициализация → реализуется в Task 6 (AC1)
- public/images/placeholder.webp → НЕ входит в scope этой истории, используй путь `/images/placeholder.webp` в данных (файл будет создан позже)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Data Architecture, API & Communication Patterns, Frontend Architecture, Project Structure]
- [Source: _bmad-output/planning-artifacts/epics.md — Story 1.2 AC, BDD criteria]
- [Source: _bmad-output/planning-artifacts/prd.md — Technical Requirements, NFR1-NFR6]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Дизайн-токены (trust colors для данных)]
- [Source: _bmad-output/implementation-artifacts/1-1-inicializaciya-proekta-i-dizajn-sistema.md — Previous story learnings, file list, review findings]

## Dev Agent Record

### Agent Model Used

GLM-5

### Debug Log References

### Completion Notes List

- ✅ Task 1: Созданы все TypeScript типы — api.ts, item.ts, category.ts, shop.ts строго по спецификации
- ✅ Task 2: Утилиты formatPrice (Intl.NumberFormat ru-RU), formatDate (Intl.DateTimeFormat ru-RU), constants (DEFAULT_PAGE_SIZE=12, STALE_TIMES, MAX_CART_ITEMS)
- ✅ Task 3: API клиент с AppError классом (4 типа ошибок), apiFetch и apiFetchPaginated обёртки
- ✅ Task 4: 55 товаров (20 ювелирных, 15 техника, 15 часы + 5 дополнительных), 5 ломбардов, 3 категории с filterOptions
- ✅ Task 5: MSW handlers — items с фильтрацией/пагинацией/сортировкой/поиском, categories, index композиция
- ✅ Task 6: MSW browser setup + providers.tsx обновлён с условным MSW стартом через useState
- ✅ Task 7: API функции getItems/getItemById/getCategories с query string построением
- ✅ Task 8: React Query hooks с key factory паттерном, useItems с дефолтными фильтрами, useItem с enabled guard
- ✅ Task 9: tsc --noEmit без ошибок, pnpm build успешен, каталог обновлён для верификации

### File List

- src/types/api.ts (NEW)
- src/types/item.ts (NEW)
- src/types/category.ts (NEW)
- src/types/shop.ts (NEW)
- src/lib/format-price.ts (NEW)
- src/lib/format-date.ts (NEW)
- src/lib/constants.ts (NEW)
- src/api/client.ts (NEW)
- src/api/items.ts (NEW)
- src/api/categories.ts (NEW)
- src/hooks/use-items.ts (NEW)
- src/hooks/use-categories.ts (NEW)
- src/mocks/browser.ts (NEW)
- src/mocks/handlers/items.ts (NEW)
- src/mocks/handlers/categories.ts (NEW)
- src/mocks/handlers/index.ts (NEW)
- src/mocks/data/items.json (NEW)
- src/mocks/data/shops.json (NEW)
- src/mocks/data/categories.json (NEW)
- src/app/providers.tsx (MODIFIED)
- src/app/catalog/page.tsx (MODIFIED)

## Change Log

- 2026-05-10: Реализована вся история — типы, утилиты, API клиент, моковые данные (55 товаров), MSW handlers, API функции, React Query hooks, верификационная страница каталога
