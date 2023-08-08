import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { VideoConferenceSession } from 'src/app/shared/interfaces/video-conference-session.type';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class GetInTouchService {
  private basePath = '/video-conference/';
  private videoConferenceCollection = 'video-conference';

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

  addSessionForServiceContact(serviceId: string, contactSessionData:VideoConferenceSession) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/getInTouch/${serviceId}/getInTouchCreateServiceMeeting`, contactSessionData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  addSessionForPoliticianLead(serviceId: string, contactSessionData:VideoConferenceSession) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/getInTouch/${serviceId}/getInTouchCreatePoliticianMeeting`, contactSessionData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }
}

