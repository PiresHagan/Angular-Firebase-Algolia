import { ItemLog } from './common';

export interface ProductReview {
  id: string;
  title: string;
  remark: string;
  rating: number; // number of stars out of 5
  log: ItemLog;
}
