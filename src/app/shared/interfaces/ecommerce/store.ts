import { ImageItem, ItemLog } from './common';

export enum StoreStatusTypes {
  PENDING = 1,
  SUBMITTED,
  APPROVED,
  DECLINED,
  SUSPENDED,
}

export interface StoreOwner {
  uid: string;
}

export interface Store {
  id: string;
  name: string;
  owner: StoreOwner;
  image: ImageItem;
  status: StoreStatusTypes;
  description: string;
  log: ItemLog;
}
