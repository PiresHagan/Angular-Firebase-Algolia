import { ServiceMeta } from "./service-meta.type";
import { ServiceImage } from "./service-image.type";

export interface Politician {
    id?: string;
    title?: string;
    slug?: string;
    summary?: string;
    category?: any;
    author?: any;
    content?: string;
    excerpt?: string;
    topics?: string;
    lang?: string;
    meta?: ServiceMeta;
    image?: ServiceImage;
    view_count?: number;
    status?: any;
    likes_count?: number;
    comments_count?: number;
    published_on?: string;
    created_at?: string;
    published_at?: string;
    type?: string;
    politician_file?: {
        url: string,
        name: string,
        cloudinary_id: string,
        others: any[]
    }
}