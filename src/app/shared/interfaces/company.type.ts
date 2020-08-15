export interface Company {
    id?: string;
    name?: string,
    email?: string,
    lang?: string,
    phone?: string
    slug?: string,
    bio?: string
    presentation?: string,
    color_code?: string
    logo?: {
        url: string,
        alt: string
    },
    cover?: {
        url: string,
        alt: string
    },
    created_at: string,
    updated_at: string;
    type?: string;
}