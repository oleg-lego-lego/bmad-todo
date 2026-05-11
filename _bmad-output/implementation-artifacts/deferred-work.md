# Deferred Work

## Deferred from: code review of 1-1-inicializaciya-proekta-i-dizajn-sistema (2026-05-10)

- ReactQueryDevtools в production-бандле — оптимизация бандла, использовать dynamic import
- MSW инициализация отсутствует — будущие стори добавят browser.ts и handler'ы
- Отсутствует public/images/placeholder.webp — не блокирует разработку
- tsc --noEmit через bash -c в lint-staged — работает но неэффективно, рассмотреть tsc-files
- NEXT_PUBLIC_MSW_ENABLED потенциальная утечка в прод — привязано к MSW init, добавить guard при реализации

## Deferred from: code review of 1-2-mokovye-dannye-i-api-sloj-dlya-tovarov (2026-05-10)

- categoryId содержит slug вместо ID — модель данных несогласована, работает корректно, моки будут заменены реальным API
- apiFetch/apiFetchPaginated дублирование — рефактор при появлении реального API
- mswReady hydration flash — MSW dev-only, стандартный паттерн Next.js
- ThemeProvider SSR localStorage mismatch — стандартный паттерн, не влияет на UX
- MSW handlers: нет валидации page/limit/price/condition bounds — mock-only, будет заменено реальным API

## Deferred from: code review of 1-3-trustbadge-i-productcard (2026-05-11)

- MSW shops.json `as Shop[]` без валидации — наследуемый паттерн из items.ts, mock-only
- formatPrice не обрабатывает отрицательные цены — предсуществующий код, не относится к текущей story
- ProductCard imgError не сбрасывается при смене item — key={item.id} смягчает, минимальный риск

## Deferred from: code review of 1-4-stranica-kataloga-poisk-filtry-sortirovka (2026-05-11)

- No validation that priceMin <= priceMax — nice-to-have, not specified in ACs, API returns empty results for invalid range

## Deferred from: code review of 1-5-kartochka-tovara-biografiya-veshchi (2026-05-11)

- Двойной fetch в SSR (generateMetadata + page) — стандартный Next.js паттерн, дедупликация встроена
- Захардкожен `InStock` в JSON-LD — спека требует InStock, маппинг status → availability в будущих эпиках
- Отсутствует `ItemBreadcrumbs.tsx` (спека требует отдельный компонент) — работает inline, рефакторинг при необходимости
- `page.tsx` обходит hooks-слой для SSR — серверный компонент не может использовать hooks, необходимый паттерн
- `condition` отображается как `-/10` при nullish — fallback `?? '-'` разумный для граничного случая
