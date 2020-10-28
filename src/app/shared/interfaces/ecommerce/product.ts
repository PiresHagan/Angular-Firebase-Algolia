import { ProductCategory, ProductSubCategory } from './category';
import { ImageItem, ItemLog } from './common';

export enum ProductStatusTypes {
  INSTOCK = "instock",
  OUT_OF_STOCK = "outofstock",
  PENDING = "pending",
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

export interface Product {
  brand: string;
  id: string;
  name: string;
  slug: string;
  summary: string;
  lang: string;
  categories: ProductCategory;
  subcategories: ProductSubCategory[];
  storeId: string;
  storeName: string;
  description: string;
  tags: string[];
  images: ImageItem[];
  status: ProductStatusTypes;
  stats: ProductStats;
  discountedPrice: any;
  salePrice: any;
  quantity: string;
  sku: string;
  variants: ProductVariant[];
  log: ItemLog;
  weight?: string;
  width: number;
  height: number;
  length: number;
}
