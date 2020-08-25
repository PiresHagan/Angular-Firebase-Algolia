export interface Category {
    uid?: string;
    id?: string;
    color_class?: string;
    constant_contact?: string;
    importedAt?: string;
    language?: string;
    level?: number;
    lft?: number;
    long_title?: string;
    old_slug?: string;
    parent?: number;
    rght?: number;
    slug?: string;
    title?: string;
    tree_id?: number;
    lf_list_id?: string;
    lf_allsubs_id?: string;
    lf_allmem_id?: string;
    meta?: {
        title: string,
        url: string,
        keywords: string,
        description: string,
        type: string,
        image: {
            url: string,
            alt: string
        }
    }
}
