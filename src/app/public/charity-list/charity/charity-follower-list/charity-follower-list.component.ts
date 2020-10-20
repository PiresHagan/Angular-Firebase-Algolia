import { Component, Input, OnInit } from '@angular/core';
import { CharityService } from 'src/app/shared/services/charity.service';

@Component({
  selector: 'app-charity-follower-list',
  templateUrl: './charity-follower-list.component.html',
  styleUrls: ['./charity-follower-list.component.scss']
})
export class CharityFollowerListComponent implements OnInit {

  @Input() charityId: string;

  followers: any = [];
  loadingMoreFollowers: boolean = false;
  lastVisibleFollower;

  constructor(
    private charityService: CharityService
  ) { }

  ngOnInit(): void {
    this.getCharityFollowers();
  }

  getCharityFollowers() {
    this.charityService.getFollowers(this.charityId, 14, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;
      this.followers = data.followers;
      this.lastVisibleFollower = data.lastVisible;
    });
  }

  loadMoreFollowers(action = "next") {
    this.loadingMoreFollowers = true;
    this.charityService.getFollowers(this.charityId, 14, action, this.lastVisibleFollower).subscribe((data) => {
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


  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('https://cdn.mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('https://abc2020new.com/', "https://assets.mytrendingstories.com/");
    }
    return latestURL;
  }

}
