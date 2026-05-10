---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions, step-05-patterns, step-06-structure, step-07-validation, step-08-complete]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-05-07'
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
  - "_bmad-output/planning-artifacts/product-brief-simple-todo-todo.md"
  - "_bmad-output/planning-artifacts/product-brief-simple-todo-todo-distillate.md"
  - "_bmad-output/brainstorming/brainstorming-session-2026-05-07-0952.md"
workflowType: 'architecture'
project_name: 'PawnMarket'
user_name: 'oleg'
date: '2026-05-07'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (35 FRs):**
- Catalog & search (FR1–FR6): filtering, sorting, pagination — SSR for SEO
- Item card (FR7–FR12): "biography of things", rating, timeline, gallery
- Cart & checkout (FR13–FR18): delivery/pickup, order status
- Authentication (FR19–FR22): 3 roles — buyer, pawnshop, admin
- Pawnshop cabinet (FR23–FR28): CRUD items, order management
- Admin panel (FR29–FR33): moderation, analytics, reference data
- General UX (FR34–FR35): public catalog, responsive

**Non-Functional Requirements:**
- Performance: SSR ≤ 2s, Lighthouse ≥ 90, bundle ≤ 200KB
- Security: bcrypt, XSS protection, JWT, RBAC
- Accessibility: WCAG 2.1 AA

**Scale & Complexity:**
- Primary domain: Web App / Marketplace
- Complexity level: Low — MVP with mocked data, 1 developer
- Estimated components: ~8–10

### Technical Constraints & Dependencies

- Backend: mocked data (JSON/MSW), structure identical to future API
- Frontend: Next.js App Router + TanStack React Query
- UI: Tailwind CSS + shadcn/ui + 6 custom components
- SSR for catalog (SEO), CSR for cabinet and cart
- No realtime, no offline, no external integrations in MVP

### Cross-Cutting Concerns

1. RBAC — buyer/pawnshop/admin, different interfaces and permissions
2. Mocked data → real API — isolation through React Query hooks
3. SEO — SSR for catalog and item cards, meta tags, JSON-LD
4. Responsive — mobile-first, 4 breakpoints
5. Image optimization — Next.js Image, lazy loading
6. Trust architecture — TrustBadge, ItemTimeline as visual trust layer

## Starter Template Evaluation

### Primary Technology Domain

Web Application / Marketplace — Next.js 16 App Router с SSR/CSR гибридным рендерингом.

### Starter Options Considered

| Опция | Описание | Вердикт |
|-------|----------|---------|
| `create-next-app` (default) | Официальный CLI Next.js. TypeScript, Tailwind, ESLint, App Router из коробки. | ✅ Выбор — минимум бойлерплейта, полный контроль |
| T3 Stack (`create-t3-app`) | Next.js + tRPC + Prisma + NextAuth. Полный стек, но избыточен для MVP с моковыми данными. | ❌ Избыточен — нет реального API, нет БД |
| Next.js Commerce | Vercel шаблон для e-commerce. Готовые паттерны, но привязан к конкретным решениям. | ❌ Слишком opinionated |
| Кастомный boilerplate | Ручная сборка с нуля. | ❌ Трата времени при 1 разработчике |

### Selected Starter: `create-next-app` + послойная настройка

**Обоснование:**
- PRD определяет MVP с моковыми данными — нет необходимости в ORM, API-фреймворках, аутентификационных библиотеках
- Next.js 16.2.5 с App Router — актуальная стабильная версия с Turbopack и React Compiler
- Tailwind CSS — дефолт в create-next-app
- shadcn/ui, React Query, MSW добавляются как отдельные слои — чистая архитектура без лишних зависимостей

**Команда инициализации:**

```bash
npx create-next-app@latest pawn-market --typescript --tailwind --eslint --app --src-dir --use-pnpm
cd pawn-market
```

**Послойная настройка:**

```bash
# shadcn/ui — UI-компоненты
npx shadcn@latest init

# TanStack React Query v5 — управление данными
pnpm add @tanstack/react-query @tanstack/react-query-devtools

# MSW v2 — мокирование API
pnpm add -D msw
npx msw init public/ --save

# Дополнительные зависимости
pnpm add lucide-react
pnpm add class-variance-authority clsx tailwind-merge
```

