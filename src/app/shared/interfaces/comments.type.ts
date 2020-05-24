import { User } from "./user.type"

export interface Comment {
    message?: string;
    published_on?: string;
    updated_on?: string;
    user_details?: User;
}
