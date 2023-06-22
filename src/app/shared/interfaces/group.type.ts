import { ArticleImage } from "./article-image.type";
import { Member } from "./member.type";

export interface Group {
    id?: string;
    group_name?: string;
    group_subscribtions?: string;
    group_size?: string;
    cover?: ArticleImage;
    avatar?: ArticleImage;
    group_slug?: string;
    created_at?: string;
    group_type?: string;
    Members?: Member[];
    status?: string;
    creator?: {
        id?: string;
        type?: string
    };
    owner?: {
        id?: string;
    };
    MemberIds?: string[];
    rating_count?: number;
    rating_sum?: number;
    comments_count?: number;
}