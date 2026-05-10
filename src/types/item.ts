export type ItemStatus = 'active' | 'hidden' | 'moderation';

export interface ItemTimelineEvent {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'future';
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  condition: number;
  trustRating: number;
  shopId: string;
  images: string[];
  status: ItemStatus;
  createdAt: string;
  timeline: ItemTimelineEvent[];
}

export interface ItemFilters {
  page?: number;
  limit?: number;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: number;
  sort?: 'price_asc' | 'price_desc' | 'date' | 'trust_rating';
  search?: string;
}
