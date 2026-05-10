export interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  filterOptions: FilterOption[];
}
