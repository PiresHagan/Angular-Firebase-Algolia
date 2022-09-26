import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { NzModalService } from "ng-zorro-antd";
import { ToastrService } from "ngx-toastr";
import { MEMBER } from "src/app/shared/constants/member-constant";
import { AuthService } from "src/app/shared/services/authentication.service";
import { UserService } from "src/app/shared/services/user.service";
import { environment } from "src/environments/environment";
import { preferences } from "../_const/preferences";
import { Preference } from "../_models/preference";
import { PendingService } from "./pending.service";

@Component({
  selector: "app-pending",
  templateUrl: "./pending.component.html",
  styleUrls: ["./pending.component.css"],
})
export class PendingComponent implements OnInit {
  //Boolean button loader controllers
  isSendingCode: boolean;
  isSendingPreference: boolean;
  isSaving: boolean;
  //From controllers
  preferenceTypes: Preference[];
  userType: string;
  topics: string;
  code: string;
  isPromocodeValid: boolean= false;
  currentUser: any;

  constructor(
    private location: Location,
    private toast: ToastrService,
    private pendingService: PendingService,
    private userService: UserService,
    private modalService: NzModalService,
    private authService: AuthService,
    private router: Router,
    public translate: TranslateService,
  ) {
    this.userType = localStorage.getItem("user_type");
    this.preferenceTypes = preferences;
  }

  ngOnInit(): void {
    this.pendingService.getUser();
  }

  addPreference(): void {
    this.isSendingPreference = true;
    this.pendingService.addPreference(this.topics).subscribe(
      (res) => {
        console.warn(res);
        this.toast.success("Success!");
        this.isSendingPreference = false;
      },
      (err) => {
        console.error(err);
        this.toast.error("Failed");
        this.isSendingPreference = false;
      }
    );
  }

  addPromoCode(): void {
    this.isSendingCode = true;
    this.pendingService.addPromoCode(this.code).subscribe(
      (res) => {
        if (res.errors !== "true") {
          this.toast.success("Success!");
          this.isPromocodeValid = true;
        } else {
          this.toast.error("Invalid Promo Code");
        }
        this.isSendingCode = false;
      },
      (err) => {
        this.isSendingCode = false;
      }
    );
  }

  done(): void {
    this.userService.getCurrentUser().then((user) => {
      this.userService.get(user.uid).subscribe((userDetails) => {
        this.currentUser = userDetails;
        if(this.isPromocodeValid === false){
          this.userService.updateBasicDetails(this.currentUser.id, {
            user_type: MEMBER,
            type: MEMBER,
          });
        }
      });
    })

    let $congratulation = this.translate.instant("onboardingPopup.congratulations");
    let $message = this.translate.instant("onboardingPopup.msg");
    let $ok = this.translate.instant("button.ok");
    this.modalService.success({
      nzTitle: '<i>' + $congratulation + '<i>',
      nzContent: '<i>' + $message + '<i>',
      nzOkText: $ok,
      nzOnOk: () => {
        if (this.userService.userData?.isNewConsoleUser) {
          this.authService.redirectToConsole(
            `${environment.consoleURL}/settings/profile-settings`,
            {}
          );
        } else {
          this.router.navigate(["/app/settings/profile-settings"]);
        }
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
