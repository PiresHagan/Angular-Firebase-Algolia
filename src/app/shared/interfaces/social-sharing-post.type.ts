export interface Post {
    id: string,
    title?: string,
    post_text?: string,
    story_url?: string,
    image?: {
        url?: string,
        cloudinary_id?: string
        },
    scheduled_date: string,
    member_id: string,
    status: string,
    networks: Array<any>
    
}