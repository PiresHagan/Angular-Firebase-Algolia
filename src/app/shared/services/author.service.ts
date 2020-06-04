import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import 'firebase/storage';



@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  authorsCollection: string = 'members';
  private followersCollection: string = 'followers';
  private followingsCollection: string = "followings";

  constructor(private afs: AngularFirestore) { }

  getUserBySlug(slug: string) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.where("slug", "==", slug)
    ).snapshotChanges().pipe(map(actions => {
      return actions ? actions[0].payload.doc.data() : null;
    })
    );
  }
  getAuthorsById(authoIdArray: []) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.where("id", "in", authoIdArray.slice(0, 9))
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        return data;
      });
    })
    );

  }
  reportAbusedUser(userId: string) {

    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`${this.authorsCollection}`).doc(`${userId}`).update({ is_abused: true }).then(() => {
        resolve();
      }).catch(() => {
        reject()
      })
    })
  }
  /**
   * Create author follower collection
   * 
   * @param articleId 
   * @param commentDtails 
   */

  follow(authorId: string, followerData) {
    return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followersCollection).doc(followerData.id).set(followerData);
  }

  unfollow(authorId: string, followerId) {
    return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followersCollection).doc(followerId).delete();
  }


  isUserFollowing(authorId: string, followerId) {
    return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followersCollection).doc(followerId).valueChanges();
  }
  getFollowers(authorId) {
    return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followersCollection).valueChanges()
  }

  following(userId, authorData) {
    return this.afs.collection(this.authorsCollection).doc(userId).collection(this.followingsCollection).doc(authorData.id).set(authorData);

  }
  unfollowing(userId, authorId) {
    return this.afs.collection(this.authorsCollection).doc(userId).collection(this.followingsCollection).doc(authorId).delete();

  }
  getFollowings(authorId) {
    return this.afs.collection(this.authorsCollection).doc(authorId).collection(this.followingsCollection).valueChanges()
  }
  getAuthors(limit: number = 10) {
    return this.afs.collection(this.authorsCollection, ref =>
      ref.limit(limit)
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        return data;
      });
    })
    );

  }

}