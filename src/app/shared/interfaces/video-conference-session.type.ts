export interface VideoConferenceSession {
  id?: string;
  name?: string;
  is_chat?: boolean;
  is_private?: boolean;
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
  invitees?:any;
  companyId?:any;
  company?:any;
  lead_id?:any;
  lead_email?:any;
  lead_first_name?: any;
  lead_last_name?: any;
  serviceId?: any;
  service?: any;
  politicianId?: any;
  politician?: any;
  link?: any;
  jobId?: any;
  job?: any;
  job_companyId?:any;
  job_company?:any;
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
  uid?:string;
}
export interface VideoConferencePackage {
package_type: string
description:Array<string>,
durationunit:string,
id: string,
external_id: string,
limit:number,
limit_type:string,
monthly_cost:number,
name: string,
price: number,
subtitle: string,
title:string,
type: string,
yearly_cost:number
}

export interface VideoConferencePackageCycle {
package_type: string,
durationUnit: string
external_id:string,
limit:number,
limit_type:string,
monthly_price:number,
price: number,
title:string,
name: string,
id: string,
unit:string,
taxes_fees:number
}

export interface VideoConferenceSubscription {
created_at: string,
customer_id: string,
external_id: string,
id: string,
limit: number,
status: string,
package_type: string,
packageId:string
}
export interface Customer {
firstName: string,
lastName: string,
email: string,
phone: string,
address: string,
city: string,
state: string,
zipPostal : string,
countryRegion:string
}
export interface StripeCustomer {
name: string,
address:{
  city: string,
  country: string,
  line1?: string,
  line2?: string,
  postal_code: string,
  state: string
},
email: string,
description?: string,
metadata?: string,
payment_method?:string,
phone: string,
shipping?:{
  address: string,
  name: string,
  phone: string,
}
}

