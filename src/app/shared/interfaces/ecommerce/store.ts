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
  slug: string;
  name: string;
  owner: any;
  ownerId: string;
  ownerType: string;
  image: ImageItem;
  status: StoreStatusTypes;
  description: string;
  log: ItemLog;
  phone?: number;
  email: string;




}