**Архитектурные решения, зафиксированные starter-ом:**

**Language & Runtime:**
- TypeScript strict mode
- React 19 (в составе Next.js 16)
- Node.js 18+

**Styling Solution:**
- Tailwind CSS (v4 совместимый с Next.js 16)
- shadcn/ui — набор копируемых компонентов (tree-shaking бесплатно)
- CSS variables для дизайн-токенов (цвета доверия из UX-спецификации)

**Build Tooling:**
- Turbopack (дефолт в Next.js 16) — быстрая dev-сборка
- Оптимизированный production build

**Code Organization:**
- `src/` директория — app/, components/, lib/, hooks/, types/
- App Router file-based routing
- Colocation: компоненты рядом с маршрутами

**Development Experience:**
- Fast Refresh для React-компонентов
- TypeScript strict checking
- ESLint с правилами Next.js
- React Query Devtools для инспекции запросов

**Примечание:** Инициализация проекта этой командой должна быть первой implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Критические (блокируют реализацию):**
- React Query hooks как единый API-слой
- MSW handlers + JSON для моковых данных
- Mocked auth context с переключением ролей
- React Hook Form + Zod для форм

**Важные (формируют архитектуру):**
- Трёхуровневая компонентная архитектура (ui / shared / layout)
- Корзина через React Query + localStorage
- Error boundaries + кастомный AppError

**Отложенные (Post-MVP):**
- Реальная аутентификация (JWT/session)
- CSRF-защита
- Sentry error tracking
- GitHub Actions CI/CD

### Data Architecture

**Mock Data Format:** MSW v2 handlers + JSON-файлы в `src/mocks/data/`. MSW перехватывает fetch-запросы на уровне Service Worker, отдаёт данные из JSON. При замене на реальный API — MSW убирается, hooks не меняются.

**REST-like структура:**
- `GET /api/items` — каталог (пагинация, фильтры, сортировка)
- `GET /api/items/:id` — карточка товара
- `POST /api/items` — создание товара (ломбард)
- `PATCH /api/items/:id` — редактирование товара
- `GET /api/categories` — категории и фильтры
- `GET /api/orders` — заказы
- `POST /api/orders` — создание заказа
- `PATCH /api/orders/:id` — обновление статуса
- `GET /api/shops` — ломбарды
- `GET /api/shops/:id` — профиль ломбарда
- `POST /api/auth/login` — вход
- `POST /api/auth/register` — регистрация

**React Query кэширование:**
- Каталог: `staleTime: 5min`
- Карточка товара: `staleTime: 10min`
- Корзина: `staleTime: 0` (всегда актуальная)
- Optimistic updates для корзины

### Authentication & Security

**MVP Auth:** Mocked React Context с тремя предустановленными пользователями (buyer, pawnshop, admin). UI-переключатель ролей для разработки.

**RBAC:**
- 3 роли: `buyer`, `pawnshop`, `admin`
- Route guards через Next.js middleware
- Компонент `<RoleGuard>` для условного рендеринга
- Публичные: `/`, `/item/:id`, `/catalog`
- Buyer: `/cart`, `/profile`, `/orders`
- Pawnshop: `/cabinet/*`
- Admin: `/admin/*`

**Безопасность (подготовка):**
- Санитизация: React controlled components + DOMPurify
- XSS: Next.js JSX экранирование из коробки
- CSRF: отложен до Phase 2

### API & Communication Patterns

**Слои:**
```
src/api/client.ts      → fetch-обёртка (URL, заголовки, обработка ошибок)
src/api/items.ts       → API-функции (getItems, getItemById, createItem)
src/hooks/use-items.ts → React Query hooks (useItems, useItem, useCreateItem)
src/components/        → Только вызывают hooks
```

**Обработка ошибок:**
- `AppError` класс: `network`, `notFound`, `validation`, `unauthorized`
- Глобальный `onError` callback — toast для ошибок
- Error boundaries на уровне layout — fallback UI

**Загрузка:**
- Skeleton через React Query `isPending`
- Optimistic updates для корзины
- Mutation invalidation для связанных запросов

### Frontend Architecture

