import { ArticleMeta } from "./article-meta.type";
import { ArticleImage } from "./article-image.type";

export interface Article {
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
    meta?: ArticleMeta;
    image?: ArticleImage;
    view_count?: number;
    status?: any;
    likes_count?: number;
    comments_count?: number;
    published_on?: string;
    created_at?: string;
    published_at?: string;
    type?: string;
    article_file?: {
        url: string,
        name: string,
        cloudinary_id: string
    }
}