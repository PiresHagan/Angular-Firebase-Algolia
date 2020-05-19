import { User } from "./user.type"

export interface Comment {
    article?: number;
    message?: string;
    published_on?: string;
    userName: string;
}
