import { ImageItem, ItemLog } from './common';

export enum StoreStatusTypes {
  PENDING = 1,
  SUBMITTED,
  APPROVED,
  DECLINED,
  SUSPENDED,
}

export interface Store {
  id: string;
  name: string;
  ownerId: string;
  ownerType: string;
  image: ImageItem;
  status: StoreStatusTypes;
  description: string;
  log: ItemLog;
}
