import { Bookmarks } from "./bookmarks.type";
import { UserNotification } from "./user-notification.type";

export interface User {
    id: string,
    email: string,
    isAnonymous?: boolean,
    fullname?: string,
    avatar?: string
    created_at?: string,
    updated_at?: string,
    lang?: string,
    mobile?: boolean,
    birthdate?: string,
    bookmarks?: Bookmarks,
    notification?: UserNotification,
    displayName?: string,
    slug?: string,


    photoURL?: string,
    uid?: string,
    phone?: string,
    isNewConsoleUser?: boolean;
    biography?: string
    whatsapp?: string;
    skype?: string;
}