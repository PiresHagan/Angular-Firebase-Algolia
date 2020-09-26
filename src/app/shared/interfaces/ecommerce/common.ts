export interface ItemLog {
  creationDate: Date;
  lastUpdated: Date;
  createdBy: string;
  lastUpdatedBy?: string;
}

export interface ImageItem {
  url?: string,
  alt?: string,
  cloudinary_id: string;
}