export interface Article {
    id?: string;
    title?: string;
    slug?: string;
    category?: string;
    author?: string;
    content?:string;
    excerpt?: string;
    topics?: string;
    language?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    originalId?: number;
    photo?: object;
    created_at?: string;
    updated_at?: string;
    published_at?: string;
    view_count?: number;
}