import { http, HttpResponse } from 'msw';
import categoriesData from '../data/categories.json';

export const categoriesHandlers = [
  http.get('/api/categories', () => {
    return HttpResponse.json({ data: categoriesData });
  }),
];
