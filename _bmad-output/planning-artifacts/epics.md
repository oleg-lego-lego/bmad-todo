---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-design-specification.md"
---

# PawnMarket - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for PawnMarket, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Покупатель может просматривать каталог товаров с пагинацией
FR2: Покупатель может искать товары по текстовому запросу
FR3: Покупатель может фильтровать товары по категории (ювелирные изделия, техника, часы)
FR4: Покупатель может фильтровать товары по цене (диапазон)
FR5: Покупатель может фильтровать товары по состоянию (оценка ломбарда)
FR6: Покупатель может сортировать результаты (по цене, дате, рейтингу прозрачности)
FR7: Покупатель может просматривать карточку товара: название, описание, цена, фото, категория
FR8: Покупатель может видеть рейтинг прозрачности товара (0–100) с визуальным индикатором
FR9: Покупатель может видеть оценку состояния товара (шкала ломбарда)
FR10: Покупатель может видеть информацию о ломбарде-продавце (название, адрес самовывоза)
FR11: Покупатель может видеть таймлайн жизни товара (оценка ломбардом, выставление на продажу)
FR12: Покупатель может просматривать фотогалерею товара (несколько ракурсов)
FR13: Покупатель может добавлять товары в корзину
FR14: Покупатель может удалять товары из корзины
FR15: Покупатель может выбрать способ получения: доставка или самовывоз
FR16: Покупатель может заполнить контактные данные для заказа
FR17: Покупатель может подтвердить заказ и получить подтверждение
FR18: Покупатель может просматривать статус своих заказов
FR19: Покупатель может зарегистрироваться (email, пароль)
FR20: Покупатель может войти в аккаунт
FR21: Ломбард может зарегистрироваться (название, адрес, контакты, ИНН)
FR22: Ломбард может войти в аккаунт
FR23: Ломбард может добавлять товары (категория, название, описание, цена, состояние, фото)
FR24: Ломбард может редактировать свои товары
FR25: Ломбард может удалять/скрывать свои товары
FR26: Ломбард может просматривать список своих товаров со статусами
FR27: Ломбард может просматривать поступившие заказы
FR28: Ломбард может менять статус заказа (принят, готов к выдаче, завершён)
FR29: Админ может просматривать список зарегистрированных ломбардов
FR30: Админ может подтверждать/отклонять регистрацию ломбардов
FR31: Админ может модерировать товары (одобрить, отклонить)
FR32: Админ может просматривать базовую аналитику (ломбарды, товары, заказы)
FR33: Админ может управлять справочниками (категории, параметры фильтров)
FR34: Каталог и карточки товаров доступны без регистрации
FR35: Сайт корректно работает на мобильных, планшетах и десктопе

### NonFunctional Requirements

NFR1: Страницы каталога загружаются за ≤ 2 сек при SSR
NFR2: Переходы внутри SPA (кабинет, корзина) — ≤ 500 мс
NFR3: Результаты поиска и фильтрации — ≤ 1 сек
NFR4: Фото товаров — Next.js Image Optimization, lazy loading вне viewport
NFR5: Lighthouse Performance Score ≥ 90 на страницах каталога
NFR6: Bundle size главной страницы ≤ 200 KB (gzipped)
NFR7: Пароли хранятся в хэшированном виде (bcrypt)
NFR8: Формы защищены от XSS (Next.js + санитизация ввода)
NFR9: Авторизация через JWT или session tokens (подготовлено для реального API)
NFR10: Роли разделены: покупатель, ломбард, админ — доступ только к своему функционалу
NFR11: Моковые данные не содержат реальных персональных данных
NFR12: WCAG 2.1 Level A
NFR13: Семантическая HTML-разметка
NFR14: Клавиатурная навигация для всех интерактивных элементов
NFR15: Alt-тексты для всех изображений
NFR16: Контрастность текста ≥ 4.5:1 (WCAG AA)
NFR17: ARIA-атрибуты для кастомных компонентов, корректная работа с экранными читалками

### Additional Requirements

