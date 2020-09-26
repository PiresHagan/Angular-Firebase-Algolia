import { ProductCategory } from './category';
import { ItemLog } from './common';

export type ProductStatusTypes = 'published';

export interface ProductVariant {
  type: string; // Example, color, size etc
  values: string[]; // Example, green, XL etc
  image: string;
}

export interface ProductSeller {
  uid: string;
}

export interface DeliveryDate {
  date: Date;
  fromTime: string;
  toTime: string;
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
  seller: ProductSeller;
  description: string;
  tags: string[];
  cardImage: string;
  galleryImages: string[];
  status: ProductStatusTypes;
  stats: ProductStats;
  price: ProductPrice;
  quantity: number;
  sku: string;
  variants: ProductVariant[];
  deliveryDates: DeliveryDate[];
  log: ItemLog;
}
