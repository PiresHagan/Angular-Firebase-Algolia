import { Component, OnInit, Input } from '@angular/core';
import { CompanyService } from 'src/app/shared/services/company.service';

@Component({
  selector: 'app-company-follower-list',
  templateUrl: './company-follower-list.component.html',
  styleUrls: ['./company-follower-list.component.scss']
})
export class CompanyFollowerListComponent implements OnInit {

  @Input() companyId: string;

  followers: any = [];
  loadingMoreFollowers: boolean = false;
  lastVisibleFollower;

  constructor(
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.getcompanyFollowers();
  }

  getcompanyFollowers() {
    this.companyService.getFollowers(this.companyId, 14, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;
      this.followers = data.followers;
      this.lastVisibleFollower = data.lastVisible;
    });
  }

  loadMoreFollowers(action = "next") {
    this.loadingMoreFollowers = true;
    this.companyService.getFollowers(this.companyId, 14, action, this.lastVisibleFollower).subscribe((data) => {
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