- Starter template: `create-next-app` с TypeScript, Tailwind, ESLint, App Router, src-dir, pnpm — первая implementation story
- shadcn/ui для UI-компонентов (Button, Input, Card, Badge, Dialog, Sheet, Table, Avatar, Tabs, Separator, Skeleton, Toast, Select, Progress)
- TanStack React Query v5 для управления данными (кэширование: каталог 5min, карточка 10min, корзина 0)
- MSW v2 для мокирования API с REST-like структурой (12+ эндпоинтов)
- React Hook Form + Zod для форм и валидации (отдельная схема на шаг wizard, финальная — объединённая)
- Mocked Auth Context с 3 ролями (buyer, pawnshop, admin) и UI-переключателем для разработки
- RBAC через Next.js middleware + `<RoleGuard>` компонент для условного рендеринга
- Error boundaries на уровне layout + кастомный `AppError` класс (network, notFound, validation, unauthorized)
- Строгое разделение слоёв: components → hooks → api → MSW handlers → JSON data
- React Query key factory pattern для всех сущностей (items, orders, shops, categories)
- Vercel для деплоя: автодеплой при push в main, preview при PR
- SEO: SSR для каталога + sitemap.ts + robots.ts + JSON-LD (schema.org/Product) на карточке товара
- Mobile-first responsive: 375px → 768px → 1280px+
- `next/image` с sizes, lazy loading, placeholder blur, WebP/AVIF автоматически
- lucide-react для иконок
- husky + lint-staged для pre-commit hooks (ESLint, TypeScript check)
- API response format: успех `{ data: T, meta?: { page, totalPages, total } }`, ошибка `{ error: { code, message, details? } }`
- Immutable state updates только
- Порядок импортов: React/Next → сторонние → внутренние @/ → типы
- Запрещено: `any`, прямой fetch из компонентов, inline стили, barrel exports, console.log, @ts-ignore

### UX Design Requirements

UX-DR1: Реализовать дизайн-систему Tailwind CSS + shadcn/ui с кастомными дизайн-токенами: primary #1E40AF, primary-hover #1D4ED8, primary-light #EFF6FF, background #FFFFFF, surface #F8FAFC, text-primary #1E293B, text-secondary #64748B, border #E2E8F0
UX-DR2: Цвета доверия: ≥80 — зелёный #22C55E на фоне #F0FDF4, 50–79 — жёлтый #EAB308 на фоне #FEFCE8, <50 — красный #EF4444 на фоне #FEF2F2
UX-DR3: Типографика: Inter (Google Fonts), H1 24m/32d Bold, H2 20m/24d Semibold, H3 18 Semibold, Body 14m/16d Regular, Caption 12 Regular, Price 20 Bold, line-height 1.5 body / 1.2 заголовки
UX-DR4: Spacing unit 4px, шкала 4-64, Grid 4/8/12 col (mobile/tablet/desktop), max-width 1280px, каталог 2/3/4 col
UX-DR5: Создать TrustBadge — бейдж рейтинга прозрачности 0–100, состояния high (≥80, зелёный), medium (50–79, жёлтый), low (<50, красный), варианты compact (каталог) и full (карточка), aria-label="Рейтинг прозрачности: X из 100"
UX-DR6: Создать ItemTimeline — горизонтальная лента событий товара, состояния completed (зелёный), current (синий), future (серый), role="list" / role="listitem"
UX-DR7: Создать ProductCard — карточка в каталоге: фото + TrustBadge (наложение правый верхний) + цена + название + состояние + ломбард, состояния default, hover, loading (skeleton)
UX-DR8: Создать ProductGallery — swiper-галерея фото: основной слайдер + миниатюры (desktop), свайп (mobile), role="region" aria-label="Галерея фото"
UX-DR9: Создать WizardForm — пошаговая форма добавления товара: прогресс-бар + контент + «Назад» / «Далее», 4 шага (Категория → Фото до 5 → Название+описание → Цена+состояние) → Предпросмотр → Опубликовать
UX-DR10: Создать OrderStatusFlow — прогресс заказа: Создан → Принят → Готов → Завершён
UX-DR11: Создать RoleGuard — компонент условного рендеринга по роли пользователя
UX-DR12: Создать RoleSwitcher — Dev-переключатель ролей для разработки
UX-DR13: Навигация покупатель mobile: нижняя — Главная / Каталог / Корзина / Профиль
UX-DR14: Навигация покупатель desktop: верхняя — Лого / Каталог / Корзина / Войти
UX-DR15: Навигация ломбард: боковая — Товары / Заказы / Профиль
UX-DR16: Иерархия кнопок: Primary (primary bg, белый текст), Secondary (border primary), Destructive (bg red), Ghost (transparent). Одна Primary на экран, touch target min 44x44px mobile
UX-DR17: Обратная связь: успех — зелёный toast 3 сек, ошибка валидации — красный текст + подсветка border, ошибка сервера — красный toast + «Повторить», загрузка данных — skeleton, загрузка действия — спиннер на кнопке disabled
UX-DR18: Формы: валидация при onBlur, ошибка — красный border + текст под полем, обязательные поля — знак * у label, фото — drag & drop + кнопка
UX-DR19: Responsive breakpoints: Mobile 375-767 (2 col, нижняя навигация, Sheet снизу для фильтров), Tablet 768-1023 (3 col, верхняя навигация, Sheet справа), Desktop 1024+ (4 col + боковые фильтры, верхняя навигация, боковая панель фильтров)
UX-DR20: WCAG 2.1 AA: контраст ≥ 4.5:1 текст, ≥ 3:1 крупный, focus-visible 2px outline primary, Tab/Enter/Escape для всех интерактивных, семантический HTML + ARIA, touch targets min 44x44px, масштабирование до 200%
UX-DR21: Пустые состояния: текст + иллюстрация + CTA
UX-DR22: Подтверждения: Dialog перед удалением/оформлением заказа
UX-DR23: Skeleton-загрузка: минимум 3 карточки при загрузке каталога
UX-DR24: Mobile-first стили по умолчанию, `md:` / `lg:` для расширения, rem для шрифтов, `next/image` с `sizes`, `prefers-reduced-motion` — отключить анимации
UX-DR25: Карточка товара в каталоге — mobile: фото сверху → бейдж рейтинга правый верхний угол → цена крупно → название → состояние и ломбард; desktop: фото слева, контент справа
UX-DR26: Полная карточка товара — первый экран без скролла: фото-галерея (swiper), бейдж рейтинга на фото, цена крупная, название, состояние, кнопка «Добавить в корзину» фиксированная внизу; скролл вниз: таймлайн жизни, описание, информация о ломбарде, все фото
UX-DR27: Хлебные крошки на всех внутренних страницах
UX-DR28: Checkout: от корзины до подтверждения — 4 клика, минимум полей: имя, телефон, способ получения
UX-DR29: Lighthouse Accessibility ≥ 90, axe DevTools скан, Tab-навигация вручную, VoiceOver / TalkBack базовая проверка

