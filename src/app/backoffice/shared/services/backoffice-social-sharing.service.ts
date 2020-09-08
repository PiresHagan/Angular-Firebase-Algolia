import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Post } from 'src/app/shared/interfaces/social-sharing-post.type';

@Injectable({
  providedIn: 'root'
})
export class BackofficeSocialSharingService {

    currentUser;
    postImagePath = 'posts';
    postsCollection = 'posts';

    constructor(
        private http: HttpClient,
        private db: AngularFirestore, 
        private userService: UserService,
        private storage: AngularFireStorage
    ) { }

    saveAuthTokenToServer(data) {
        this.userService.getCurrentUser().then((user) => {
            this.currentUser = { id: user.uid, email: user.email, avatar: user.photoURL, fullname: user.displayName };
            if(this.currentUser.id) {
                console.log('Sending auth token To Server', data);
                this.userService.updateUser(this.currentUser.id, data).subscribe(result => {
                    console.log(`Updated user notification_token for user : ${this.currentUser.id}`, result);
                }, err => {
                    console.error(`Failed to update notification_token for user : ${this.currentUser.id}`, err);
                })
            }
        });
    }

    addNewPost(postData) {
        return new Promise((resolve, reject) => {
            this.http.post(environment.baseAPIDomain + `/api/v1/posts`, postData).subscribe((result) => {
                resolve(result) 
            }, (error) => {
                reject(error)
            })
        })
    }
    
    updatePost(postId: string, postData) {
        return new Promise((resolve, reject) => {
            return this.http.put(environment.baseAPIDomain + `/api/v1/posts/${postId}`, postData).subscribe((postData) => {
                resolve(postData)
            }, (error) => {
                reject(error)
            })
        })
    }
    
    deletePost(postId) {
        return this.http.delete(environment.baseAPIDomain + `/api/v1/posts/${postId}`);
    }
  
    addPostImage(imageDetails: any) {
        const path = `${this.postImagePath}/${Date.now()}_${imageDetails.file.name}`;
        return new Promise((resolve, reject) => {
            this.storage.upload(path, imageDetails.file).then(snapshot => {
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve({ image: { url: downloadURL } });
                }).catch( err => reject(err) );
            }).catch( error => reject(error) );
        })
    }

    getPostsOnScroll(publisherId: string, limit: number, navigation: string, lastVisible) {
        let dataQuery = this.db.collection<Post[]>(`${this.postsCollection}`, ref => ref
          .where("member_id", "==", publisherId)
          .orderBy('scheduled_date', 'asc')
          .limit(limit));
        
        if(navigation == 'next') {
          dataQuery = this.db.collection<Post[]>(`${this.postsCollection}`, ref => ref
            .where("member_id", "==", publisherId)
            .orderBy('scheduled_date', 'asc')
            .limit(limit)
            .startAfter(lastVisible));
        }
    
        return dataQuery.snapshotChanges().pipe(map(actions => {
          return {
            postList: actions.map(a => {
              const data: any = a.payload.doc.data();
              return data;
            }),
            lastVisible: actions && actions.length < limit ? null : actions[actions.length - 1].payload.doc
          }
        }));
      }

}
