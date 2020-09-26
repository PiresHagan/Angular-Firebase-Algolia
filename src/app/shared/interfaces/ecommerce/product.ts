import { ProductCategory } from './category';
import { ImageItem, ItemLog } from './common';

export enum ProductStatusTypes {
  INSTOCK = 1,
  OUT_OF_STOCK,
  PENDING,
};

export interface ProductVariant {
  type: string; // Example, color, size etc
  values: string[]; // Example, green, XL etc
  sku: string;
  quantity: number;
}

export interface ProductStats {
  view_count: number;
  purchase_count: number;
  rating: number; // Example, 4.5
  review_count: number;
}

export interface ProductPrice {
  salePrice: number;
  compareAmount: number;
  unitPrice: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: ProductCategory;
  subcategories: ProductCategory[];
  storeId: string;
  storeName: string;
  description: string;
  tags: string[];
  images: ImageItem[];
  status: ProductStatusTypes;
  stats: ProductStats;
  price: ProductPrice;
  quantity: number;
  sku: string;
  variants: ProductVariant[];
  log: ItemLog;
}
