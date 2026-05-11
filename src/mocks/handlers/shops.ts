import { http, HttpResponse } from 'msw';
import type { Shop } from '@/types/shop';
import shopsData from '../data/shops.json';

const shops = shopsData as Shop[];

export const shopsHandlers = [
  http.get('/api/shops', () => {
    return HttpResponse.json({ data: shops });
  }),

  http.get('/api/shops/:id', ({ params }) => {
    const shop = shops.find((s) => s.id === params.id);

    if (!shop) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Ломбард не найден' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: shop });
  }),
];
