import { Injectable } from '@angular/core';
import { Article } from '../interfaces/article.type';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './authentication.service';




@Injectable({
  providedIn: 'root'
})
export class StaffArticleService {
  articleCollection: string = 'articles';
  constructor(private db: AngularFirestore, private http: HttpClient, private authService: AuthService) { }



  getArticles(limit: number = 10, navigation: string = "first", lastVisible = null) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
      .orderBy('created_at', 'desc')
      .limit(limit)
    )
    switch (navigation) {
      case 'next':
        dataQuery = this.db.collection<Article[]>(`${this.articleCollection}`, ref => ref
          .orderBy('created_at', 'desc')
          .limit(limit)
          .startAfter(lastVisible))
        break;
    }
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return {
        articleList: actions.map(a => {

          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }),
        lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
      }
    })
    );
  }
  async updatePassword(email, password) {
    const token = await this.authService.getUserToken();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    }

    this.http.post(environment.baseAPIDomain + '/api/passwordChange', {
      email: email,
      password: password
    }, httpOptions).subscribe((data) => {
      console.log(data)
    }, (err) => {
      console.log(err)
    });

  }
}
