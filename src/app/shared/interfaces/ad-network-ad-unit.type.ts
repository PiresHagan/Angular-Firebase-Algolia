export interface AdUnit {
    id?: string;
    title?: string;
    description?: string;
    size?: string;
    code?: string;
    site_url?: string;
    created_at?: string;
    status?: {
        title: string;
        color: string;
    };
}