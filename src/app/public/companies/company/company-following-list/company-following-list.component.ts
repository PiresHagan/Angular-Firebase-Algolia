import { Component, OnInit } from '@angular/core';
import { AuthorService } from 'src/app/shared/services/author.service';


import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-company-following-list',
  templateUrl: './company-following-list.component.html',
  styleUrls: ['./company-following-list.component.scss']
})
export class CompanyFollowingListComponent implements OnInit {
  subscribers: any = [];
  loadingMoreFollowings: boolean = false;
  lastVisibleFollowing;
  lastVisibleFollower;
  authorDetails: any = {};
  rss = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService,
  ) { }

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      if (params.get('authorSlug')) {
        this.router.navigate(['/', params.get('authorSlug')]);
        return;
      }

      const slug = params.get('slug');
     

      this.rss = `?member=${slug}`;

      this.authorService.getUserBySlug(slug).subscribe(author => {
        this.authorDetails = author;
        this.subscribers = [];
        this.getFollowingDetails();
      });
    });
  }
  getFollowingDetails() {
    // this.authorService.getFollowings(this.authorDetails.id).subscribe((following) => {
    //   this.subscribers = following;
    // })
    this.loadingMoreFollowings = true;
    this.authorService.getFollowings_new(this.authorDetails.id, 14, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowings = false;
      this.subscribers = data.followings
      this.lastVisibleFollowing = data.lastVisible;
    });
  }
}
