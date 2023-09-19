import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { VideoConferenceSession } from 'src/app/shared/interfaces/video-conference-session.type';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { LeadType } from '../interfaces/lead.type';

@Injectable({
  providedIn: 'root'
})
export class GetInTouchService {
  private basePath = '/video-conference/';
  private videoConferenceCollection = 'video-conference';
  private companiesCollection = 'companies';
  private companyLeadsCollection ='leads';
  private companyLeadsDataCollection ='data';
  private politicainsCollection ='politicians';
  private politicainContactsCollection ='contact';
  serviceCollection: string = 'services';
  serviceContactsCollection: string = 'contact';
  jobsCollection: string = 'jobs';
  jobsContactsCollection: string = 'contact';

  constructor(private http: HttpClient,
    public db: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  addSessionForCompanyLead(companyId: string, leadSessionData:VideoConferenceSession) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/getInTouch/${companyId}/getInTouchCreateMeeting`, leadSessionData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }
  getCompanyLeads(companyId) {
    let dataQuery = this.db.collection<LeadType[]>(this.companiesCollection).doc(companyId).collection(`${this.companyLeadsCollection}`);
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        monthlyLeadsList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
      }
    })
    );
  }
  getCompanyLeadsOfMonth(companyId: string, monthId: string) {
      let dataQuery = this.db.collection<LeadType[]>(this.companiesCollection).doc(companyId).collection(`${this.companyLeadsCollection}`).doc(monthId).collection(`${this.companyLeadsDataCollection}`);
      return dataQuery.snapshotChanges().pipe(map(actions => {
        return {
          leadsList: actions.map(a => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          }),
        }
      })
    );
  }

  getCompanyLeadSessions(companyId, leadId, leadEmail) {
    let dataQuery: AngularFirestoreCollection<unknown>;
    if(leadId){
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('companyId','==',companyId)
        .where('lead_id','==',leadId)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    else if(leadEmail){
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('companyId','==',companyId)
        .where('lead_email','==',leadEmail)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    else{
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('companyId','==',companyId)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        sessionList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
      }
    })
    );
  }

  addSessionForServiceContact(serviceId: string, contactSessionData:VideoConferenceSession) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/getInTouch/${serviceId}/getInTouchCreateServiceMeeting`, contactSessionData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }
  getServiceContacts(serviceId) {
    let dataQuery = this.db.collection<LeadType[]>(this.serviceCollection).doc(serviceId).collection(`${this.serviceContactsCollection}`);
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        contactsList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
      }
    })
    );
  }
  getServiceContactSessions(serviceId, leadId, leadEmail) {
    let dataQuery: AngularFirestoreCollection<unknown>;
    if(leadId){
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('serviceId','==',serviceId)
        .where('lead_id','==',leadId)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    else if(leadEmail){
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('serviceId','==',serviceId)
        .where('lead_email','==',leadEmail)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    else{
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('serviceId','==',serviceId)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        sessionList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
      }
    })
    );
  }

  addSessionForPoliticianLead(politicianId: string, contactSessionData:VideoConferenceSession) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/getInTouch/${politicianId}/getInTouchCreatePoliticianMeeting`, contactSessionData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }
  getPoliticianContacts(politicianId) {
    let dataQuery = this.db.collection<LeadType[]>(this.politicainsCollection).doc(politicianId).collection(`${this.politicainContactsCollection}`);
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        contactsList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
      }
    })
    );
  }
  getPoliticianContactSessions(politicianId, leadId, leadEmail) {
    let dataQuery: AngularFirestoreCollection<unknown>;
    if(leadId){
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('politicianId','==',politicianId)
        .where('lead_id','==',leadId)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    else if(leadEmail){
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('politicianId','==',politicianId)
        .where('lead_email','==',leadEmail)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    else{
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('politicianId','==',politicianId)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        sessionList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
      }
    })
    );
  }

  addSessionForJobCompanyLead(jobId: string, contactSessionData:VideoConferenceSession) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/getInTouch/${jobId}/getInTouchCreateJobMeeting`, contactSessionData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }
  getJobCompanyContacts(jobId) {
    let dataQuery = this.db.collection<LeadType[]>(this.jobsCollection).doc(jobId).collection(`${this.jobsContactsCollection}`);
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        contactsList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
      }
    })
    );
  }
  getJobCompanyContactSessions(jobId, leadId, leadEmail) {
    let dataQuery: AngularFirestoreCollection<unknown>;
    if(leadId){
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('jobId','==',jobId)
        .where('lead_id','==',leadId)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    else if(leadEmail){
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('jobId','==',jobId)
        .where('lead_email','==',leadEmail)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    else{
      dataQuery = this.db.collection<VideoConferenceSession[]>(`${this.videoConferenceCollection}`, ref => ref
        .where('jobId','==',jobId)
        .where('is_private','==',true)
        .orderBy('start_time', 'desc')
      );
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        sessionList: actions.map(a => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
      }
    })
    );
  }
}

