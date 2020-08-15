import { Component, OnInit } from '@angular/core';
import { CharityService } from '../../shared/services/charity.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-charity-followers',
  templateUrl: './charity-followers.component.html',
  styleUrls: ['./charity-followers.component.scss']
})
export class CharityFollowersComponent implements OnInit {
  loadingMoreFollowers = false;
  lastVisibleFollower;
  followers = [];
  constructor(private charityService: CharityService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getFollowers();
  }

  getFollowers() {
    let charityId = this.activatedRoute.snapshot.queryParams["charity"];
    if (!charityId)
      return;
    this.charityService.getCharityFollowers(charityId, 5, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;

      this.followers = data.followers;

      this.lastVisibleFollower = data.lastVisible;
    });
  }
  loadMoreFollowers(action = "next") {
    let charityId = this.activatedRoute.snapshot.queryParams["charity"];
    if (!charityId)
      return;
    this.loadingMoreFollowers = true;
    this.charityService.getCharityFollowers(charityId, 5, action, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;
      let mergedData: any = [...this.followers, ...data.followers]
      this.followers = this.getDistinctArray(mergedData)
      this.lastVisibleFollower = data.lastVisible;
    });
  }
  getDistinctArray(data) {
    var resArr = [];
    data.filter(function (item) {
      var i = resArr.findIndex(x => x.id == item.id);
      if (i <= -1) {
        resArr.push(item);
      }
      return null;
    });
    return resArr;
  }

}
