import { itemsHandlers } from './items';
import { categoriesHandlers } from './categories';
import { shopsHandlers } from './shops';

export const handlers = [...itemsHandlers, ...categoriesHandlers, ...shopsHandlers];
