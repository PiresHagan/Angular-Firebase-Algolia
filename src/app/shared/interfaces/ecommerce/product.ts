import { ProductCategory } from './category';
import { ImageItem, ItemLog } from './common';

export type ProductStatusTypes = 'published';

export interface ProductVariant {
  type: string; // Example, color, size etc
  values: string[]; // Example, green, XL etc
  sku: string;
  quantity: number;
}

export interface ProductStoreInfo {
  uid: string;
  storeId: string;
  storeName: string;
}

export interface ProductStats {
  view_count: number;
  purchase_count: number;
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
  categories: ProductCategory[];
  storeInfo: ProductStoreInfo;
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