### FR Coverage Map

FR1: Epic 1 — Просмотр каталога с пагинацией
FR2: Epic 1 — Поиск товаров по текстовому запросу
FR3: Epic 1 — Фильтрация по категории
FR4: Epic 1 — Фильтрация по цене
FR5: Epic 1 — Фильтрация по состоянию
FR6: Epic 1 — Сортировка результатов
FR7: Epic 1 — Карточка товара (название, описание, цена, фото, категория)
FR8: Epic 1 — Рейтинг прозрачности с визуальным индикатором
FR9: Epic 1 — Оценка состояния товара
FR10: Epic 1 — Информация о ломбарде-продавце
FR11: Epic 1 — Таймлайн жизни товара
FR12: Epic 1 — Фотогалерея товара
FR13: Epic 3 — Добавление товаров в корзину
FR14: Epic 3 — Удаление товаров из корзины
FR15: Epic 3 — Выбор способа получения
FR16: Epic 3 — Контактные данные для заказа
FR17: Epic 3 — Подтверждение заказа
FR18: Epic 3 — Просмотр статуса заказов
FR19: Epic 2 — Регистрация покупателя
FR20: Epic 2 — Вход в аккаунт покупателя
FR21: Epic 2 — Регистрация ломбарда
FR22: Epic 2 — Вход в аккаунт ломбарда
FR23: Epic 4 — Добавление товаров ломбардом
FR24: Epic 4 — Редактирование товаров ломбардом
FR25: Epic 4 — Удаление/скрытие товаров ломбардом
FR26: Epic 4 — Просмотр списка товаров ломбарда
FR27: Epic 4 — Просмотр заказов ломбардом
FR28: Epic 4 — Управление статусом заказа ломбардом
FR29: Epic 5 — Просмотр списка ломбардов (админ)
FR30: Epic 5 — Подтверждение/отклонение регистрации ломбардов
FR31: Epic 5 — Модерация товаров (админ)
FR32: Epic 5 — Базовая аналитика (админ)
FR33: Epic 5 — Управление справочниками (админ)
FR34: Epic 1 — Каталог доступен без регистрации
FR35: Epic 1 — Responsive: мобильные, планшеты, десктоп

## Epic List

### Epic 1: Покупатель просматривает каталог и товары
Покупатель заходит на сайт, видит каталог товаров, ищет и фильтрует, открывает карточку с «биографией вещи» — рейтинг прозрачности, таймлайн, фото-галерея. Включает foundation: инициализация проекта, дизайн-система, моковые данные.
**FRs covered:** FR1–FR12, FR34, FR35

