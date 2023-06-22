import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/shared/services/language.service";
import { SeoService } from "src/app/shared/services/seo/seo.service";
import { AnalyticsService } from "src/app/shared/services/analytics/analytics.service";
import { AuthService } from "src/app/shared/services/authentication.service";

import { Group } from "src/app/shared/interfaces/group.type";
import { GroupsService } from "src/app/shared/services/group.service";
@Component({
  selector: "app-group-details",
  templateUrl: "./group-details.component.html",
  styleUrls: ["./group-details.component.scss"],
})
export class GroupDetailsComponent implements OnInit {
  loading: boolean = true;
  group: Group;
  userDetails;
  canChangeSubscription:boolean = false;
  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    public authService: AuthService,
    public groupService: GroupsService,
    private router: Router,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    // get group by slug
    this.loading=true;
    this.setUserDetails();
    this.route.paramMap.subscribe((params) => {
      // const eventType = params.get('eventType')
      const slug = params.get("group_slug");
      this.groupService.getGroupBySlugNoType(slug).subscribe((group) => {
        this.group = group[0];
        this.loading = false;
        if (!this.group) {
          this.modal.error({
            nzTitle: this.translate.instant("URL404"),
            nzContent: this.translate.instant("URLNotFound"),
            nzOnOk: () => this.router.navigate(["/"]),
          });
          return;
        }
        // get current user
        // get all events of eventType
        // this.getHostDetails();
      });
    });
  }
  async setUserDetails() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user) {
        this.userDetails = null;
        // this.isLoggedInUser = false
      }
      this.userDetails = await this.authService.getLoggedInUserDetails();
      this.canChangeSubscription = this.groupService.isGroupOwner(this.group, this.userDetails);
    });
  }
  getCoverImage() {
    return "assets/images/groups/cov.jpg";
  }
}
