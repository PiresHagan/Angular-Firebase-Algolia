import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Job } from '../interfaces/job.type';
import { environment } from 'src/environments/environment';
import { Contact } from '../interfaces/contact.type';


interface Plan {
  planId: string;
  planExternal_id: string;
  planName: string;
  planDescription: string;
  planPricing: string;
  limit: string;
  subTitle: string;
  includesItem1: string;
  includesItem2: string;
  excludeItem1: string;
  excludeItem2: string;
}


@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private subscriptionsCollection = 'subscriptions';
  private jobsCollection = 'jobs';
  private jobPackageCollection = 'jobPackages';
  private memberCollection: string = 'members';
  private followersSubCollection = 'followers';

  constructor(
    private http: HttpClient,
    private db: AngularFirestore
  ) { }


  getAllJobs() {
    return this.db.collection<Job[]>(this.jobsCollection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAllJobPackages() {
    return this.db.collection<Plan[]>(this.jobPackageCollection).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }


  getJobById(id: string) {
    return this.db.collection<Job>(this.jobsCollection, ref => ref
      .where('id', '==', id)
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

  planValues = {
    Basic: 1,
    Silver: 2,
    Gold: 4,
    Platinum: 8,
  };

  calculateBoostedValueRating(job) {
    if (!job.plan || !this.planValues[job.plan.planName]) {
        return job.defaultProbability * this.planValues['Basic'];
    }
    return job.defaultProbability * this.planValues[job.plan.planName];
}


   reduceDefaultProbability(job, reductionAmount) {
    job.defaultProbability -= reductionAmount;
    if (job.defaultProbability < 0) {
      job.defaultProbability = 0;
    }
  }

  calculateValueRating(job) {
    if (!job.plan) {
        return 0;
    }
    return this.planValues[job.plan.planName] * job.defaultProbability;
}

   sortJobsByValueRating(jobs) {
    return jobs.sort((a, b) => this.calculateValueRating(b) - this.calculateValueRating(a));
  }


   randomizeJobsSubset(jobs, subsetSize) {
    const shuffledJobs = [...jobs];
    for (let i = shuffledJobs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledJobs[i], shuffledJobs[j]] = [shuffledJobs[j], shuffledJobs[i]];
    }
    return shuffledJobs.slice(0, subsetSize);
  }

  getBoostedJobs(jobs, boostingPlans) {

    const jobToInteractWith = jobs[0];
    const reductionAmount = 10;
    this.reduceDefaultProbability(jobToInteractWith, reductionAmount);

    const jobsWithRating = jobs.map(job => ({
      ...job,
      valueRating: this.calculateBoostedValueRating(job),
    }));

    const sortedJobs = this.sortJobsByValueRating(jobsWithRating);
    const sortedJobsWithPlansFirst = sortedJobs.sort((a, b) => {
      if (a.plan && !b.plan) return -1;
      if (!a.plan && b.plan) return 1;
      return 0;
    });

    return sortedJobsWithPlansFirst;
  }

  createContact(jobId: string, contact: Contact) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.baseAPIDomain + '/api/v1/jobs/' + jobId + "/contact", contact).subscribe((jobData) => {
        resolve(jobData)
      }, (error) => {
        reject(error)
      })
    })


  }



}
