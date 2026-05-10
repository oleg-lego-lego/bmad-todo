import { http, HttpResponse } from 'msw';
import type { Item } from '@/types/item';
import itemsData from '../data/items.json';

const items = itemsData as Item[];

export const itemsHandlers = [
  http.get('/api/items', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 12;
    const category = url.searchParams.get('category');
    const priceMin = url.searchParams.get('priceMin');
    const priceMax = url.searchParams.get('priceMax');
    const condition = url.searchParams.get('condition');
    const sort = url.searchParams.get('sort');
    const search = url.searchParams.get('search');

    let filtered = [...items];

    if (category) {
      filtered = filtered.filter((item) => item.categoryId === category);
    }

    if (priceMin) {
      filtered = filtered.filter((item) => item.price >= Number(priceMin));
    }

    if (priceMax) {
      filtered = filtered.filter((item) => item.price <= Number(priceMax));
    }

    if (condition) {
      filtered = filtered.filter((item) => item.condition >= Number(condition));
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }

    if (sort) {
      switch (sort) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'date':
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'trust_rating':
          filtered.sort((a, b) => b.trustRating - a.trustRating);
          break;
      }
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json({
      data: paginated,
      meta: { page, totalPages, total, limit },
    });
  }),

  http.get('/api/items/:id', ({ params }) => {
    const item = items.find((i) => i.id === params.id);

    if (!item) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Товар не найден' } },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: item });
  }),
];
