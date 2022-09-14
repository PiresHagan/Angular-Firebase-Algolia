export interface Follower {
    avatar?: {
        alt: string,
        url: string,
        cloudinary_id: string,
    },
    blocked?: boolean,
    fullname: string,
    id: string,
    slug: string,
    type: string,
}