**Управление состоянием:**
| Тип | Решение |
|-----|---------|
| Серверные данные | React Query |
| Корзина | React Query + localStorage |
| UI-состояние | React useState / URL-параметры |
| Аутентификация | React Context |
| Формы | React Hook Form + Zod |

**Компонентная архитектура:**
```
src/components/
  ui/         → shadcn/ui (Button, Input, Card, Badge, Dialog...)
  shared/     → Бизнес-компоненты (TrustBadge, ItemTimeline, ProductCard, ProductGallery, OrderStatusFlow, WizardForm)
  layout/     → Структурные (Header, BottomNav, Sidebar, PageContainer)
```
Colocation: специфичные для страницы компоненты живут рядом с route.

**Формы:** React Hook Form + Zod-схемы. Wizard — отдельная схема на шаг, финальная — объединённая.

**Изображения:** `next/image` с `sizes`, lazy loading, placeholder blur, WebP/AVIF автоматически.

### Infrastructure & Deployment

**Хостинг:** Vercel — нативная интеграция с Next.js, preview-деплои, бесплатный tier.

**CI/CD:** Автодеплой Vercel при push в `main`. Preview при PR. Pre-commit hooks: husky + lint-staged (ESLint, TypeScript check).

**Окружения:**
```
.env.local       → разработка
.env.preview     → preview-деплои
.env.production  → production
```

**Мониторинг:** Отложен до Phase 2 (Sentry + Vercel Analytics).

### Decision Impact Analysis

**Порядок реализации:**
1. Инициализация проекта (create-next-app + зависимости)
2. API client + MSW handlers + JSON данные
3. Auth context + RBAC middleware
4. Layout-компоненты (Header, BottomNav, Sidebar)
5. Catalog page + ProductCard + TrustBadge
6. Item page + ProductGallery + ItemTimeline
7. Cart + checkout flow
8. Pawnshop cabinet + WizardForm
9. Admin panel

**Кросс-компонентные зависимости:**
- MSW handlers → зависят от JSON-структуры данных
- React Query hooks → зависят от API client
- RBAC middleware → зависит от Auth context
- ProductCard/TrustBadge → зависят от React Query items hook
- WizardForm → зависит от React Hook Form + Zod + React Query mutation

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

Области потенциальных конфликтов между AI-агентами: 6 категорий, ~30 точек конфликта.

### Naming Patterns

**Именование файлов:**

| Элемент | Паттерн | Пример |
|---------|---------|--------|
| Компоненты | PascalCase.tsx | `ProductCard.tsx`, `TrustBadge.tsx` |
| Хуки | camelCase с префиксом use- | `use-items.ts` → экспорт `useItems` |
| Утилиты | camelCase | `format-price.ts` → экспорт `formatPrice` |
| API-функции | kebab-case | `items.ts` → экспорт `getItems`, `createItem` |
| Типы | PascalCase | `Item`, `Order`, `Shop`, `User` |
| Zod-схемы | camelCase с суффиксом Schema | `itemSchema`, `createItemSchema` |
| Тесты | Co-located | `ProductCard.test.tsx` рядом с компонентом |
| Страницы (routes) | kebab-case / Next.js конвенция | `item/[id]/page.tsx` |

**Именование в коде:**

| Элемент | Паттерн | Пример |
|---------|---------|--------|
| Переменные | camelCase | `itemCount`, `shopName` |
| Константы | UPPER_SNAKE_CASE | `MAX_CART_ITEMS`, `DEFAULT_PAGE_SIZE` |
| Типы/интерфейсы | PascalCase | `Item`, `CartItem`, `OrderStatus` |
| Enum | PascalCase | `OrderStatus.Accepted` |
| Zod-enum | camelCase | `orderStatusSchema` |
| React-компоненты | PascalCase | `<ProductCard />` |
| Пропсы | `ComponentNameProps` интерфейс | `ProductCardProps` |
| Event handlers | handle + действие | `handleSubmit`, `handleAddToCart` |
| Boolean переменные | is/has/should префикс | `isLoading`, `hasItems`, `shouldRefetch` |
| API-функции | глагол + сущность | `getItems`, `createOrder`, `updateShop` |
| React Query keys | кортеж с префиксом | `['items', filters]`, `['item', id]` |

