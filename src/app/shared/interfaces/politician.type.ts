import { ServiceMeta } from "./service-meta.type";
import { ServiceImage } from "./service-image.type";

export interface Politician {
    id?: string;
    title?: string;
    slug?: string;
    summary?: string;
    category?: any;
    author?: any;
    content?: string;
    excerpt?: string;
    topics?: string;
    lang?: string;
    meta?: ServiceMeta;
    image?: ServiceImage;
    view_count?: number;
    status?: any;
    likes_count?: number;
    comments_count?: number;
    published_on?: string;
    created_at?: string;
    published_at?: string;
    type?: string;
    politician_file?: {
        url: string,
        name: string,
        cloudinary_id: string,
        others: any[]
    },
    meeting_settings?: {
        available_days_count:number,
        day0_startTime?: string,
        day0_startTime_hh?: string,
        day0_startTime_mm?: string,
        day0_endTime?: string,
        day0_endTime_hh?: string,
        day0_endTime_mm?: string,
        day1_startTime?: string,
        day1_startTime_hh?: string,
        day1_startTime_mm?: string,
        day1_endTime?: string,
        day1_endTime_hh?: string,
        day1_endTime_mm?: string,
        day2_startTime?: string,
        day2_startTime_hh?: string,
        day2_startTime_mm?: string,
        day2_endTime?: string,
        day2_endTime_hh?: string,
        day2_endTime_mm?: string,
        day3_startTime?: string,
        day3_startTime_hh?: string,
        day3_startTime_mm?: string,
        day3_endTime?: string,
        day3_endTime_hh?: string,
        day3_endTime_mm?: string,
        day4_startTime?: string,
        day4_startTime_hh?: string,
        day4_startTime_mm?: string,
        day4_endTime?: string,
        day4_endTime_hh?: string,
        day4_endTime_mm?: string,
        day5_startTime?: string,
        day5_startTime_hh?: string,
        day5_startTime_mm?: string,
        day5_endTime?: string,
        day5_endTime_hh?: string,
        day5_endTime_mm?: string,
        day6_startTime?: string,
        day6_startTime_hh?: string,
        day6_startTime_mm?: string,
        day6_endTime?: string,
        day6_endTime_hh?: string,
        day6_endTime_mm?: string,
    }
}
