import { Component, OnInit, Input } from '@angular/core';
import { FundraiserService } from 'src/app/shared/services/fundraiser.service';

@Component({
  selector: 'app-fundraiser-follower-list',
  templateUrl: './fundraiser-follower-list.component.html',
  styleUrls: ['./fundraiser-follower-list.component.scss']
})
export class FundraiserFollowerListComponent implements OnInit {

  @Input() fundraiserId: string;

  followers: any = [];
  loadingMoreFollowers: boolean = false;
  lastVisibleFollower;

  constructor(
    private fundraiserService: FundraiserService
  ) { }

  ngOnInit(): void {
    this.getfundraiserFollowers();
  }

  getfundraiserFollowers() {
    this.fundraiserService.getFollowers(this.fundraiserId, 14, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;
      this.followers = data.followers;
      this.lastVisibleFollower = data.lastVisible;
    });
  }

  loadMoreFollowers(action = "next") {
    this.loadingMoreFollowers = true;
    this.fundraiserService.getFollowers(this.fundraiserId, 14, action, this.lastVisibleFollower).subscribe((data) => {
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
      latestURL = latestURL.replace('http://cdn.mytrendingstories.com/', 'https://cdn.mytrendingstories.com/')
        .replace('https://abc2020new.com/', 'https://assets.mytrendingstories.com/');
    }
    return latestURL;
  }

}