### Structure Patterns

**Организация проекта:**

```
src/
  app/                    # Next.js App Router — маршруты и страницы
    (public)/             # Route group: публичные страницы
      catalog/
      item/[id]/
    (auth)/               # Route group: страницы аутентификации
      login/
      register/
    (buyer)/              # Route group: buyer-зона
      cart/
      profile/
      orders/
    (pawnshop)/           # Route group: кабинет ломбарда
      cabinet/
        items/
        orders/
        add-item/
    (admin)/              # Route group: админ-панель
      admin/
        shops/
        items/
        analytics/
  components/
    ui/                   # shadcn/ui — не меняем
    shared/               # Переиспользуемые бизнес-компоненты
    layout/               # Структурные компоненты
  hooks/                  # React Query hooks + кастомные хуки
  api/                    # API-функции (fetch-обёртки)
  lib/                    # Утилиты, константы, конфигурация
  types/                  # Глобальные TypeScript типы
  mocks/                  # MSW handlers + JSON данные
    handlers/             # MSW handlers по домену
    data/                 # JSON-файлы с моковыми данными
```

**Правило colocation:** Компоненты, используемые только на одной странице, живут в `components/` подпапке рядом с `page.tsx`.

### Format Patterns

**API Response Format:**

Успешный ответ:
```typescript
{ data: T, meta?: { page: number, totalPages: number, total: number } }
```

Ошибочный ответ:
```typescript
{ error: { code: string, message: string, details?: Record<string, string[]> } }
```

**Пагинация:**
- Query params: `?page=1&limit=20`
- Response meta: `{ page, totalPages, total, limit }`

**Даты:** ISO 8601 строки (`"2026-05-07T12:00:00Z"`). В UI — форматирование через `Intl.DateTimeFormat('ru-RU')`.

**JSON поля:** camelCase на фронте. API-ответы моков тоже camelCase.

**Денежные значения:** Число (number). Форматирование: `Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })`.

### Communication Patterns

**React Query Keys:**

```typescript
const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (filters: ItemFilters) => [...itemKeys.lists(), filters] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
};
```

**Mutation invalidation:**
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: itemKeys.all });
}
```

**State update patterns:** Только immutable updates.

### Process Patterns

**Error Handling:**

| Уровень | Подход |
|---------|--------|
| API client | Бросает `AppError` с типом и сообщением |
| React Query hook | Передаёт ошибку в `onError` → toast |
| Error boundary | Ловит render errors → fallback UI |
| Form validation | Zod-схема → ошибки под полями |

**Loading States:**

| Состояние | UI | Что использует |
|-----------|----|----------------|
| Первая загрузка | Skeleton (3 карточки) | `isPending` |
| Фоновое обновление | Тихо, без UI | `isFetching` |
| Mutation | Спиннер на кнопке, disabled | `isPending` (mutation) |
| Optimistic update | Мгновенный UI, откат при ошибке | `onMutate` + `onError` + `onSettled` |

**Порядок импортов:**

```typescript
// 1. React/Next.js
import { useState } from 'react';
import Image from 'next/image';
// 2. Сторонние библиотеки
import { useQuery } from '@tanstack/react-query';
// 3. Внутренние модули (алиас @/)
import { useItem } from '@/hooks/use-items';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format-price';
// 4. Типы
import type { Item } from '@/types/item';
```

### Enforcement Guidelines

**Все AI-агенты ОБЯЗАНЫ:**

1. Следовать naming patterns — PascalCase для компонентов, camelCase для переменных и функций
2. Использовать React Query hooks для данных, никогда не вызывать api/ напрямую из компонентов
3. Все формы валидировать через Zod-схемы
4. Все новые API-эндпоинты покрывать MSW handler'ом
5. Соблюдать порядок импортов
6. Использовать `@/` алиас для всех внутренних импортов
7. Типизировать все props через интерфейсы `ComponentNameProps`
8. Использовать `const` для React Query key factories
9. Форматировать даты через `Intl.DateTimeFormat('ru-RU')`, цены через `Intl.NumberFormat`
10. Мобильные стили писать первыми (mobile-first), `md:` / `lg:` для расширения

**Anti-Patterns (ЗАПРЕЩЕНО):**

- `any` тип — использовать `unknown` + type guard
- Прямой `fetch()` из компонентов — только через hooks
- Inline стили — только Tailwind классы
- `index.ts` barrel exports — импортировать напрямую из файлов
- `console.log` в production коде — только `console.error` для ошибок
- `// @ts-ignore` — исправлять типы, не подавлять

