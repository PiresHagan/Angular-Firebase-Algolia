export interface HairSalonType {
  id?: string;
  name?: string;
  price?: any;
  email?: string;
  lang?: string;
  phone?: string
  slug?: string;
  bio?: string;
  website?: string;
  owner?: {
      id: string
  }
  presentation?: string;
  color_code?: string
  logo?: {
      url: string;
      alt: string
  };
  cover?: {
      url: string;
      alt: string
  };
  created_at: string;
  updated_at: string;
  type?: string;
  is_guest_post_enabled?: boolean;
  // stripe_status?: string;
  video?:{
    url?: string;
    alt?: string;
    cloudinary_id: string
  };
  country?: string;
  city?:string;
  address?:string;
  deliver_services_type?:string;
  is_services_can_delivered_at_clients_home?:boolean;
  view_count?:any;
  likes_count?:any;
}

export interface HairSalonArticleMeta {
title?: string;
keyword?: string;
description?: string
}

export interface HairSalonArticleImage {
url?: string;
alt?: string;
cloudinary_id: string

}

export interface HairSalonArticleOtherFile {
name: string;
url: string;
cloudinary_id: string;
}

export interface HairSalonArticle{
id?: string;
title?: string;
slug?: string;
summary?: string;
category?: any;
country?: any;
city?:any;
author?: any;
content?: string;
store?: any;
product?: any;
excerpt?: string;
topics?: string;
lang?: string;
meta?: HairSalonArticleMeta;
image?: HairSalonArticleImage;
is_paid_guest_post?: boolean;
payment_source?: string;
paid_amount?: number;
payment_details?: any;
view_count?: number;
status?: any;
likes_count?: number;
comments_count?: number;
published_on?: string;
created_at?: string;
published_at?: string;
type?: string;
politician_file?: {
    url: string;
    name: string;
    cloudinary_id: string;
    others: HairSalonArticleOtherFile[]
}
}

export interface HairSalonServiceType{
  id?: string;
  name?: string;
  slug?: string;
  duration?: string;
  selected_time?: any;
  price?: any;
  created_at?: string;
  owner_id?:any;
  hairSalonId?:any;
  time_slots?:any;
  service_deliver_type?:any;
  service_deliver_price?:any;
}
export interface timeSlot{
  id?:any;
  start_time?:any;
  end_time?:any;
  slot?:any;
  capacity?:number;
}

export interface Booking {
  amount: number;
  card_cvv: number;
  card_date: number;
  card_month: number;
  card_name: string;
  card_number: number;
  card_year: number;
  created_at: Date;
  date: string;
  email: string;
  fname: string;
  is_paid: string;
  lname: string;
  mobile: string;
  notes: string;
  hairSalonId:string;
  serviceId: string;
  hairSalonName:string;
  serviceName: string;
  hairSalonServiceDetails:HairSalonServiceType;
  time: string;
  status: string;
}

export interface BookingDetails {
  date: string;
  booking_date: string;
  created_time: string;
  duration: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_notes: string;
  amount: string;
  isPaid: string;
  hairSalonId:string;
  serviceId: string;
  hairSalonName:string;
  hairSalonEmail:string;
  serviceName: string;
  status: string;
}
export interface BookingRequest{
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  notes: string;
  success_url: string;
  cancel_url: string;
  service_id: string;
  booking_time: {
    start_time: string;
    end_time: string
  };
  date: string;
  hair_salon_id: string;
  service_deliver_type;
  client_address;
  deliver_service_price;
}
export interface PublicProfileSubscription {
  created_at: string,
  customer_id: string,
  external_id: string,
  id: string,
  limit: number,
  package_id: string,
  status: string,
  type: string
}
