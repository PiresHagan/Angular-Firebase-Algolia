import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, take, mergeAll } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MessagingService } from "./messaging.service";
import { AnalyticsService } from "./analytics/analytics.service";
import { of } from "rxjs";
import { Member } from "../interfaces/member.type";
import { AngularFireStorage } from "@angular/fire/storage";
import { Group } from "../interfaces/group.type";
import { Event } from "../interFaces/event.type";
import { GroupConstant } from "../constants/group-constants";


@Injectable({
  providedIn: "root",
})
export class GroupsService {
  groupsCollection: string = "groups";
  groupController: string = "groups";
  eventHostController: string = "hostevents";
  commentsCollection: string = "comments";
  membersCollection: string = "members";
  subscriptionsCollection: string = "event-subscription";
  loggedInUser;
  private basePath = "/groups/";

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private http: HttpClient,
    private messagingService: MessagingService,
    private analyticsService: AnalyticsService,
    private storage: AngularFireStorage
  ) {
    /*
    this.afAuth.authState.subscribe((user) => {
        if (!user || !user.emailVerified) {
            if (environment && environment.isAnonymousUserEnabled) {
                this.afAuth.signInAnonymously().catch(function () {
                    console.log('anonymusly login');
                });
            }
        } else {
            this.loggedInUser = user;
        }
    });
    */
  }

  addNewGroup(eventData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          environment.baseAPIDomain + `/api/v1/${this.groupController}`,
          eventData
        )
        .subscribe(
          (result) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  getMemberBySkype(contact: string) {
    return this.db
      .collection<Member>(`${this.membersCollection}`, (ref) =>
        ref
          .where("skype", "==", contact)
          // .where('account_status','==','verified')
          .limit(1)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getMemberByWhatsapp(contact: string) {
    return this.db
      .collection<Member>(`${this.membersCollection}`, (ref) =>
        ref
          .where("whatsapp", "==", contact)
          // .where('account_status','==','verified')
          .limit(1)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
  getMemberByEmail(contact: string) {
    // contact is skype, whatsapp or email
    return this.db
      .collection<Member>(`${this.membersCollection}`, (ref) =>
        ref
          .where("email", "==", contact)
          // .where('account_status','==','verified')
          .limit(1)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
  getMemberByFullname(fullname: string){
    return this.db
    .collection<Member>(`${this.membersCollection}`, (ref) =>
      ref
        .where("fullname", "==", fullname)
        .limit(1)
    )
    .snapshotChanges()
    .pipe(
      take(1),
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  // get event based on its slug and type
  getgroupsByUser(userId: string) {
    return this.db
      .collection<Group>(`${this.groupsCollection}`, (ref) =>
        ref.where("MemberIds", "array-contains", userId)
      )
      .snapshotChanges()
      .pipe(
        take(100),
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
  getgroupsByUserAndEventGroup(
    userId: string,
    group_type: number,
    group_size: number,
    host_fee : number
  ) {
    return this.db
      .collection<Group>(`${this.groupsCollection}`, (ref) =>
        ref
          .where("MemberIds", "array-contains", userId)
          .where("group_type", "==", group_type)
          .where("group_size", "==", group_size)
          .where("subscription",">=",host_fee/10)
      )
      .snapshotChanges()
      .pipe(
        take(100),
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
  getGroupsBySearch(
    limit: number = 10,
    navigation: string = "first",
    lastVisible = null,
    searchfield: string,
    value: any
  ) {
    if (!limit) {
      limit = 10;
    }

    let dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
      ref
        .where("group_name", ">=", value)
        .where("group_name", "<=", value + '~')
        .orderBy("group_name")
        .orderBy("created_at", "desc")
        .limit(limit)
    );

    if (searchfield === "type")
      dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
        ref
          .where("group_type", "==", value)
          .orderBy("created_at", "desc")
          .limit(limit)
      );
    else if (searchfield == "size")
      dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
        ref
          .where("group_size", "==", value)
          .orderBy("created_at", "desc")
          .limit(limit)
      );
    else if (searchfield == "subscription")
      dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
        ref
          .where("subscription", "==", value)
          .orderBy("created_at", "desc")
          .limit(limit)
      );


    switch (navigation) {
      case "next":
        if (searchfield === "name")
          dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
            ref
              .where("group_name", ">=", value)
              .where("group_name", "<=", value + '~')
              .orderBy("group_name")
              .orderBy("created_at", "desc")
              .limit(limit)
              .startAfter(lastVisible)
          );
        if (searchfield === "type")
          dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
            ref
              .where("group_type", "==", value)
              .orderBy("created_at", "desc")
              .limit(limit)
              .startAfter(lastVisible)
          );
        if (searchfield === "subscription")
        dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
        ref
          .where("subscription", "==", value)
          .orderBy("created_at", "desc")
          .limit(limit)
          .startAfter(lastVisible)
      );
        else {
          dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
            ref
              .where("group_size", "==", value)
              .orderBy("created_at", "desc")
              .limit(limit)
              .startAfter(lastVisible)
          );
        }

        break;
    }
    return dataQuery.snapshotChanges().pipe(
      map((actions) => {
        return {
          groupsList: actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          }),
          lastVisible:
            actions && actions.length < limit
              ? null
              : actions[actions.length - 1].payload.doc,
        };
      })
    );
  }
  getAllGroups(
    limit: number = 8,
    navigation: string = "first",
    lastVisible = null
  ) {
    let dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
      ref
        .orderBy("created_at", "desc")
        .limit(limit)
    );

    switch (navigation) {
      case "next":
        dataQuery = this.db.collection(`${this.groupsCollection}`, (ref) =>
          ref
            .orderBy("created_at", "desc")
            .limit(limit)
            .startAfter(lastVisible)
        );

        break;
    }
    return dataQuery.snapshotChanges().pipe(
      map((actions) => {
        return {
          groups: actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          }),
          lastVisible:
            actions && actions.length < limit
              ? null
              : actions[actions.length - 1].payload.doc,
        };
      })
    );
  }
  getGroupsByName(name) {
    let groups;
    const $name = this.db
      .collection<Group>(`${this.groupsCollection}`)
      .valueChanges();
    $name.subscribe((groupsList) => {
      // find the user
      const groupsFound = groupsList.find((group) =>
        group.group_name.includes(name)
      );
      groups = groupsFound;
    });

    // return the found user as an observable, if nothing is found, the observable is gonna contain undefined
    return of(groups);
  }
  getGroupBySlugNoType(eventSlug: string) {
    return this.db
      .collection<Group>(`${this.groupsCollection}`, (ref) =>
        ref.where("group_slug", "==", eventSlug).limit(1)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }
  getGroupComments(groupId: string, limit: number = 5) {
    return this.db
      .collection(this.groupsCollection)
      .doc(groupId)
      .collection(`${this.commentsCollection}`, (ref) =>
        ref.orderBy("published_on", "desc").limit(limit)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return {
            commentList: actions.map((a) => {
              const data: any = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            }),
            lastCommentDoc:
              actions && actions.length < limit
                ? null
                : actions[actions.length - 1].payload.doc,
          };
        })
      );
  }
  /**
   * Create  event comment
   *
   * @param articleId
   * @param commentDtails
   */
  createGroupComment(groupId: string, commentDtails: Comment) {
    return this.http.post(
      environment.baseAPIDomain + "/api/v1/groups/" + groupId + "/comments",
      commentDtails
    );
  }

  /**
   * Update existing comment.
   *
   * @param groupId
   * @param commentid
   * @param commentDtails
   */
  updateGroupComment(
    groupId: string,
    commentid: string,
    commentDtails: Comment
  ) {
    return this.http.put(
      environment.baseAPIDomain +
      "/api/v1/groups/" +
      groupId +
      "/comments/" +
      commentid,
      commentDtails
    );
    // return this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`).doc(commentid).set(commentDtails)
  }
  getGroupCommentNextPage(groupId: string, limit: number = 5, lastCommentDoc) {
    if (!limit) {
      limit = 5;
    }
  }

  creategroupSubscription(
    groupId: string,
    postData: { packageId: string; paymentMethodId: string }
  ) {
    return this.http.post(
      environment.baseAPIDomain +
      `/api/v1/payment/companies/${groupId}/subscriptions`,
      postData
    );
  }

  updategroupSubscription(
    groupId: string,
    subscriptionId: string,
    postData: { packageId: string; paymentMethodId: string }
  ) {
    return this.http.put(
      environment.baseAPIDomain +
      `/api/v1/payment/companies/${groupId}/subscriptions/${subscriptionId}`,
      postData
    );
  }

  cancelGroupSubscription(groupID: string, subscriptionId: string) {
    return this.http.delete(
      environment.baseAPIDomain +
      `/api/v1/payment/companies/${groupID}/subscriptions/${subscriptionId}`
    );
  }
  isGroupOwner(group, currentUser) {
    if (group.owner.id == currentUser.id)
      return true;
    else
      return false;
  }
  /*
  getCategoryRow(event_type: string, limit: number, afterId?: string) {
    const startAfter = afterId
      ? this.getEvent(afterId, true).pipe(map((a) => a[0].__doc))
      : of(null);

    return startAfter.pipe(
      map((__doc) => {
        return this.db
          .collection<Event[]>(this.groupsCollection, (refV) => {
            let ref = refV
              .where("event_type", "==", event_type)
              // .where('lang', '==', lang)
              //.where('status', '==', ACTIVE)
              // .orderBy('published_at', 'desc')
              .limit(limit);

            if (__doc) ref = ref.startAfter(__doc);
            return ref;
          })
          .snapshotChanges();
      }),
      mergeAll(),
      map((actions) => {
        const res = actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });

        return res;
      })
    );
  }
  
  getEvent(slug: string, addRef?: boolean) {
    return this.db
      .collection<Event>(this.groupsCollection, (ref) =>
        ref
          .where("slug", "==", slug)
          // .where('status', "==", ACTIVE)
          .limit(1)
      )
      .snapshotChanges()
      .pipe(
        take(1),
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            const img = data.cover?.url ? data.cover?.url : "";
            if (img)
              data.cover.url = img.replace(
                "https://mytrendingstories.com",
                "https://assets.mytrendingstories.com"
              );
            return { id, ...data, __doc: addRef ? a.payload.doc : undefined };
          });
        })
      );
  }
*/
  addImage(file: string, fileName: string) {
    return new Promise((resolve, reject) => {
      this.storage
        .ref(`${this.basePath}/${fileName}`)
        .putString(file, "data_url")
        .then((snapshot) => {
          snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              const imageUrl: string = downloadURL;
              resolve({ url: downloadURL, alt: fileName });
            })
            .catch((err) => reject(err));
        })
        .catch((error) => {
          console.error(error);
          reject();
        });
    });
  }
  // 
  createGroupSubscription(groupId: string, postData: { external_id: string, paymentMethodId: string, package_type: string }) {
    return this.http.post(environment.baseAPIDomain + `/api/v1/${this.groupController}` + `/${groupId}/subscriptions`, postData)
  }

  updateGroupPackageSubscription(groupId: string, subscriptionId: string, postData: { external_id: string, paymentMethodId: string, package_type: string }) {
    return this.http.put(environment.baseAPIDomain + `/api/v1/${this.groupController}` + `/${groupId}/subscriptions/${subscriptionId}`, postData)
  }

  cancelGroupPackageSubscription(groupId: string, subscriptionId: string) {
    return this.http.delete(environment.baseAPIDomain + `/api/v1/${this.groupController}` + `/${groupId}/subscriptions/${subscriptionId}`)
  }
  updateBilling(creatorGroupId: string) {
    return this.http.post(environment.baseAPIDomain + `/api/v1/${this.eventHostController}` + `/sessions/${creatorGroupId}/customer`, {
      redirectUrl: window && window.location && window.location.href || '',
    })
  }

  getPaymentMethod(creatorGroupId: string) {
    return this.http.get(environment.baseAPIDomain + `/api/v1/${this.eventHostController}` + `/${creatorGroupId}/methods`)
  }
  getGroupSubscription(creatorCustomerId: string, groupId: string) {
    let dataQuery = this.db.collection(`${this.subscriptionsCollection}`, ref => ref
      .where("customer_id", "==", creatorCustomerId)
      .where("status", "==", GroupConstant.STATUS_ACTIVE)
      .where("group_id","==", groupId)
    );
    return dataQuery.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data: any = a.payload.doc.data();
        return data;
      })
    }));
  }
   getEventFirstGroupJoined(userId : string, group: Group){
    try{
    const eventsCollection = "events";
    // who can rate are members of groups work in an event and the host of the event
    // get all events where the joined as first group


    // get all events where they joined as second group
    
      let dataQuery = this.db.collection<Event>(`${eventsCollection}`, (ref) =>
    ref
      .where("second_joind_group.id","==",group.id)
    //  .where("first_joind_group.MemberIds", "array-contains", userId)
     
  );
  return  dataQuery.snapshotChanges().pipe(
    map((actions) => {
      return {
        eventList: actions.map((a) => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { ...data };
        })
      };
    })
  );

  }
  catch(e){
    console.error(e);
  }
   }
  
   getEventSecondGroupJoined(userId : string, group: Group){
    try{
    const eventsCollection = "events";
    // who can rate are members of groups work in an event and the host of the event
    // get all events where the joined as first group


    // get all events where they joined as second group
    
      let dataQuery = this.db.collection(`${eventsCollection}`, (ref) =>
    ref
      .where("second_joind_group.MemberIds", "array-contains", userId)
      .where("first_joind_group.id", "==", group.id)
  );
  return  dataQuery.snapshotChanges().pipe(
    map((actions) => {
      return {
        eventList: actions.map((a) => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {...data };
        })
      };
    })
  );

  }
  catch(e){
    console.error(e);
  }
   }

   deleteGroupComment(areticleId:string, commentId:string){
    return this.http.delete(
      environment.baseAPIDomain +
        "/api/v1/groups/" +
        areticleId +
        "/comments/" +
        commentId
    );
   }
 }
