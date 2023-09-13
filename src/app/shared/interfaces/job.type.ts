export interface Job {
    id?: string;
    jobTitle?: string,
    jobType?: string,
    categories?: string,    
    companyName?: string,
    jobLocation?: string,
    salary?: string,
    jobRequirements?: string,
    created_at: string,
    updated_at: string,
    logo?: {
        url: string,
        alt: string
    },
    video?: {
        url: string,
        alt: string
    },
    owner?:{
        id: string,
    },    
    type?: string,
    is_guest_post_enabled?: boolean,    
}