import { Component, OnInit, ViewChild } from "@angular/core";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/shared/services/language.service";
import { SeoService } from "src/app/shared/services/seo/seo.service";
import { AnalyticsService } from "src/app/shared/services/analytics/analytics.service";
import { UserService } from "src/app/shared/services/user.service";
import { AuthService } from "src/app/shared/services/authentication.service";
import { User } from "src/app/shared/interfaces/user.type";
import { EventHostConstant } from "src/app/shared/constants/event-host-constants";
import { EventsService } from "src/app/shared/services/events.services";
import { Event } from "src/app/shared/interfaces/event.type";
import { AuthorService } from "src/app/shared/services/author.service";
import { Author } from "src/app/shared/interfaces/authors.type";
import { json } from "express";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GroupsService } from "src/app/shared/services/group.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { HostBillingComponent } from "../host-billing/host-billing.component";


@Component({
  selector: "app-booking-event",
  templateUrl: "./booking-event.component.html",
  styleUrls: ["./booking-event.component.scss"],
})
export class BookingEventComponent implements OnInit {
  event: Event = null;
  joinEventGroup: FormGroup;
  userDetails: User;
  isLoggedInUser: boolean = false;
  isFormSaving: boolean = false;
  host;
  host_fee;
  groupList = [];
  event_groups = [];
  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private languageService: LanguageService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    public authService: AuthService,
    public eventsService: EventsService,
    private router: Router,
    private modal: NzModalService,
    public authorService: AuthorService,
    private fb: FormBuilder,
    public groupService: GroupsService,
    private message: NzMessageService,
  ) { }

  createForm() {
    this.joinEventGroup = this.fb.group({
      group_type: ["", [Validators.required]],
      joined_group: [null, [Validators.required]],
    });
  }
  getHostDetails() {
    this.authorService.getAuthorById(this.event.owner.id).subscribe((host) => {
      this.host = host[0];
    });
  }
  async setUserDetails() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user) {
        this.userDetails = null;
        this.isLoggedInUser = false;

        this.modal.error({
          nzTitle: this.translate.instant("URL404"),
          nzContent: this.translate.instant("URLNotFound"),
          nzOnOk: () => this.router.navigate(["/"]),
        });
        return;
      }
      this.userDetails = await this.authService.getLoggedInUserDetails();
    });
  }
  ngOnInit(): void {
    //get the event from event slug
    this.route.paramMap.subscribe((params) => {
      const slug = params.get("eventslug");
      this.eventsService.getEventBySlugNoType(slug).subscribe((event) => {
        this.event = event[0];
        if (!this.event) {
          this.modal.error({
            nzTitle: this.translate.instant("URL404"),
            nzContent: this.translate.instant("URLNotFound"),
            nzOnOk: () => this.router.navigate(["/"]),
          });
          return;
        }
        // get all events of eventType
        // fill the drop down list options of first or second group

        // fill a select box with groups maps the criteria of selected options
        // no match - create a new group

        //
        this.createForm();
        this.getHostDetails();
        this.setUserDetails();
        this.host_fee= this.event.host_fee;
        if (!this.event.first_joind_group) {
          this.event_groups.push({
            'label': this.translate.instant('FirstGroup') + ' - ' + this.event.first_group_type + ' (' + this.event.first_group_size + ')',
            'value': 0,
            'type': this.event.first_group_type,
            'size': this.event.second_group_size
          })
        }
        if (!this.event.second_joind_group) {
          this.event_groups.push({
            'label': this.translate.instant('SecondGroup') + ' - ' + this.event.second_group_type + ' (' + this.event.second_group_size + ')',
            'value': 1,
            'type': this.event.second_group_type,
            'size': this.event.second_group_size
          })
        }
      });
    });
  }
  replaceImage(url) {
    let latestURL = url;
    if (url) {
      latestURL = latestURL
        .replace(
          "https://mytrendingstories.com/",
          "https://assets.mytrendingstories.com/"
        )
        .replace(
          "http://cdn.mytrendingstories.com/",
          "https://cdn.mytrendingstories.com/"
        )
        .replace(
          "https://abc2020new.com/",
          "https://assets.mytrendingstories.com/"
        );
    }
    return latestURL;
  }
  getGroupByCriteria(group_type, group_size, host_fee) {
    if (this.userDetails) {
      this.isLoggedInUser = true;
      this.groupService.getgroupsByUserAndEventGroup(this.userDetails.id, group_type, group_size,host_fee).subscribe((data) => {
        this.groupList = data;
        // this.groupSize = this.groupList.length
      });
    } else {
      this.userDetails = null;
      this.isLoggedInUser = false;
    }
  }
  onGroupTypeChange(value) {
    if (value == 1) {
      this.getGroupByCriteria(this.event.second_group_type, this.event.second_group_size, this.host_fee);

    }
    else {
      this.getGroupByCriteria(this.event.first_group_type, this.event.first_group_size,this.host_fee);

    }
  }
  book() {
    
      this.isFormSaving = true;
      // get value of the form
      for (const i in this.joinEventGroup.controls) {
        this.joinEventGroup.controls[i].markAsDirty();
        this.joinEventGroup.controls[i].updateValueAndValidity();
      }
      if (this.joinEventGroup.valid) {
        let siteData = JSON.parse(JSON.stringify(this.joinEventGroup.value));
        const group_joined = this.groupList.find((obj) => {
          return obj.id === siteData['joined_group'];
        });
        let data = {};
        if (siteData['group_type'] == 0) {

          data['first_joind_group'] = group_joined;
          data['first_joined_group_date'] = new Date().toISOString();
  
        }
        else {
          data['second_joind_group'] = group_joined;
          data['second_joined_group_date'] = new Date().toISOString();
        }
        let postData= {};
        postData['event'] = data;
       
        // update the event
        this.eventsService.JoinEvent(this.event.id, postData).subscribe(({ }) => {
          this.isFormSaving = false;
          this.router.navigateByUrl("/event-hosting/" + this.event.event_type + "/" + this.event.event_slug);
        });
      
    }
  }
}
