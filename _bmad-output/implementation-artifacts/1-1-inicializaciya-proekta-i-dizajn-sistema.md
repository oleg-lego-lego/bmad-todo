# Story 1.1: Инициализация проекта и дизайн-система

Status: review

## Story

As a разработчик,
I want иметь инициализированный проект с дизайн-системой и layout,
So that все последующие истории строятся на готовом фундаменте.

## Acceptance Criteria

1. **AC1: Проект инициализирован**
   - Given команда `create-next-app` выполнена с TypeScript, Tailwind, ESLint, App Router, src-dir, pnpm
   - When разработчик открывает проект
   - Then установлен Next.js 16.2.5 с Turbopack, React 19, TypeScript strict mode

2. **AC2: Все зависимости установлены**
   - React Query v5 (`@tanstack/react-query`, `@tanstack/react-query-devtools`)
   - MSW v2 (`msw` как devDependency, `mockServiceWorker.js` в public/)
   - React Hook Form + Zod (`react-hook-form`, `@hookform/resolvers`, `zod`)
   - lucide-react
   - CVA + clsx + tailwind-merge (`class-variance-authority`, `clsx`, `tailwind-merge`)

3. **AC3: shadcn/ui инициализирован**
   - `components.json` настроен
   - Установлены компоненты: Button, Input, Card, Badge, Dialog, Sheet, Table, Avatar, Tabs, Separator, Skeleton, Toast, Select, Progress

4. **AC4: Дизайн-токены в globals.css**
   - Primary: #1E40AF, primary-hover: #1D4ED8, primary-light: #EFF6FF
   - Background: #FFFFFF, Surface: #F8FAFC
   - Text: primary #1E293B, secondary #64748B
   - Border: #E2E8F0
   - Trust colors: high #22C55E/#F0FDF4, medium #EAB308/#FEFCE8, low #EF4444/#FEF2F2
   - Typography: Inter (Google Fonts, кириллица), H1 24m/32d, H2 20m/24d, H3 18px, Body 14m/16d, Caption 12px, Price 20px Bold
   - Spacing unit: 4px (scale: 4,8,12,16,20,24,32,40,48,64)
   - Border radius: cards 8px, buttons 6px, modals 12px
   - Breakpoints: sm:640, md:768, lg:1024, xl:1280

5. **AC5: Иерархия кнопок**
   - Primary: primary bg, white text (одна на экран)
   - Secondary: border primary
   - Destructive: bg red
   - Ghost: transparent
   - Touch target: min 44x44px mobile

6. **AC6: Root layout**
   - `providers.tsx`: QueryClientProvider + Toaster placeholder
   - Root layout подключает providers + Inter font

7. **AC7: Public layout**
   - Header (desktop): Лого / Каталог / Корзина / Войти
   - BottomNav (mobile): Главная / Каталог / Корзина / Профиль
   - PageContainer: max-width 1280px, центрирован, padding по breakpoint

8. **AC8: Роутинг**
   - `/` → редирект на `/catalog`
   - `not-found.tsx` — 404 страница
   - `error.tsx` — global error boundary

9. **AC9: Pre-commit hooks**
   - husky + lint-staged
   - Pre-commit: ESLint + TypeScript check

10. **AC10: Конфигурационные файлы**
    - `.env.example` с описанием переменных
    - `.env.local` с дефолтными значениями
    - `next.config.ts` с настройками Image optimization
    - `tsconfig.json` с strict mode

## Tasks / Subtasks

