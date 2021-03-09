import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Category } from '../interfaces/category.type';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoriesCollection: string = 'categories';
  categoryDocument: string = 'category';
  funnelsCollection: string = 'funnels';
  topicsCollection: string = 'topics';

  constructor(
    private afAuth: AngularFireAuth, 
    private db: AngularFirestore,
    private http: HttpClient
  ) { }

  getAll(language: string = 'en') {
    return this.db.collection<Category[]>(this.categoriesCollection, ref => ref.where('lang', '==', language).orderBy('order', 'asc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          return { uid, ...data };
        });
      })
    );
  }

  getOnBoardingCategories(lang: string) {
    return new Promise((resolve, reject) => {
      this.http.get(environment.baseAPIDomain + `/api/v1/onBoarding/${lang}/getTopCategories`, {}).subscribe((response: any) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  get(id: string): Observable<Category> {
    return this.db.doc<Category>(`${this.categoriesCollection}/${id}`).valueChanges().pipe(
      take(1),
      map(category => {
        category.id = id;
        return category
      })
    );
  }
  getCategoryBySlug(slug: string) {
    return this.db.collection<Category>(this.categoriesCollection, ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        const categoryData = actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        return categoryData ? categoryData[0] : {}
      })
    );
  }
  getTopicBySlug(slug: string) {
    return this.db.collection<Category>(this.topicsCollection, ref => ref
      .where('slug', '==', slug)
      .limit(1)
    ).snapshotChanges().pipe(take(1),
      map(actions => {
        const categoryData = actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
        return categoryData ? categoryData[0] : {}
      })
    );
  }
  getTopicList(categoryId, language = 'en') {
    return this.db.collection<Category[]>(this.topicsCollection, ref => ref.where('lang', '==', language).where('category', '==', categoryId)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          return { uid, ...data };
        });
      })
    );
  }

  addSubscription(category: Category, email: string) {
    const emailIdWithoutDot = email.split('.').join(''),
      contactObj = {
        email: email,
        timestamp: new Date().toISOString(),
        source: 'category',
        ...category
      };
    return new Promise((resolve, reject) => {
      this.db.doc(`${this.funnelsCollection}/${this.categoryDocument}/${category.id}/${emailIdWithoutDot}`).set(contactObj).then((articleData) => {
        resolve(articleData)
      })
    }).catch((error) => {
      console.log(error)
    })
  }

  followCategory(userId: string, categoryId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/onBoarding/${userId}/followCategory`, {
        category_id: categoryId
      }).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

  unfollowCategory(userId: string, categoryId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + `/api/v1/onBoarding/${userId}/unFollowCategory`, {
        category_id: categoryId
      }).subscribe((response) => {
        resolve(response)
      }, (error) => {
        reject(error)
      })
    })
  }

}
