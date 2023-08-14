import { ArticleImage } from "./article-image.type";
import { Group } from "./group.type";

export interface Event {
    id?: string;
    comments_count?: number;
    rating_count?: number;
    rating_sum?: number;
    event_name?: string;
    description?: string;
    event_type?: string;
    cover?: ArticleImage;
    scheduled_date?: string;
    created_at?: string;
    published_at?: string;
    event_slug?: String;
    host_fee?: number;
    publisher?: {
        id?: string;
        type?: string
    };
    owner?: {
        id?: string;
    };
    city?: string;
    country?: string;
    first_group_type?: string; 
    second_group_type?: string;
    first_group_size?: number; 
    second_group_size?: number;
    status?: {
        title: string;
        color: string;
    };
    second_joind_group?: Group;
    first_joind_group?: Group;
    likes_count?: number;
    view_count?: number;

}