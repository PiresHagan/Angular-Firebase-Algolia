import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Company } from '../interfaces/company.type';
import { Observable } from 'rxjs';
import { CompanyConstant } from '../constants/company-constant';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private subscriptionsCollection = 'subscriptions';
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

  getOnBoardingCompanies(lang: string) {
    return new Promise((resolve, reject) => {
      this.http.get(environment.baseAPIDomain + `/api/v1/onBoarding/${lang}/getTopCompanies`, {}).subscribe((response: any) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  getCompanyById(companyId: string): Observable<any> {
    return this.db.doc(`${this.companiesCollection}/${companyId}`).valueChanges();
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

  getCompaniesOnScroll(limit: number, navigation: string, lastVisible, lang: string) {
    let dataQuery = this.db.collection<Company[]>(`${this.companiesCollection}`, ref => ref
      .where("lang", "==", lang)
      .orderBy('created_at', 'desc')
      .limit(limit));
    
    if(navigation == 'next') {
      dataQuery = this.db.collection<Company[]>(`${this.companiesCollection}`, ref => ref
        .where("lang", "==", lang)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .startAfter(lastVisible));
    }

    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        companyList: actions.map(a => {

          const data: any = a.payload.doc.data();
          return data;
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    }));
  }

  getAllFollowers(companyId) {
    return this.db.collection(this.companiesCollection).doc(companyId).collection(`${this.followersSubCollection}`)
      .snapshotChanges().pipe(map(actions => {
        return {
          followers: actions.map(a => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          }),
        }
      }));
  }

  getFollowers(companyId, limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(this.companiesCollection).doc(companyId).collection(`${this.followersSubCollection}`, ref => ref
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection(this.companiesCollection).doc(companyId).collection(`${this.followersSubCollection}`, ref => ref
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        followers: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }

  getCompanySubscription(companyId: string) {
    let dataQuery = this.db.collection(`${this.subscriptionsCollection}`, ref => ref
      .where("customer_id", "==", companyId)
      .where("status", "==", CompanyConstant.STATUS_ACTIVE)
      .where("type", "==", CompanyConstant.LEAD_PACKAGE)
    );
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data: any = a.payload.doc.data();
        return data;
      })
    }));
  }

  getCompanyPublicProfileSubscription(companyId: string) {
    let dataQuery = this.db.collection(`${this.subscriptionsCollection}`, ref => ref
      .where("customer_id", "==", companyId)
      .where("status", "==", CompanyConstant.STATUS_ACTIVE)
      .where("type", "==", CompanyConstant.PUBLIC_PROFILE_PACKAGE)
    );
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data: any = a.payload.doc.data();
        return data;
      })
    }));
  }


}