### Epic 2: Регистрация и аутентификация
Покупатели и ломбарды могут создавать аккаунты и входить в систему. Mocked Auth Context с 3 ролями, RBAC middleware.
**FRs covered:** FR19–FR22

### Epic 3: Покупка — корзина и оформление заказа
Покупатель добавляет товары в корзину, выбирает доставку/самовывоз, заполняет контакты, подтверждает заказ, видит статус.
**FRs covered:** FR13–FR18

### Epic 4: Кабинет ломбарда
Ломбард добавляет товары через wizard, управляет своими товарами, просматривает и обрабатывает заказы.
**FRs covered:** FR23–FR28

### Epic 5: Панель администратора
Админ модерирует ломбарды и товары, просматривает аналитику, управляет справочниками.
**FRs covered:** FR29–FR33

## Epic 1: Покупатель просматривает каталог и товары

Покупатель заходит на сайт, видит каталог товаров, ищет и фильтрует, открывает карточку с «биографией вещи» — рейтинг прозрачности, таймлайн, фото-галерея. Включает foundation: инициализация проекта, дизайн-система, моковые данные.

### Story 1.1: Инициализация проекта и дизайн-система

As a разработчик,
I want иметь инициализированный проект с дизайн-системой и layout,
So that все последующие истории строятся на готовом фундаменте.

**Acceptance Criteria:**

**Given** команда `create-next-app` выполнена с TypeScript, Tailwind, ESLint, App Router, src-dir, pnpm
**When** разработчик открывает проект
**Then** установлены все зависимости: React Query v5, MSW v2, React Hook Form, Zod, lucide-react, CVA, clsx, tailwind-merge
**And** shadcn/ui инициализирован с компонентами: Button, Input, Card, Badge, Dialog, Sheet, Table, Avatar, Tabs, Separator, Skeleton, Toast, Select, Progress
**And** globals.css содержит дизайн-токены: primary #1E40AF, trust colors (#22C55E/#EAB308/#EF4444), типографика Inter, spacing unit 4px
**And** иерархия кнопок: Primary/Secondary/Destructive/Ghost (UX-DR16)
**And** root layout: QueryClientProvider + Toaster placeholder
**And** public layout: Header (desktop — Лого/Каталог/Корзина/Войти) + BottomNav (mobile — Главная/Каталог/Корзина/Профиль)
**And** PageContainer с max-width 1280px, центрировано
**And** `/` редиректит на `/catalog`
**And** error.tsx — global error boundary
**And** not-found.tsx — 404 страница
**And** husky + lint-staged настроены: pre-commit hook запускает ESLint и TypeScript check

### Story 1.2: Моковые данные и API-слой для товаров

As a разработчик,
I want иметь API-слой с моковыми данными,
So that компоненты получают данные через React Query hooks прозрачно.

**Acceptance Criteria:**

**Given** MSW v2 service worker инициализирован
**When** компонент вызывает `useItems` hook
**Then** возвращаются товары из items.json (50+ товаров, 5+ ломбардов, 3 категории)
**And** api/client.ts — fetch-обёртка с AppError (network, notFound, validation, unauthorized)
**And** api/items.ts: getItems (фильтры, пагинация), getItemById
**And** api/categories.ts: getCategories
**And** hooks/use-items.ts: useItems (с фильтрами + пагинацией), useItem (по id)
**And** hooks/use-categories.ts: useCategories
**And** React Query key factory для items и categories
**And** API response format: `{ data, meta: { page, totalPages, total } }`
**And** кэширование: каталог staleTime 5min, карточка 10min

### Story 1.3: TrustBadge и ProductCard

As a покупатель,
I want видеть карточку товара в каталоге с рейтингом прозрачности,
So that могу с первого взгляда оценить доверие к товару.

**Acceptance Criteria:**