- [x] Task 1: Инициализация Next.js проекта (AC: #1)
  - [x] 1.1 Выполнить `npx create-next-app@latest pawn-market --typescript --tailwind --eslint --app --src-dir --use-pnpm`
  - [x] 1.2 Перенести содержимое в корень проекта (если нужно)
  - [x] 1.3 Проверить `tsconfig.json` — включить strict mode
  - [x] 1.4 Настроить `next.config.ts` — Image optimization, remote patterns

- [x] Task 2: Установка зависимостей (AC: #2)
  - [x] 2.1 `pnpm add @tanstack/react-query @tanstack/react-query-devtools`
  - [x] 2.2 `pnpm add -D msw && npx msw init public/ --save`
  - [x] 2.3 `pnpm add react-hook-form @hookform/resolvers zod`
  - [x] 2.4 `pnpm add lucide-react`
  - [x] 2.5 `pnpm add class-variance-authority clsx tailwind-merge`

- [x] Task 3: Инициализация shadcn/ui (AC: #3)
  - [x] 3.1 `npx shadcn@latest init` — выбрать New York style, Neutral base color
  - [x] 3.2 Установить компоненты: `npx shadcn@latest add button input card badge dialog sheet table avatar tabs separator skeleton sonner select progress`

- [x] Task 4: Дизайн-токены и globals.css (AC: #4, #5)
  - [x] 4.1 Настроить CSS variables в `src/app/globals.css` для всех цветов из AC4
  - [x] 4.2 Добавить типографику Inter через `next/font/google`
  - [x] 4.3 Настроить Tailwind config для spacing scale (4px unit)
  - [x] 4.4 Настроить border-radius токены
  - [x] 4.5 Определить Tailwind breakpoints: sm:640, md:768, lg:1024, xl:1280

- [x] Task 5: Layout-компоненты (AC: #6, #7)
  - [x] 5.1 Создать `src/app/providers.tsx` — QueryClientProvider + Toaster
  - [x] 5.2 Обновить `src/app/layout.tsx` — подключить providers + Inter font
  - [x] 5.3 Создать `src/components/layout/Header.tsx` — desktop навигация
  - [x] 5.4 Создать `src/components/layout/BottomNav.tsx` — mobile навигация
  - [x] 5.5 Создать `src/components/layout/PageContainer.tsx` — max-width 1280px

- [x] Task 6: Роутинг и страницы (AC: #8)
  - [x] 6.1 Настроить `src/app/page.tsx` — redirect на `/catalog`
  - [x] 6.2 Создать `src/app/not-found.tsx` — 404
  - [x] 6.3 Создать `src/app/error.tsx` — error boundary
  - [x] 6.4 Создать заглушку `src/app/catalog/page.tsx`

- [x] Task 7: Pre-commit hooks (AC: #9)
  - [x] 7.1 `pnpm add -D husky lint-staged`
  - [x] 7.2 Настроить husky: `pnpm exec husky init`
  - [x] 7.3 Настроить lint-staged в package.json: ESLint + tsc --noEmit
  - [x] 7.4 Обновить pre-commit hook

- [x] Task 8: Конфигурация окружения (AC: #10)
  - [x] 8.1 Создать `.env.example` с описанием переменных
  - [x] 8.2 Создать `.env.local` с дефолтными значениями
  - [x] 8.3 Обновить `.gitignore` при необходимости

- [x] Task 9: Верификация (AC: все)
  - [x] 9.1 `pnpm build` проходит без ошибок
  - [x] 9.2 `pnpm dev` запускается корректно
  - [x] 9.3 Pre-commit hook срабатывает при коммите
  - [x] 9.3 Визуальная проверка: Header + BottomNav + PageContainer

## Dev Notes

### Критические архитектурные решения

**Не используй T3 Stack или другие стартеры** — только `create-next-app` + ручная настройка. [Source: architecture.md]

**Mobile-first подход**: стили для мобильных пишутся по умолчанию, `md:`/`lg:` для расширения. [Source: architecture.md]

**Структура каталогов** (строго соблюдать):
```
src/
├── app/           # Next.js App Router — страницы и роуты
├── components/
│   ├── ui/        # shadcn/ui (автогенерация, НЕ редактировать напрямую стиль)
│   ├── shared/    # Бизнес-компоненты (TrustBadge, ItemTimeline и т.д.)
│   └── layout/    # Структурные (Header, BottomNav, Sidebar, PageContainer)
├── hooks/         # React Query hooks + custom hooks (use-items.ts → useItems)
├── api/           # fetch wrappers (client.ts, items.ts → getItems, createItem)
├── lib/           # Утилиты, константы, конфигурация
├── types/         # Глобальные TypeScript типы (PascalCase: Item, Order, Shop)
├── mocks/         # MSW handlers + JSON данные
├── context/       # React contexts
├── schemas/       # Zod schemas (camelCase + Schema suffix: itemSchema)
└── middleware.ts   # Next.js middleware (RBAC route guards)
```

**Именование файлов** (строго):
| Элемент | Паттерн | Пример |
|---------|---------|--------|
| Компоненты | PascalCase.tsx | `ProductCard.tsx` |
| Hooks | camelCase с use- prefix | `use-items.ts` → `useItems` |
| Утилиты | camelCase | `format-price.ts` → `formatPrice` |
| API функции | kebab-case | `items.ts` → `getItems`, `createItem` |
| Типы | PascalCase | `Item`, `Order`, `Shop`, `User` |
| Zod схемы | camelCase + Schema | `itemSchema`, `createItemSchema` |
| Тесты | Co-located | `ProductCard.test.tsx` рядом с компонентом |

**Именование в коде**:
- Переменные: camelCase (`itemCount`)
- Константы: UPPER_SNAKE_CASE (`MAX_CART_ITEMS`, `DEFAULT_PAGE_SIZE`)
- Props интерфейсы: `ComponentNameProps`
- Обработчики: handle + action (`handleSubmit`)
- Boolean: is/has/should prefix (`isLoading`, `hasItems`)
- React Query keys: tuple `['items', filters]`, `['item', id]`

### Ключевые технические требования

**Next.js Image**: все изображения через `<Image>` с `sizes`, lazy loading, placeholder blur, WebP/AVIF. [Source: architecture.md]

**TypeScript strict mode**: обязательно включить в tsconfig.json. [Source: architecture.md]

**React Query кеширование** (для будущих историй, но заложить основу):
- Catalog: `staleTime: 5min`
- Item card: `staleTime: 10min`
- Cart: `staleTime: 0` (always fresh)

**API Response format** (для будущих историй):
```typescript
// Success
{ data: T, meta?: { page: number, totalPages: number, total: number } }
// Error
{ error: { code: string, message: string, details?: Record<string, string[]> } }
```

### Accessibility (WCAG 2.1 AA) — закладываем основу

- Контраст текста ≥ 4.5:1, крупный текст ≥ 3:1
- Focus states: 2px outline в primary color
- Touch targets: min 44x44px на мобильных
- Semantic HTML + ARIA labels
- `prefers-reduced-motion` — отключать анимации

### Performance цели

- Lighthouse Performance Score ≥ 90
- Bundle size homepage ≤ 200KB gzipped
- FCP ≤ 1.5s, LCP ≤ 2.0s, TTI ≤ 3.0s
- SSR для каталога ≤ 2s

### Утилита cn()

Создать `src/lib/utils.ts` с функцией `cn()` (clsx + tailwind-merge) — это стандарт shadcn/ui:
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Dependencies для установки

```bash
# Core
pnpm add @tanstack/react-query @tanstack/react-query-devtools
pnpm add react-hook-form @hookform/resolvers zod
pnpm add lucide-react
pnpm add class-variance-authority clsx tailwind-merge

# Dev
pnpm add -D msw
npx msw init public/ --save
pnpm add -D husky lint-staged

# shadcn/ui (через CLI)
npx shadcn@latest init
npx shadcn@latest add button input card badge dialog sheet table avatar tabs separator skeleton toast select progress
```

### Project Structure Notes

- Проект создаётся с нуля в корне рабочей директории
- Конфликтов с существующим кодом нет — это первая история
- Все пути относительные от корня проекта
- `public/` содержит `mockServiceWorker.js` (MSW), `images/placeholder.webp`, `favicon.ico`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Технический стек, структура каталогов, именование]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Дизайн-токены, breakpoints, WCAG, иерархия кнопок]
- [Source: _bmad-output/planning-artifacts/prd.md — Performance требования, SEO, security]
- [Source: _bmad-output/planning-artifacts/epics.md — Story 1.1 AC, BDD criteria]

## Dev Agent Record

### Agent Model Used

GLM-5

### Debug Log References

- Build error: `asChild` prop не поддерживается в новом shadcn/ui (base-nova стиль с @base-ui/react). Исправлено: заменён Button + asChild на обычные Link элементы с нужными стилями.
- ESLint warnings: неиспользуемые импорты (Home icon в BottomNav, error в error.tsx). Исправлено.

### Completion Notes List

- Next.js 16.2.6 с React 19.2.4, TypeScript strict mode, Tailwind v4, App Router, src-dir, pnpm
- Все зависимости установлены: React Query v5, MSW v2, React Hook Form, Zod, lucide-react, CVA/clsx/tailwind-merge
- shadcn/ui (base-nova style) инициализирован с 14 компонентами (sonner вместо deprecated toast)
- Дизайн-токены: все цвета из AC4 (primary, trust colors, surface, text), Inter font с кириллицей, breakpoints 640/768/1024/1280, radius 0.5rem base
- Layout: Providers (QueryClient + Toaster), Header (desktop nav), BottomNav (mobile), PageContainer (max-w-1280px)
- Routing: / → /catalog redirect, not-found.tsx, error.tsx, catalog stub page
- Pre-commit: husky + lint-staged (eslint --fix + tsc --noEmit)
- Env: .env.example, .env.local, .gitignore обновлён
- `pnpm build` — успешно, `pnpm dev` — запускается, `tsc --noEmit` — без ошибок, `eslint` — 0 errors

### File List

- `package.json` — updated (dependencies, lint-staged config, msw workerDirectory)
- `tsconfig.json` — kept (strict mode already enabled)
- `next.config.ts` — updated (image optimization, remote patterns)
- `src/app/globals.css` — updated (PawnMarket design tokens, trust colors, breakpoints, reduced motion)
- `src/app/layout.tsx` — updated (Inter font, Providers, Header, BottomNav)
- `src/app/page.tsx` — updated (redirect to /catalog)
- `src/app/providers.tsx` — created (QueryClientProvider, Toaster, ReactQueryDevtools)
- `src/app/not-found.tsx` — created (404 page)
- `src/app/error.tsx` — created (global error boundary)
- `src/app/catalog/page.tsx` — created (catalog stub)
- `src/components/layout/Header.tsx` — created (desktop navigation)
- `src/components/layout/BottomNav.tsx` — created (mobile bottom navigation)
- `src/components/layout/PageContainer.tsx` — created (max-width container)
- `src/components/ui/*.tsx` — created by shadcn CLI (14 components)
- `src/lib/utils.ts` — created by shadcn CLI (cn utility)
- `.env.example` — created
- `.env.local` — created
- `.gitignore` — updated (added !.env.example)
- `.husky/pre-commit` — created (lint-staged hook)
- `components.json` — created by shadcn CLI
- `public/mockServiceWorker.js` — created by MSW CLI
