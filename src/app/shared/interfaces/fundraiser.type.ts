import { FundraiserMeta } from "./fundraiser-meta.type";
import { FundraiserImage } from "./fundraiser-image.type";

export interface Fundraiser {
    id?: string;
    email?: string;
    phone?: string;
    title?: string;
    goal_amount?: number;
    amount?: number;
    donor_count?: number;
    color_code?: string;
    slug?: string;
    summary?: string;
    author?: any;
    content?: string;
    excerpt?: string;
    lang?: string;
    meta?: FundraiserMeta;
    image?: FundraiserImage;
    logo?: {
        url: string,
        alt: string,
    };
    status?: any;
    published_on?: string;
    created_at?: string;
    published_at?: string;
    type?: string;
    fundraising_file?: {
        url: string,
        name: string,
        cloudinary_id: string
    };
    stripe_status?: string;
}