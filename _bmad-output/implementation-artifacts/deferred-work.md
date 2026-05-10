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
