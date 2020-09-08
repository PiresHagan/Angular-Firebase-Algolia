export interface Site {
    url?: string;
    id?: string;
    daily_traffic?: string;
    created_at?: string;
    revenue?: string;
    status?: {
        title: string;
        color: string;
    };
    publisher?: {
        id: string;
        type: string;
        name: string;
    }
}