import { ItemLog } from './common';

export enum StoreStatusTypes {
  PENDING = 1,
  SUBMITTED,
  APPROVED,
  DECLINED,
  SUSPENDED,
}

export interface StoreOwner {
  id: string;
}

export interface Store {
  id: string;
  name: string;
  owner: StoreOwner;
  status: StoreStatusTypes;
  log: ItemLog;
}