## Project Structure & Boundaries

### Complete Project Directory Structure

```
pawn-market/
├── .env.local
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json                  # shadcn/ui конфигурация
├── public/
│   ├── mockServiceWorker.js         # MSW service worker
│   ├── images/
│   │   └── placeholder.webp        # Placeholder для фото
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind + CSS variables (дизайн-токены)
│   │   ├── layout.tsx               # Root layout (providers, fonts)
│   │   ├── page.tsx                 # Главная → редирект на /catalog
│   │   ├── not-found.tsx            # 404 страница
│   │   ├── error.tsx                # Global error boundary
│   │   ├── providers.tsx            # QueryClientProvider + AuthProvider + Toaster
│   │   ├── sitemap.ts               # SEO: генерация sitemap.xml
│   │   ├── robots.ts                # SEO: генерация robots.txt
│   │   ├── (public)/
│   │   │   ├── layout.tsx           # Public layout (Header + BottomNav)
│   │   │   ├── catalog/
│   │   │   │   ├── page.tsx         # FR1–FR6: Каталог с поиском и фильтрами
│   │   │   │   ├── loading.tsx      # Skeleton для каталога
│   │   │   │   └── components/
│   │   │   │       ├── CatalogGrid.tsx
│   │   │   │       ├── FilterSidebar.tsx
│   │   │   │       ├── FilterSheet.tsx    # Mobile filters
│   │   │   │       ├── SortSelect.tsx
│   │   │   │       ├── SearchBar.tsx
│   │   │   │       └── CatalogSkeleton.tsx
│   │   │   └── item/
│   │   │       └── [id]/
│   │   │           ├── page.tsx     # FR7–FR12: Карточка товара (SSR)
│   │   │           ├── loading.tsx  # Skeleton для карточки товара
│   │   │           └── components/
│   │   │               ├── ItemPageContent.tsx
│   │   │               ├── ItemInfo.tsx
│   │   │               └── AddToCartButton.tsx
│   │   ├── (auth)/
│   │   │   ├── layout.tsx           # Auth layout (минимальный)
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # FR19–FR20: Вход
│   │   │   └── register/
│   │   │       └── page.tsx         # FR19/FR21: Регистрация (tabs: Покупатель / Ломбард)
│   │   ├── (buyer)/
│   │   │   ├── layout.tsx           # Buyer layout (Header + BottomNav + RoleGuard)
│   │   │   ├── cart/
│   │   │   │   ├── page.tsx         # FR13–FR14: Корзина
│   │   │   │   └── components/
│   │   │   │       ├── CartItem.tsx
│   │   │   │       ├── CartSummary.tsx
│   │   │   │       └── EmptyCart.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx         # FR15–FR17: Оформление заказа
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx         # FR18: Мои заказы
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Детали заказа
│   │   │   └── profile/
│   │   │       └── page.tsx         # Профиль покупателя
│   │   ├── (pawnshop)/
│   │   │   ├── layout.tsx           # Pawnshop layout (Sidebar + RoleGuard)
│   │   │   └── cabinet/
│   │   │       ├── page.tsx         # Dashboard ломбарда
│   │   │       ├── items/
│   │   │       │   ├── page.tsx     # FR26: Список товаров ломбарда
│   │   │       │   └── [id]/
│   │   │       │       └── page.tsx # FR24: Редактирование товара
│   │   │       ├── add-item/
│   │   │       │   └── page.tsx     # FR23: Wizard добавления товара
│   │   │       └── orders/
│   │   │           ├── page.tsx     # FR27: Заказы ломбарда
│   │   │           └── [id]/
│   │   │               └── page.tsx # FR28: Управление заказом
│   │   └── (admin)/
│   │       ├── layout.tsx           # Admin layout (Sidebar + RoleGuard)
│   │       └── admin/
│   │           ├── page.tsx         # FR32: Dashboard аналитика
│   │           ├── shops/
│   │           │   ├── page.tsx     # FR29–FR30: Ломбарды (модерация)
│   │           │   └── [id]/
│   │           │       └── page.tsx # Детали ломбарда
│   │           ├── items/
│   │           │   └── page.tsx     # FR31: Модерация товаров
│   │           └── categories/
│   │               └── page.tsx     # FR33: Управление справочниками
│   ├── components/
│   │   ├── ui/                      # shadcn/ui компоненты (автогенерация)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── table.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── select.tsx
│   │   │   └── progress.tsx
│   │   ├── shared/                  # Бизнес-компоненты
│   │   │   ├── TrustBadge.tsx       # FR8: Рейтинг прозрачности
│   │   │   ├── ItemTimeline.tsx     # FR11: Таймлайн жизни товара
│   │   │   ├── ProductCard.tsx      # Карточка в каталоге
│   │   │   ├── ProductGallery.tsx   # FR12: Фото-галерея
│   │   │   ├── OrderStatusFlow.tsx  # FR28: Прогресс заказа
│   │   │   ├── WizardForm.tsx       # FR23: Wizard-форма
│   │   │   ├── RoleGuard.tsx        # Условный рендеринг по роли
│   │   │   └── RoleSwitcher.tsx     # Dev: переключение ролей
│   │   └── layout/                  # Структурные компоненты
│   │       ├── Header.tsx
│   │       ├── BottomNav.tsx        # Mobile навигация
│   │       ├── Sidebar.tsx          # Desktop навигация (cabinet/admin)
│   │       ├── PageContainer.tsx    # Wrapper с max-width
│   │       ├── Breadcrumbs.tsx
│   │       └── Footer.tsx
│   ├── hooks/
│   │   ├── use-items.ts             # useItems, useItem, useCreateItem, useUpdateItem
│   │   ├── use-cart.ts              # useCart, useAddToCart, useRemoveFromCart, useClearCart
│   │   ├── use-orders.ts            # useOrders, useOrder, useCreateOrder, useUpdateOrderStatus
│   │   ├── use-shops.ts             # useShops, useShop
│   │   ├── use-categories.ts        # useCategories
│   │   ├── use-auth.ts              # useAuth, useLogin, useLogout, useRegister
│   │   └── use-filters.ts           # URL-параметры фильтров
│   ├── api/
│   │   ├── client.ts                # fetch-обёртка + AppError
│   │   ├── items.ts                 # getItems, getItemById, createItem, updateItem, deleteItem
│   │   ├── orders.ts                # getOrders, getOrderById, createOrder, updateOrderStatus
│   │   ├── shops.ts                 # getShops, getShopById
│   │   ├── categories.ts            # getCategories
│   │   └── auth.ts                  # login, register, logout, getCurrentUser
│   ├── lib/
│   │   ├── utils.ts                 # cn() утилита shadcn/ui
│   │   ├── format-price.ts          # Intl.NumberFormat для цен
│   │   ├── format-date.ts           # Intl.DateTimeFormat для дат
│   │   ├── query-client.ts          # QueryClient конфигурация
│   │   ├── constants.ts             # MAX_CART_ITEMS, DEFAULT_PAGE_SIZE, STALE_TIMES
│   │   └── validators.ts            # Общие Zod-схемы (pagination, id)
│   ├── types/
│   │   ├── item.ts                  # Item, ItemFilters, ItemStatus
│   │   ├── order.ts                 # Order, OrderStatus, CreateOrderInput
│   │   ├── shop.ts                  # Shop, ShopStatus
│   │   ├── cart.ts                  # CartItem
│   │   ├── user.ts                  # User, UserRole
│   │   ├── category.ts              # Category, FilterOption
│   │   └── api.ts                   # ApiResponse, PaginatedResponse, ApiError
│   ├── mocks/
│   │   ├── browser.ts               # MSW browser setup
│   │   ├── handlers/
│   │   │   ├── index.ts             # Композиция всех handlers
│   │   │   ├── items.ts             # GET/POST/PATCH /api/items
│   │   │   ├── orders.ts            # GET/POST/PATCH /api/orders
│   │   │   ├── shops.ts             # GET /api/shops
│   │   │   ├── categories.ts        # GET /api/categories
│   │   │   └── auth.ts              # POST /api/auth/*
│   │   └── data/
│   │       ├── items.json           # 50+ товаров
│   │       ├── shops.json           # 5+ ломбардов
│   │       ├── categories.json      # 3 категории + параметры фильтров
│   │       ├── orders.json          # 10+ заказов
│   │       └── users.json           # 3 пользователя (buyer, pawnshop, admin)
│   ├── context/
│   │   └── auth-context.tsx         # AuthProvider + useAuthContext
│   ├── middleware.ts                # Next.js middleware (RBAC route guards)
│   └── schemas/
│       ├── item-schema.ts           # createItemSchema, updateItemSchema
│       ├── order-schema.ts          # createOrderSchema
│       ├── auth-schema.ts           # loginSchema, registerBuyerSchema, registerShopSchema
│       └── checkout-schema.ts       # checkoutSchema (контакты + способ доставки)
```

