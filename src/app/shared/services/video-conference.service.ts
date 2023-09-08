import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StripeCustomer, Customer, VC_Message, VC_Participant, VideoConferenceSession } from 'src/app/shared/interfaces/video-conference-session.type';
import { take, map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { VideoConferenceConstant } from 'src/app/shared/constants/video-conference-constants';

@Injectable({
  providedIn: 'root'
})
export class VideoConferenceService {
  private basePath = '/video-conference/';
  private videoConferenceCollection = 'video-conference';
  private videoConferenceMessagesCollection = 'messages';
  private videoConferenceParticipantsCollection = 'participants';
  private subscriptionsCollection="video-conference-subscriptions";
  private packageCollection = 'video-conference-packages';
  private package_cycle_Collection = 'package-cycle';

  constructor(private http: HttpClient,
    public db: AngularFirestore,
    private storage: AngularFireStorage,
  ) {

  }

  getLiveSessions(limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
      .where('is_started','==',true)
      .where('is_ended','==',false)
      .where('is_private','==',false)
      .orderBy('start_time', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('is_started','==',true)
      .where('is_ended','==',false)
      .where('is_private','==',false)
      .orderBy('start_time', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        sessionList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  searchLiveSessions(limit: number = 10, navigation: string = "first", lastVisible = null, searchValue : string,searchfield){

    if (!limit) {
      limit = 10;
    }
    let searchTerm = searchValue;
    let strlength = searchTerm.length;
    let strFrontCode = searchTerm.slice(0, strlength-1);
    let strEndCode = searchTerm.slice(strlength-1, searchTerm.length);
    let endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

    let dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
    .where('is_started','==',true)
      .where('is_ended','==',false)
      .where('is_private','==',false)
      .where(searchfield, ">=", searchTerm)
      .where(searchfield, "<", endCode + '\uf8ff')
      .orderBy(searchfield, 'desc')
      .orderBy('start_time', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('is_started','==',true)
      .where('is_ended','==',false)
      .where('is_private','==',false)
        .where(searchfield, ">=", searchTerm)
        .where(searchfield, "<", endCode + '\uf8ff')
        .orderBy(searchfield, 'desc')
        .orderBy('start_time', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        sessionList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getSessionById(sessionId: string): Observable<any> {
    return this.db.collection(`${this.videoConferenceCollection}`, ref => ref.where('id', '==', sessionId)).valueChanges();
  }

  updateVideoConferenceById(sessionId: string, session:VideoConferenceSession):Observable<VideoConferenceSession>{
    return this.http.put(environment.baseAPIDomain+'/api/v1/videoConference/'+sessionId,session);
  }

  endVideoConferenceById(sessionId: string, session:VideoConferenceSession, sessionParticipants:VC_Participant[], sessionParticipantsWaitlist:VC_Participant[]){
    return new Promise<VideoConferenceSession>((resolve, reject) => {
      this.http.put(environment.baseAPIDomain+'/api/v1/videoConference/'+sessionId,session).subscribe((response) => {
        sessionParticipants.forEach(element => {
          if(element.is_online){
            element.camera_on=false;
            element.mic_on=false;
            element.screen_share_on=false;
            element.is_online=false;
            element.leaved_at=new Date();
            this.http.put(environment.baseAPIDomain + '/api/v1/videoConference/' + sessionId + '/participants/' + element.id, element)
            .subscribe((response1)=>{
            });
          }
        });
        sessionParticipantsWaitlist.forEach(element => {
          if(element.is_online){
            element.camera_on=false;
            element.mic_on=false;
            element.screen_share_on=false;
            element.is_online=false;
            element.leaved_at=new Date();
            this.http.put(environment.baseAPIDomain + '/api/v1/videoConference/' + sessionId + '/participants/' + element.id, element)
            .subscribe((response1)=>{
            });
          }
        });
        resolve(response);
      }, (error) => {
        reject(error)
      })
    });
  }

  getSessionMessages(sessionId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(this.videoConferenceCollection).doc(sessionId).collection(`${this.videoConferenceMessagesCollection}`, ref => ref
    .orderBy("sent_at","asc")
    .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(this.videoConferenceCollection).doc(sessionId).collection(`${this.videoConferenceMessagesCollection}`, ref => ref
        .orderBy("sent_at","asc")
        .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        messages: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  addSessionMessage(sessionId: string, message: VC_Message) {

    return this.http.post(environment.baseAPIDomain + '/api/v1/videoConference/' + sessionId + '/messages', message);
  }

  updateSessionMessage(sessionId: string, messageId: string, message: VC_Message) {

    return this.http.put(environment.baseAPIDomain + '/api/v1/videoConference/' + sessionId + '/messages/' + messageId, message);
  }

  deleteSessionMessage(sessionId: string, messageId: string) {

    return this.http.delete(environment.baseAPIDomain + '/api/v1/videoConference/' + sessionId + '/messages/' + messageId);
  }

  getSessionParticipants(sessionId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(this.videoConferenceCollection).doc(sessionId).collection(`${this.videoConferenceParticipantsCollection}`, ref => ref
    .where("is_joined","==", true)
    .orderBy("joinded_at","asc")
    .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(this.videoConferenceCollection).doc(sessionId).collection(`${this.videoConferenceParticipantsCollection}`, ref => ref
        .where("is_joined","==", true)
        .orderBy("joinded_at","asc")
        .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        participants: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }
  getSessionParticipantByID(sessionId: string, participantId: string): Observable<VC_Participant> {
    return this.db.doc<VC_Participant>(`${this.videoConferenceCollection}/${sessionId}/${this.videoConferenceParticipantsCollection}/${participantId}`)
    .valueChanges()
    .pipe(take(1),
    map(participant => {
      return participant;
    }));
  }
  getSessionOnWaitParticipants(sessionId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(this.videoConferenceCollection).doc(sessionId).collection(`${this.videoConferenceParticipantsCollection}`, ref => ref
    .where("asked_to_join","==", true)
    .where("is_approved","==", false)
    .where("is_canceled","==", false)
    .orderBy("joinded_at","asc")
    .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(this.videoConferenceCollection).doc(sessionId).collection(`${this.videoConferenceParticipantsCollection}`, ref => ref
        .where("asked_to_join","==", true)
        .where("is_approved","==", false)
        .where("is_canceled","==", false)
        .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        participants: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }


  addSessionParticipant(sessionId: string, participant: VC_Participant) {

    return this.http.post(environment.baseAPIDomain + '/api/v1/videoConference/' + sessionId + '/participants', participant);
  }

  updateSessionParticipant(sessionId: string, participantId: string, participant: VC_Participant) {

    return this.http.put(environment.baseAPIDomain + '/api/v1/videoConference/' + sessionId + '/participants/' + participantId, participant);
  }

  deleteSessionParticipant(sessionId: string, participantId: string) {

    return this.http.delete(environment.baseAPIDomain + '/api/v1/videoConference/' + sessionId + '/participants/' + participantId);
  }

  getPackages() {
    return this.db.collection(this.packageCollection, ref => ref.orderBy('ordr', 'asc')).valueChanges()
  }
  getPackage_cycles(packageId:string) {
    return this.db.collection(this.packageCollection).doc(packageId).collection(this.package_cycle_Collection, ref=>ref.orderBy('ordr', 'asc')).valueChanges();
  }

  createVideoConferenceCustomer(ownerId: string, postData:Customer) {
    let s: StripeCustomer = {
      name: postData.firstName +' ' + postData.lastName,
      address:{
        city: postData.city,
        country: postData.countryRegion,
        postal_code:postData.zipPostal,
        state:postData.state
      },
      email: postData.email,
      phone: postData.phone
    }
    return this.http.post(environment.baseAPIDomain + '/api/v1/videoConference/customers/' + ownerId + '/createcustomer', s)
  }

  createVideoConferenceSubscription(ownerId: string, postData: { external_id: string, paymentMethodId: string, customer_type: string, packageId: string, package_type:string}) {
    return this.http.post(environment.baseAPIDomain + `/api/v1/videoConference/${ownerId}/subscriptions`, postData)
  }

  updateVideoConferencePackageSubscription(ownerId: string, subscriptionId: string, postData: { external_id: string, paymentMethodId: string, packageId: string, package_type:string }) {
    return this.http.put(environment.baseAPIDomain + `/api/v1/videoConference/${ownerId}/subscriptions/${subscriptionId}`, postData)
  }

  cancelVideoConferencePackageSubscription(ownerId: string, subscriptionId: string) {
    return this.http.delete(environment.baseAPIDomain + `/api/v1/videoConference/${ownerId}/subscriptions/${subscriptionId}`)
  }
  updateBilling(ownerId: string) {
    return this.http.post(environment.baseAPIDomain +`/api/v1/videoConference/sessions/${ownerId}/customer`, {
      redirectUrl: window && window.location && window.location.href || '',
    })
  }

  getPaymentMethod(customer_id: string) {
    return this.http.get(environment.baseAPIDomain +`/api/v1/videoConference/${customer_id}/methods`)
  }

  getVideoConferenceSubscription(ownerId: string) {
    let dataQuery = this.db.collection(`${this.subscriptionsCollection}`, ref => ref
      .where("customer_id", "==", ownerId)
      .where("status", "==", VideoConferenceConstant.STATUS_ACTIVE)
    );
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data: any = a.payload.doc.data();
        return data;

      })
    }));
  }
}