**Given** API-слой отдаёт данные о товарах
**When** отображается список товаров
**Then** каждый товар показывает ProductCard: фото, TrustBadge (compact), цена, название, состояние, ломбард
**And** TrustBadge: ≥80 зелёный (#22C55E/#F0FDF4), 50-79 жёлтый (#EAB308/#FEFCE8), <50 красный (#EF4444/#FEF2F2)
**And** TrustBadge aria-label="Рейтинг прозрачности: X из 100"
**And** TrustBadge наложен на фото в правом верхнем углу
**And** ProductCard: default, hover, loading (skeleton)
**And** mobile: фото сверху → бейдж → цена → название → состояние и ломбард
**And** desktop: фото слева, контент справа
**And** `next/image` с sizes, lazy loading
**And** touch targets min 44x44px

### Story 1.4: Страница каталога — поиск, фильтры, сортировка

As a покупатель,
I want искать, фильтровать и сортировать товары в каталоге,
So that могу быстро найти нужный товар.

**Acceptance Criteria:**

**Given** покупатель открывает `/catalog`
**When** страница загружена
**Then** видит сетку товаров: 2 col mobile (375-767), 3 col tablet (768-1023), 4 col desktop (1024+)
**And** Skeleton минимум 3 карточки при загрузке
**And** пустое состояние: текст + CTA при отсутствии результатов

**When** вводит текстовый запрос
**Then** результаты фильтруются по названию/описанию (FR2)

**When** применяет фильтры: категория, цена (диапазон), состояние
**Then** результаты обновляются (FR3-FR5)
**And** фильтры: боковая панель на desktop, Sheet снизу на mobile

**When** выбирает сортировку: по цене, дате, рейтингу прозрачности
**Then** результаты сортируются (FR6)

**When** скроллит вниз
**Then** подгружается следующая страница (FR1)

**And** хлебные крошки на странице
**And** CatalogGrid, SearchBar, FilterSidebar, FilterSheet, SortSelect реализованы
**And** URL-параметры синхронизированы с фильтрами (useFilters hook)

### Story 1.5: Карточка товара — «Биография вещи»

As a покупатель,
I want видеть полную информацию о товаре с биографией,
So that могу принять обоснованное решение о покупке.

**Acceptance Criteria:**

**Given** покупатель кликает на товар из каталога
**When** открывается `/item/[id]`
**Then** первый экран без скролла: ProductGallery (swiper), TrustBadge (full), цена, название, состояние, кнопка «В корзину» (UI, без функционала до Epic 3)

**When** скроллит вниз
**Then** видит: ItemTimeline (таймлайн жизни), описание, ломбард (название, адрес самовывоза), все фото

**And** ProductGallery: основной слайдер + миниатюры desktop, свайп mobile, `role="region"` `aria-label="Галерея фото"`
**And** ItemTimeline: горизонтальная лента, completed (зелёный)/current (синий)/future (серый), `role="list"`/`role="listitem"`
**And** TrustBadge full variant с полной информацией
**And** SSR: страница рендерится серверно (SEO)
**And** meta tags: title, description, og:image
**And** JSON-LD (schema.org/Product)
**And** loading.tsx — skeleton при навигации
**And** хлебные крошки
**And** кнопка «В корзину» фиксирована внизу экрана

## Epic 2: Регистрация и аутентификация

Покупатели и ломбарды могут создавать аккаунты и входить в систему. Mocked Auth Context с 3 ролями, RBAC middleware.

### Story 2.1: Auth Context и RBAC

As a разработчик,
I want иметь auth-контекст с 3 ролями и RBAC middleware,
So that пользователи разделены по зонам доступа.

**Acceptance Criteria:**

**Given** приложение загружено
**When** проверяется аутентификация
**Then** AuthContext предоставляет: currentUser, isAuthenticated, role (buyer/pawnshop/admin)
**And** 3 предустановленных пользователя в users.json: buyer, pawnshop, admin
**And** RoleGuard компонент: рендерит детей только если роль совпадает, иначе редирект
**And** RoleSwitcher (dev): UI-переключатель ролей для разработки
**And** Next.js middleware: публичные `/`, `/catalog`, `/item/:id` — без ограничений; buyer `/cart`, `/profile`, `/orders`; pawnshop `/cabinet/*`; admin `/admin/*`
**And** MSW auth handlers: POST /api/auth/login, POST /api/auth/register, GET /api/auth/me
**And** hooks/use-auth.ts: useAuth, useLogin, useLogout, useRegister
**And** api/auth.ts: login, register, logout, getCurrentUser
**And** schemas/auth-schema.ts: loginSchema

### Story 2.2: Страница входа

As a пользователь (покупатель или ломбард),
I want войти в аккаунт по email и паролю,
So that получаю доступ к своему функционалу.

**Acceptance Criteria:**

**Given** пользователь открывает `/login`
**When** заполняет email и пароль и нажимает «Войти»
**Then** MSW handler возвращает пользователя с ролью
**And** редирект: buyer → `/catalog`, pawnshop → `/cabinet`, admin → `/admin`
**When** вводит неверные данные
**Then** красный toast «Неверный email или пароль» + кнопка «Повторить»
**When** уже авторизован
**Then** редирект на страницу по роли
**And** форма валидируется Zod (loginSchema) при onBlur
**And** ссылка «Зарегистрироваться» → `/register`
**And** auth layout: минимальный, без Header/BottomNav

### Story 2.3: Регистрация покупателя

As a покупатель,
I want зарегистрироваться по email и паролю,
So that могу оформлять заказы и управлять профилем.

**Acceptance Criteria:**

**Given** пользователь открывает `/register` (tab «Покупатель»)
**When** заполняет email, пароль, подтверждение пароля
**Then** MSW handler создаёт пользователя с ролью buyer
**And** автоматический вход после регистрации
**And** редирект на `/catalog`
**When** вводит некорректные данные
**Then** валидация Zod: email формат, пароль min 8 символов, пароли совпадают
**And** ошибки показываются красным текстом под полями
**And** ссылка «Уже есть аккаунт?» → `/login`

### Story 2.4: Регистрация ломбарда

As a ломбард,
I want зарегистрироваться с данными организации,
So that могу добавлять товары и управлять заказами.

**Acceptance Criteria:**

**Given** пользователь открывает `/register` (tab «Ломбард»)
**When** заполняет: название, адрес, контакты, ИНН, email, пароль, подтверждение пароля
**Then** MSW handler создаёт пользователя с ролью pawnshop
**And** автоматический вход после регистрации
**And** редирект на `/cabinet`
**When** вводит некорректные данные
**Then** валидация Zod: ИНН формат, все обязательные поля заполнены
**And** Tabs на странице: «Покупатель» / «Ломбард» (shadcn/ui Tabs)
**And** обязательные поля отмечены `*` у label

## Epic 3: Покупка — корзина и оформление заказа

Покупатель добавляет товары в корзину, выбирает доставку/самовывоз, заполняет контакты, подтверждает заказ, видит статус.

### Story 3.1: Корзина — добавление и просмотр

As a покупатель,
I want добавлять товары в корзину и просматривать их,
So that могу собрать заказ перед оформлением.

**Acceptance Criteria:**

**Given** покупатель на странице товара авторизован
**When** нажимает «В корзину»
**Then** товар добавляется в корзину (localStorage + React Query)
**And** кнопка меняет состояние на «В корзине» (disabled)
**And** зелёный toast «Товар добавлен» 3 сек

**Given** покупатель открывает `/cart`
**When** в корзине есть товары
**Then** видит список CartItem: фото, название, цена, ломбард
**And** CartSummary: общая сумма, кнопка «Оформить»
**When** корзина пуста
**Then** пустое состояние: текст + CTA «Перейти в каталог»

**And** useCart hook: React Query + localStorage, staleTime: 0, optimistic updates
**And** MSW handlers: GET/POST/DELETE /api/cart
**And** корзина доступна только авторизованным (RoleGuard buyer)

### Story 3.2: Корзина — удаление и очистка

As a покупатель,
I want удалять товары из корзины,
So that могу скорректировать заказ.

**Acceptance Criteria:**

**Given** в корзине есть товары
**When** нажимает «Удалить» на товаре
**Then** появляется Dialog подтверждения «Удалить товар из корзины?»
**When** подтверждает
**Then** товар удаляется, пересчитывается сумма
**And** зелёный toast «Товар удалён»
**When** нажимает «Очистить корзину»
**Then** Dialog подтверждения «Очистить всю корзину?»
**When** подтверждает
**Then** корзина пуста, показывается пустое состояние

### Story 3.3: Оформление заказа — контакты и доставка

As a покупатель,
I want выбрать способ получения и заполнить контакты,
So that заказ будет доставлен удобным способом.

**Acceptance Criteria:**

**Given** покупатель на `/checkout` с товарами в корзине
**When** выбирает способ получения
**Then** доступны: «Доставка курьером» и «Самовывоз из ломбарда»
**When** выбирает «Самовывоз»
**Then** показывается адрес ломбарда-продавца
**When** заполняет: имя, телефон
**Then** валидация Zod при onBlur (checkoutSchema)
**And** обязательные поля отмечены `*`
**When** данные некорректны
**Then** красный border + текст ошибки под полем

**And** checkout-поток: от корзины до подтверждения — 4 клика (UX-DR28)
**And** минимум полей: имя, телефон, способ получения

### Story 3.4: Подтверждение заказа

As a покупатель,
I want подтвердить заказ и получить подтверждение,
So that знаю, что заказ принят.

**Acceptance Criteria:**

**Given** контакты и способ получения заполнены корректно
**When** нажимает «Подтвердить заказ»
**Then** Dialog подтверждения с обзором: товары, сумма, способ получения, контакты
**When** подтверждает
**Then** MSW POST /api/orders создаёт заказ
**And** корзина очищается
**And** зелёный toast «Заказ оформлен!»
**And** редирект на страницу заказа `/orders/{id}`
**When** ошибка сервера
**Then** красный toast + «Повторить»

**And** MSW handlers: POST /api/orders, GET /api/orders, GET /api/orders/:id
**And** hooks/use-orders.ts: useOrders, useOrder, useCreateOrder
**And** api/orders.ts: getOrders, getOrderById, createOrder
**And** schemas/order-schema.ts: createOrderSchema

### Story 3.5: Мои заказы и статус

As a покупатель,
I want просматривать свои заказы и их статусы,
So that отслеживаю выполнение.

**Acceptance Criteria:**

**Given** покупатель открывает `/orders`
**When** есть заказы
**Then** видит список: номер, дата, сумма, статус, способ получения
**When** открывает `/orders/{id}`
**Then** видит детали: товары, контакты, способ получения, статус
**And** OrderStatusFlow: Создан → Принят → Готов → Завершён
**When** заказов нет
**Then** пустое состояние: текст + CTA «Перейти в каталог»

**And** OrderStatusFlow: прогресс-бар с шагами, текущий шаг подсвечен

## Epic 4: Кабинет ломбарда

Ломбард добавляет товары через wizard, управляет своими товарами, просматривает и обрабатывает заказы.

### Story 4.1: Layout кабинета ломбарда

As a ломбард,
I want видеть навигацию по кабинету и дашборд,
So that могу быстро переходить к управлению товарами и заказами.

**Acceptance Criteria:**

**Given** ломбард авторизован и открывает `/cabinet`
**When** страница загружена
**Then** видит Sidebar: Товары / Заказы / Профиль
**And** Sidebar навигация: боковая — desktop, скрытая с hamburger на mobile
**And** pawnshop layout: Sidebar + RoleGuard(pawnshop)
**And** Dashboard: общее количество товаров, активных заказов, новые заказы
**And** MSW handlers: GET /api/shops/:id (профиль ломбарда)
**And** hooks/use-shops.ts: useShop (данные текущего ломбарда)

### Story 4.2: Wizard добавления товара

As a ломбард,
I want добавить товар через пошаговый wizard,
So that первый товар добавлен за 5 минут.

**Acceptance Criteria:**

**Given** ломбард открывает `/cabinet/add-item`
**When** проходит wizard
**Then** 4 шага: Категория → Фото (до 5, drag & drop + кнопка) → Название+описание → Цена+состояние
**And** прогресс-бар показывает текущий шаг
**And** кнопки «Назад» / «Далее» на каждом шаге
**When** шаг заполнен некорректно
**Then** пустые поля подсвечены, «Далее» disabled
**When** все шаги пройдены
**Then** предпросмотр товара
**When** нажимает «Опубликовать»
**Then** MSW POST /api/items создаёт товар
**And** зелёный toast «Товар опубликован»
**And** редирект на список товаров

**And** WizardForm: React Hook Form + Zod (отдельная схема на шаг, финальная объединённая)
**And** schemas/item-schema.ts: createItemSchema, updateItemSchema
**And** hooks/use-items.ts дополняется: useCreateItem, useUpdateItem
**And** api/items.ts дополняется: createItem

### Story 4.3: Управление товарами ломбарда

As a ломбард,
I want видеть свои товары и управлять ими,
So that могу актуализировать каталог.

**Acceptance Criteria:**

**Given** ломбард открывает `/cabinet/items`
**When** есть товары
**Then** видит таблицу: название, категория, цена, статус (активен/скрыт/на модерации), дата
**When** нажимает на товар
**Then** открывается `/cabinet/items/{id}` — форма редактирования
**When** сохраняет изменения
**Then** MSW PATCH /api/items/:id обновляет товар
**And** зелёный toast «Товар обновлён»
**When** нажимает «Удалить»
**Then** Dialog подтверждения «Удалить товар?»
**When** подтверждает
**Then** товар удалён, список обновлён
**When** нажимает «Скрыть»
**Then** товар помечен как скрытый, не виден в каталоге
**When** товаров нет
**Then** пустое состояние + CTA «Добавить первый товар»

**And** api/items.ts дополняется: updateItem, deleteItem

### Story 4.4: Просмотр заказов ломбарда

As a ломбард,
I want видеть поступившие заказы,
So that могу обрабатывать их.

**Acceptance Criteria:**

**Given** ломбард открывает `/cabinet/orders`
**When** есть заказы
**Then** видит список: номер, товар, покупатель, сумма, статус, дата
**When** открывает `/cabinet/orders/{id}`
**Then** видит детали: товар, контакты покупателя, способ получения, статус
**When** заказов нет
**Then** пустое состояние: «Заказов пока нет»
**And** фильтрация по статусу (все / новые / в работе / завершённые)

### Story 4.5: Управление статусом заказа

As a ломбард,
I want менять статус заказа,
So that покупатель видит актуальную информацию.

**Acceptance Criteria:**

**Given** ломбард на странице заказа
**When** нажимает «Принять заказ»
**Then** статус меняется на «Принят»
**When** нажимает «Готов к выдаче»
**Then** статус меняется на «Готов к выдаче»
**When** нажимает «Завершить»
**Then** Dialog подтверждения «Завершить заказ?»
**When** подтверждает
**Then** статус «Завершён», зелёный toast
**When** ошибка
**Then** красный toast + «Повторить»

**And** OrderStatusFlow отображает прогресс заказа
**And** MSW PATCH /api/orders/:id обновляет статус
**And** hooks/use-orders.ts дополняется: useUpdateOrderStatus
**And** api/orders.ts дополняется: updateOrderStatus

## Epic 5: Панель администратора

Админ модерирует ломбарды и товары, просматривает аналитику, управляет справочниками.

### Story 5.1: Layout админ-панели и аналитика

As a админ,
I want видеть дашборд с метриками платформы,
So that понимаю общее состояние системы.

**Acceptance Criteria:**

**Given** админ авторизован и открывает `/admin`
**When** страница загружена
**Then** видит Sidebar: Ломбарды / Товары / Категории
**And** Sidebar навигация: боковая — desktop, hamburger на mobile
**And** admin layout: Sidebar + RoleGuard(admin)
**And** Dashboard: количество ломбардов, товаров, заказов (из моковых данных)
**And** MSW handlers: GET /api/admin/stats
**And** hooks/use-shops.ts дополняется: useShops (список всех ломбардов)

### Story 5.2: Модерация ломбардов

As a админ,
I want просматривать и модерировать ломбарды,
So that контролирую качество продавцов.

**Acceptance Criteria:**

**Given** админ открывает `/admin/shops`
**When** есть ломбарды
**Then** видит таблицу: название, ИНН, статус (ожидает/подтверждён/отклонён), дата регистрации
**When** открывает `/admin/shops/{id}`
**Then** видит детали: название, адрес, контакты, ИНН, статус, количество товаров
**When** нажимает «Подтвердить»
**Then** статус меняется на «Подтверждён», зелёный toast
**When** нажимает «Отклонить»
**Then** Dialog с полем «Причина отклонения»
**When** подтверждает
**Then** статус «Отклонён», ломбард уведомлён (mock)
**And** MSW PATCH /api/shops/:id/status
**And** фильтрация по статусу

### Story 5.3: Модерация товаров

As a админ,
I want модерировать товары перед публикацией,
So that каталог содержит только качественные объявления.

**Acceptance Criteria:**

**Given** админ открывает `/admin/items`
**When** есть товары на модерации
**Then** видит таблицу: название, ломбард, категория, цена, статус (на модерации/одобрен/отклонён)
**When** нажимает «Одобрить»
**Then** товар появляется в каталоге, зелёный toast
**When** нажимает «Отклонить»
**Then** Dialog с полем «Причина отклонения»
**When** подтверждает
**Then** статус «Отклонён», товар не виден в каталоге
**And** MSW PATCH /api/items/:id/moderate
**And** фильтрация по статусу модерации
**And** предпросмотр товара из таблицы

### Story 5.4: Управление справочниками

As a админ,
I want управлять категориями и параметрами фильтров,
So that каталог структурирован и фильтры актуальны.

**Acceptance Criteria:**

**Given** админ открывает `/admin/categories`
**When** есть категории
**Then** видит список: название, количество товаров, параметры фильтров
**When** нажимает «Добавить категорию»
**Then** форма: название, slug, параметры фильтров
**When** сохраняет
**Then** MSW POST /api/categories создаёт категорию, зелёный toast
**When** редактирует категорию
**Then** форма предзаполнена, MSW PATCH /api/categories/:id
**When** удаляет категорию
**Then** Dialog подтверждения «Удалить категорию? Товары будут без категории»
**When** подтверждает
**Then** категория удалена

**And** api/categories.ts дополняется: createCategory, updateCategory, deleteCategory
**And** hooks/use-categories.ts дополняется: useCreateCategory, useUpdateCategory, useDeleteCategory
**And** schemas/category-schema.ts: createCategorySchema, updateCategorySchema
