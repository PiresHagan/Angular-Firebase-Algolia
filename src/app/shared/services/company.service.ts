import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Company } from '../interfaces/company.type';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private companiesCollection = 'companies';
  private followersSubCollection = 'followers';
;
  constructor(
    private http: HttpClient, 
    private db: AngularFirestore
  ) { }

  getAllCompanies() {
    return this.db.collection<Company[]>(this.companiesCollection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCompanyBySlug(slug: string) {
    return this.db.collection<Company>(this.companiesCollection, ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  followCompany(companyId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/companies/${companyId}/follow`, {}).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  unfollowCompany(companyId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/companies/${companyId}/unfollow`, {}).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  createCompanyLead(companyId: string, leadData) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/companies/${companyId}/leads`, leadData).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  isUserFollowing(companyId: string, followerId: string) {
    return this.db.collection(this.companiesCollection).doc(companyId).collection(this.followersSubCollection).doc(followerId).valueChanges();
  }

}
