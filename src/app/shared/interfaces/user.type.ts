/* export interface User {
    id: number;
    username: string;
    password: string;
    token?: string;
} */

export interface User {
    displayName: string,
    email: string,
    isAnonymous?: boolean,
    photoURL?: string,
    uid: string,
    phone?: string,
    birth?: string,
    biography?: string,
    networks?: any,
    interests?: any,
    slug?: any
}