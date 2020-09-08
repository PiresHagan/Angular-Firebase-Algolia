import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class BackofficeSocialSharingService {

    currentUser;
    postImagePath = 'posts';

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

}
