export interface VideoConferenceSession {
    id?: string;
    name?: string;
    is_chat?: boolean;
    s_private?: boolean;
    image?: string;
    owner_id?: string;
    date?: any;
    start_time?: any;
    end_time?: any;
    created_at?: any;
    updated_at?: any;
    duration?: string;
    is_started?: boolean;
    is_ended?: boolean;
    ended_at?:any;
    description?: any;
}
export interface VC_Message {
  id?:any;
    from_user_id?: string;
    from_user_name?: string;
    sent_at?: any;
    text?: string;
    type?:string;
}
export interface VC_Participant {
  id?:any,
    user_id?: string;
    user_name?: string;
    is_session_owner?: boolean;
    asked_to_join?:boolean;
    asked_to_join_at?:any;
    is_approved?:boolean;
    approved_at?:any;
    joinded_at?:any;
    is_joined?: boolean;
    is_online?:boolean;
    leaved_at?:any;
    is_canceled?:boolean;
    canceled_at?:any;
    mic_on?:boolean;
    camera_on?:boolean;
    screen_share_on?:boolean;
}
