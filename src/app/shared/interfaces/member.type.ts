export interface Member {
    id: string,
    fullname: string,
    slug: boolean,
    created_at?: string,
    updated_at?: string,
    lang?: string,
    avatar?: any,
    bio?: string,
    type: string,
    user_type?: string,
    is_guest_post_enabled?: boolean,
    // stripe_status?: string
}