### Architectural Boundaries

**API Boundaries:**

```
Components → hooks/ → api/ → MSW handlers → JSON data
                      ↑
                   При замене: api/ → real backend, hooks не меняются
```

- Компоненты не знают об источнике данных — только hooks
- hooks не знают о fetch-реализации — только api-функции
- api-функции не знают о моках — MSW перехватывает прозрачно

**Component Boundaries:**

```
layout/          → Структура страницы, не содержит бизнес-логики
shared/          → Переиспользуемые бизнес-компоненты, принимают props
ui/              → shadcn/ui, не трогаем
page components/ → Связывают hooks + shared + ui, специфичны для страницы
```

**Route Group Boundaries:**

```
(public)    → SSR, без аутентификации, SEO-оптимизировано
(auth)      → Минимальный layout, редирект если уже авторизован
(buyer)     → CSR, RoleGuard(buyer), Header + BottomNav
(pawnshop)  → CSR, RoleGuard(pawnshop), Sidebar навигация
(admin)     → CSR, RoleGuard(admin), Sidebar навигация
```

### Requirements to Structure Mapping

| FR | Требование | Файлы |
|----|-----------|-------|
| FR1–FR6 | Каталог и поиск | `app/(public)/catalog/`, `hooks/use-items.ts`, `api/items.ts` |
| FR7–FR12 | Карточка товара | `app/(public)/item/[id]/`, `components/shared/TrustBadge.tsx`, `ItemTimeline.tsx`, `ProductGallery.tsx` |
| FR13–FR17 | Корзина и заказ | `app/(buyer)/cart/`, `app/(buyer)/checkout/`, `hooks/use-cart.ts`, `hooks/use-orders.ts` |
| FR18 | Статус заказов | `app/(buyer)/orders/`, `components/shared/OrderStatusFlow.tsx` |
| FR19–FR22 | Аутентификация | `app/(auth)/`, `context/auth-context.tsx`, `hooks/use-auth.ts`, `schemas/auth-schema.ts` |
| FR23–FR26 | Кабинет ломбарда | `app/(pawnshop)/cabinet/`, `components/shared/WizardForm.tsx`, `hooks/use-items.ts` |
| FR27–FR28 | Заказы ломбарда | `app/(pawnshop)/cabinet/orders/`, `hooks/use-orders.ts` |
| FR29–FR33 | Админ-панель | `app/(admin)/admin/`, `hooks/use-shops.ts`, `hooks/use-items.ts`, `hooks/use-categories.ts` |
| FR34–FR35 | Общий UX | `middleware.ts`, `components/layout/*`, `app/globals.css` |

