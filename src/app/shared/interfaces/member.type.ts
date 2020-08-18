export interface Member {
    id: string,
    fullname: string,
    slug: boolean,
    created_at?: string,
    updated_at?: string,
    lang?: string,
    avatar?: any,
    bio?: string,
    stripe_status?: string
}