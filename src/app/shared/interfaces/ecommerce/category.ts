export interface ProductCategory {
  id: string;
  title: string;
  slug: string;
  sub_categories: ProductSubCategory[];
}

export interface ProductSubCategory {
  id: string;
  title: string;
  slug: string;
}