### Integration Points

**Data Flow:**

```
[JSON data] → [MSW handlers] → [fetch()] → [api/client.ts] → [api/items.ts] → [useItems hook] → [Component]
```

**Auth Flow:**

```
[LoginForm] → [useLogin hook] → [api/auth.ts] → [MSW auth handler] → [AuthContext update] → [middleware.ts redirect]
```

**Cart Flow:**

```
[AddToCartButton] → [useAddToCart hook] → [localStorage write] → [React Query invalidation] → [CartPage re-render]
```

## Architecture Validation Results

### Coherence Validation ✅

**Совместимость решений:**
- Next.js 16 + React Query v5 + Tailwind + shadcn/ui — стандартный совместимый стек, противоречий нет
- MSW v2 перехватывает fetch → React Query делает fetch через api/ слой — прозрачная цепочка
- React Hook Form + Zod — стандартная пара для форм
- Auth Context + Next.js middleware для RBAC — работает с App Router
- Route groups для разделения layouts — корректный паттерн Next.js

**Консистентность паттернов:**
- Naming patterns единообразны: PascalCase (компоненты), camelCase (функции/переменные), kebab-case (файлы)
- API response format стандартизирован
- React Query keys через factory pattern
- Порядок импортов зафиксирован

**Структурная согласованность:**
- Каждый FR замаплен на конкретные файлы
- Границы route groups соответствуют ролям
- Слои api/ → hooks/ → components/ разделены

