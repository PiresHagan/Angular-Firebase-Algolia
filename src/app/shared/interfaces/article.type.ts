export interface Article {
    uid?: string;
    id?: string;
    title?: string;
    slug?: string;
    category?: string;
    authorObj?: any;
    categoryObj?: any;
    featured_imageObj?: any;
    author?: string;
    content?: string;
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
    tags?: any;
    status?: any;
}