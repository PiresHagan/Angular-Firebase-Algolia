import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../shared/services/company.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-followers',
  templateUrl: './company-followers.component.html',
  styleUrls: ['./company-followers.component.scss']
})
export class CompanyFollowersComponent implements OnInit {
  loadingMoreFollowers = false;
  lastVisibleFollower;
  followers = [];
  constructor(private companyService: CompanyService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getFollowers();
  }

  getFollowers() {
    let companyId = this.activatedRoute.snapshot.queryParams["company"];
    if (!companyId)
      return;
    this.companyService.getComanyFollowers(companyId, 5, null, this.lastVisibleFollower).subscribe((data) => {
      this.loadingMoreFollowers = false;

      this.followers = data.followers;

      this.lastVisibleFollower = data.lastVisible;
    });
  }
  loadMoreFollowers(action = "next") {
    let companyId = this.activatedRoute.snapshot.queryParams["company"];
    if (!companyId)
      return;
    this.loadingMoreFollowers = true;
    this.companyService.getComanyFollowers(companyId, 5, action, this.lastVisibleFollower).subscribe((data) => {
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
