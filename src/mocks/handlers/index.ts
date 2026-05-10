import { itemsHandlers } from './items';
import { categoriesHandlers } from './categories';

export const handlers = [...itemsHandlers, ...categoriesHandlers];
