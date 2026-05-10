# Deferred Work

## Deferred from: code review of 1-1-inicializaciya-proekta-i-dizajn-sistema (2026-05-10)

- ReactQueryDevtools в production-бандле — оптимизация бандла, использовать dynamic import
- MSW инициализация отсутствует — будущие стори добавят browser.ts и handler'ы
- Отсутствует public/images/placeholder.webp — не блокирует разработку
- tsc --noEmit через bash -c в lint-staged — работает но неэффективно, рассмотреть tsc-files
- NEXT_PUBLIC_MSW_ENABLED потенциальная утечка в прод — привязано к MSW init, добавить guard при реализации
