import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { map, take, mergeAll } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Event } from "../interfaces/event.type";
import { environment } from "src/environments/environment";
import { AngularFireStorage } from "@angular/fire/storage";
import { of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  eventsCollection: string = "events";
  commentsCollection: string = "comments";
  funnelsCollection: string = "funnels";
  topicsCollection: string = "topics";

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private http: HttpClient,
    private storage: AngularFireStorage
  ) {}

  getEventsByType(
    limit: number = 10,
    navigation: string = "first",
    lastVisible = null,
    eventType: string = null
  ) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(`${this.eventsCollection}`, (ref) =>
      ref
        //.where("category.slug", "==", categorySlug)
        //.where("lang", "==", lang)
        .where("event_type", "==", eventType)
        .orderBy("published_at", "desc")
        .limit(limit)
    );

    switch (navigation) {
      case "next":
        dataQuery = this.db.collection(`${this.eventsCollection}`, (ref) =>
          ref
            //.where("category.slug", "==", categorySlug)
            //.where("lang", "==", lang)
            .where("event_type", "==", eventType)
            .orderBy("published_at", "desc")
            .limit(limit)
            .startAfter(lastVisible)
        );

        break;
    }
    return dataQuery.snapshotChanges().pipe(
      map((actions) => {
        return {
          articleList: actions.map((a) => {
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

  getEventsByTypeSearch(
    limit: number = 10,
    navigation: string = "first",
    lastVisible = null,
    eventType: string = null,
    location,
    searchValue: string,
    searchValueCity: string
  ) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery: AngularFirestoreCollection<unknown>;
    if (location) {
      dataQuery = this.db.collection(`${this.eventsCollection}`, (ref) =>
        ref
          //.where("category.slug", "==", categorySlug)
          //.where("lang", "==", lang)
          .where("event_type", "==", eventType)
          .where("country", "==", searchValue)
          .where("city", "==", searchValueCity)
          .orderBy("published_at", "desc")
          .limit(limit)
      );
    } else {
      dataQuery = this.db.collection(`${this.eventsCollection}`, (ref) =>
        ref
          //.where("category.slug", "==", categorySlug)
          //.where("lang", "==", lang)
          
          .where("event_type", "==", eventType)
          //.where("event_name", "==", searchValue)
          .where("event_name", ">=", searchValue)
          .where("event_name", "<=", searchValue + '~')
          .orderBy("event_name")
          .orderBy("published_at", "desc")
          .limit(limit)
      );
    }
    switch (navigation) {
      case "next":
        if (location) {
          dataQuery = this.db.collection(`${this.eventsCollection}`, (ref) =>
            ref
              //.where("category.slug", "==", categorySlug)
              //.where("lang", "==", lang)
              .where("event_type", "==", eventType)
              .where("country", "==", searchValue)
              .where("city", "==", searchValueCity)
              .orderBy("published_at", "desc")
              .limit(limit)
              .startAfter(lastVisible)
          );
        } else {
         dataQuery = this.db.collection(`${this.eventsCollection}`, (ref) =>
            ref
              //.where("category.slug", "==", categorySlug)
              //.where("lang", "==", lang)
              .where("event_type", "==", eventType)
              .orderBy("published_at", "desc")

              .where("event_name", ">=", searchValue)
              .where("event_name", "<=", searchValue + '~')
              .orderBy("event_name")
              .limit(limit)
              .startAfter(lastVisible)
          );
        }
        break;
    }
    return dataQuery.snapshotChanges().pipe(
      map((actions) => {
        return {
          articleList: actions.map((a) => {
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
  getMyEventsAsHost(userId, eventType){
    // here either user is a host or member on the groups of the events
    // let's check for host
    // get all events whose owner is the userId
    let dataQuery = this.db.collection(`${this.eventsCollection}`, (ref) =>
    ref
      .where("event_type", "==", eventType)
      .where("host.owner","==",userId)
      .orderBy("published_at", "desc")
  );
  return dataQuery.snapshotChanges().pipe(
    map((actions) => {
      return {
        eventList: actions.map((a) => {
          const data: any = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      };
    })
  );
  }
  getMyEventsAsMember(userId, eventType){
    // whether fist group or second group
  }
  getSimilarEventsByType(
    limit: number = 10,
    navigation: string = "first",
    lastVisible = null,
    eventType: string = null,
    event_id: string
  ) {
    if (!limit) {
      limit = 10;
    }
    let dataQuery = this.db.collection(`${this.eventsCollection}`, (ref) =>
      ref
        //.where("category.slug", "==", categorySlug)
        //.where("lang", "==", lang)
        .where("event_type", "==", eventType)
        .where("id", "!=", event_id)
        .orderBy("id", "desc")
        .orderBy("published_at", "desc")
        .limit(limit)
    );

    switch (navigation) {
      case "next":
        dataQuery = this.db.collection(`${this.eventsCollection}`, (ref) =>
          ref
            //.where("category.slug", "==", categorySlug)
            //.where("lang", "==", lang)
            .where("event_type", "==", eventType)
            .orderBy("published_at", "desc")
            .limit(limit)
            .startAfter(lastVisible)
        );

        break;
    }
    return dataQuery.snapshotChanges().pipe(
      map((actions) => {
        return {
          articleList: actions.map((a) => {
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
  updateEvent(eventId: string, eventDetails) {
    console.log('event',JSON.stringify(eventDetails));
    return this.http.put(
      environment.baseAPIDomain + "/api/v1/hostevents/" + eventId,
      eventDetails
    );
  }
  JoinEvent(eventId: string, eventDetails) {
    return this.http.put(
      environment.baseAPIDomain + "/api/v1/hostevents/" + eventId+"/join",
      eventDetails
    );
  }
  // get event based on its slug and type
  getEventsBySlug(eventType: string, eventSlug: string) {
    console.log(eventType, eventSlug);
    return this.db
      .collection<Event>(`${this.eventsCollection}`, (ref) =>
        ref
          .where("event_slug", "==", eventSlug)
          .where("event_type", "==", eventType)
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
  getEventBySlugNoType(eventSlug: string) {
    return this.db
      .collection<Event>(`${this.eventsCollection}`, (ref) =>
        ref.where("event_slug", "==", eventSlug).limit(1)
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
  getEventComments(eventId: string, limit: number = 5) {
    return this.db
      .collection(this.eventsCollection)
      .doc(eventId)
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

  createEventComment(articleId: string, commentDtails: Comment) {
    return this.http.post(
      environment.baseAPIDomain +
        "/api/v1/hostevents/" +
        articleId +
        "/comments",
      commentDtails
    );
  }
  /**
   * Update existing comment.
   *
   * @param articleId
   * @param commentid
   * @param commentDtails
   */
  updateEventComment(
    articleId: string,
    commentid: string,
    commentDtails: Comment
  ) {
    return this.http.put(
      environment.baseAPIDomain +
        "/api/v1/hostevents/" +
        articleId +
        "/comments/" +
        commentid,
      commentDtails
    );
    // return this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`).doc(commentid).set(commentDtails)
  }
   /**
   * like existing comment.
   *
   * @param articleId
   * @param commentid
   * @param commentDtails
   * @param like/dislike 1/0
   */
   LikeEventComment(
    articleId: string,
    commentid: string,
    commentDtails: Comment,
    isLike: string
  ) {
    return this.http.put(
      environment.baseAPIDomain +
        "/api/v1/hostevents/" +
        articleId +
        "/comments/" +
        commentid+"/"+
        isLike,
      commentDtails
    );
    // return this.db.collection(`${this.articleCollection}/${articleId}/${this.articleCommentsCollection}`).doc(commentid).set(commentDtails)
  }
  getEventCommentNextPage(
    articleId: string,
    limit: number = 5,
    lastCommentDoc
  ) {
    if (!limit) {
      limit = 5;
    }
  }

  getCategoryRow(event_type: string, limit: number, afterId?: string) {
    const startAfter = afterId
      ? this.getEvent(afterId, true).pipe(map((a) => a[0].__doc))
      : of(null);

    return startAfter.pipe(
      map((__doc) => {
        return this.db
          .collection<Event[]>(this.eventsCollection, (refV) => {
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
      .collection<Event>(this.eventsCollection, (ref) =>
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
}