### Requirements Coverage Validation ✅

**Functional Requirements:**

| FR | Покрыт | Где |
|----|--------|-----|
| FR1–FR6 | ✅ | catalog/ + use-items + api/items |
| FR7–FR12 | ✅ | item/[id]/ + TrustBadge + ItemTimeline + ProductGallery |
| FR13–FR17 | ✅ | cart/ + checkout/ + use-cart + use-orders |
| FR18 | ✅ | orders/ + OrderStatusFlow |
| FR19–FR20 | ✅ | login/ + use-auth |
| FR21–FR22 | ✅ | register/ (tabs: Покупатель / Ломбард) + use-auth |
| FR23–FR26 | ✅ | cabinet/ + WizardForm |
| FR27–FR28 | ✅ | cabinet/orders/ |
| FR29–FR33 | ✅ | admin/ + hooks |
| FR34–FR35 | ✅ | (public) route group + Tailwind mobile-first |

**Non-Functional Requirements:**

| NFR | Покрыт | Как |
|-----|--------|-----|
| NFR1–NFR3 | ✅ | SSR + React Query кэширование |
| NFR4 | ✅ | next/image с optimization |
| NFR5–NFR6 | ✅ | Bundle control через tree-shaking + code splitting |
| NFR7–NFR11 | ✅ | Auth context + RBAC + XSS защита (mocked для MVP) |
| NFR12–NFR17 | ✅ | shadcn/ui WCAG + ARIA + semantic HTML |
| SEO | ✅ | SSR + sitemap.ts + robots.ts + JSON-LD в item page |

### Gap Analysis Results

**Исправленные gap-ы:**
1. ✅ Регистрация покупателя (FR19) — register/page.tsx теперь с tabs: Покупатель / Ломбард
2. ✅ SEO-инфраструктура — добавлены sitemap.ts, robots.ts, JSON-LD в item page
3. ✅ Route-level loading states — добавлены loading.tsx для catalog и item/[id]

**Отложенные (Post-MVP):**
- Testing infrastructure (vitest/playwright setup) — определим при реализации
- Storybook — Phase 2
- OG-image генерация — Phase 2

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Чёткое разделение слоёв данных (api → hooks → components) — лёгкая замена моков на реальный API
- Все 35 FR покрыты конкретными файлами и компонентами
- Консистентные naming patterns и enforcement guidelines для AI-агентов
- UX-спецификация полностью интегрирована в архитектуру (дизайн-токены, компоненты, breakpoints)

**Areas for Future Enhancement:**
- Testing strategy — определить при начале реализации
- Real-time updates (WebSocket) — Phase 2 при подключении реального API
- Аналитика и мониторинг — Sentry + Vercel Analytics в Phase 2

### Implementation Handoff

**AI Agent Guidelines:**

- Следовать всем архитектурным решениям как задокументировано
- Использовать implementation patterns консистентно во всех компонентах
- Соблюдать структуру проекта и границы
- Обращаться к этому документу для всех архитектурных вопросов

**First Implementation Priority:**

```bash
npx create-next-app@latest pawn-market --typescript --tailwind --eslint --app --src-dir --use-pnpm
cd pawn-market
npx shadcn@latest init
pnpm add @tanstack/react-query @tanstack/react-query-devtools
pnpm add -D msw && npx msw init public/ --save
pnpm add lucide-react class-variance-authority clsx tailwind-merge
```
