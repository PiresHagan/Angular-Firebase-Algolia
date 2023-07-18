export interface Infleuncer {
    id?: string;
    title?: string;
    description?: string;
    price?: string;
    email?: string;
    phoneNumber?: string;
    tikTokProfileURL?: string;
    tikTokProfileSub?: string;
    instagramProfileURL?: string;
    instagramProfileSub?: string;
    faceBookProfileURL?:string;
    faceBookProfileSub?: string;
    snapchatProfileURL?: string;
    snapchatProfileSub?: string;
    youtubeProfileURL?: string;
    youtubeProfileSub?: string;
    telegramProfileURL?: string;
    telegramProfileSub?: string;
    mediumProfileURL?: string;
    mediumProfileSub?: string;
    twitterProfileURL?: string;
    twitterProfileSub?: string;
    author?: {
        slug?: string;
        fullname?: string;
        avatar?: {
            url?: string;
            alt?:string;
        },
        type?: string;
        id?: string;
    },
    created_at?: string;
    avatar?: {
        url?: string;
        alt?: string;
    }
}
