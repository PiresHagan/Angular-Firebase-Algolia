import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

import { LanguageService } from "src/app/shared/services/language.service";
import { UserService } from "../../shared/services/user.service";
import { AuthService } from "src/app/shared/services/authentication.service";
import { Category } from "src/app/shared/interfaces/category.type";
import { CategoryService } from "src/app/shared/services/category.service";
import { Language } from "src/app/shared/interfaces/language.type";
import { Site } from "src/app/shared/interfaces/ad-network-site.type";
import { BackofficeAdNetworkService } from "src/app/backoffice/shared/services/backoffice-ad-network.service";
import { SiteConstant } from "src/app/shared/constants/site-constant";

@Component({
  selector: "app-add-website",
  templateUrl: "./add-website.component.html",
  styleUrls: ["./add-website.component.scss"],
})
export class AddWebsiteComponent implements OnInit {
  websiteForm: FormGroup;
  currentUser: any;
  memberDetails;
  isFormSaving: boolean = false;
  publisherSites: Array<Site> = [];
  dailyTrafficOptions = [
    {
      text: "< 1k page view",
      label: "< 1k page view",
      value: "< 1k page view",
    },
    {
      text: "1k - 10k page views",
      label: "1k - 10k page views",
      value: "1k - 10k page views",
    },
    {
      text: "10k - 100k page views",
      label: "10k - 100k page views",
      value: "10k - 100k page views",
    },
    {
      text: "100k - 1M page views",
      label: "100k - 1M page views",
      value: "100k - 1M page views",
    },
    {
      text: "> 1M page views",
      label: "> 1M page views",
      value: "> 1M page views",
    },
  ];

  adRevenueOptions = [
    {
      text: "< $100/month",
      label: "< $100/month",
      value: "< $100/month",
    },
    {
      text: "$100 to $1,000/month",
      label: "$100 to $1,000/month",
      value: "$100 to $1,000/month",
    },
    {
      text: "$1,000 to $10,000/month",
      label: "$1,000 to $10,000/month",
      value: "$1,000 to $10,000/month",
    },
    {
      text: "$10,000 to $50,000/month",
      label: "$10,000 to $50,000/month",
      value: "$10,000 to $50,000/month",
    },
    {
      text: "$50,000 to $100,000/month",
      label: "$50,000 to $100,000/month",
      value: "$50,000 to $100,000/month",
    },
    {
      text: "> $100,000/month",
      label: "> $100,000/month",
      value: "> $100,000/month",
    },
  ];
  categoryList: Category[] = [];
  languageList: Language[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService,
    private languageService: LanguageService,
    private _location: Location,
    private userService: UserService,
    private categoryService: CategoryService,
    private message: NzMessageService,
    private adNetworkService: BackofficeAdNetworkService
  ) {}

  ngOnInit(): void {
    this.languageList = this.languageService.geLanguageList();
    this.websiteForm = this.fb.group({
      url: [null, [Validators.required]],
      monthly_traffic: [null, [Validators.required]],
      lang: [null, [Validators.required]],
      category: [null, [Validators.required]],
      revenue: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
    });

    this.setFormData();
  }

  setFormData() {
    this.userService.getCurrentUser().then((user) => {
      this.userService.getMember(user.uid).subscribe((userDetails) => {
        this.currentUser = userDetails;

        this.adNetworkService
          .getSitesByPublisher(this.currentUser.id)
          .subscribe((data) => {
            this.publisherSites = data.sites;
          });
      });

      this.userService.getMember(user.uid).subscribe((memberDetails) => {
        // if(memberDetails?.onboarding_website?.lang)
        //   this.websiteForm.controls['lang'].setValue(memberDetails.onboarding_website.lang);

        // if(memberDetails?.onboarding_website?.url)
        //   this.websiteForm.controls['url'].setValue(memberDetails.onboarding_website.url);

        // if(memberDetails?.onboarding_website?.monthly_traffic)
        //   this.websiteForm.controls['monthly_traffic'].setValue(memberDetails.onboarding_website.monthly_traffic);

        // if(memberDetails?.onboarding_website?.category) {
        //   this.categoryService.getAll(memberDetails.onboarding_website.lang).subscribe((categoryList) => {
        //     this.categoryList = categoryList ? categoryList : [];
        //     this.websiteForm.controls['category'].setValue(memberDetails.onboarding_website.category);
        //   })
        // }

        this.memberDetails = memberDetails;
      });
    });
  }

  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }

  async submitForm() {
    if (!this.currentUser) {
      return;
    }
    // Async Http along with navigation
    //! This is not reliable and requires error handler
    //TODO: Ask for a design change to add a skip method instead of this approach
    this.goToNext();

    for (const i in this.websiteForm.controls) {
      this.websiteForm.controls[i].markAsDirty();
      this.websiteForm.controls[i].updateValueAndValidity();
    }

    if (this.websiteForm.valid) {
      try {
        if (
          this.publisherSites.some(
            (item) => item.url == this.websiteForm.value.url
          )
        ) {
          this.showMessage("error", "Site is already added by you");
        } else {
          this.isFormSaving = true;
          let websiteValue = JSON.parse(JSON.stringify(this.websiteForm.value));
          delete websiteValue.revenue;
          const loggedInUser = this.authService.getLoginDetails();
          if (!loggedInUser) return;

          await this.userService.updateSpecificDetails(
            this.currentUser.id,
            websiteValue
          );
          websiteValue = JSON.parse(JSON.stringify(this.websiteForm.value));
          websiteValue["publisher"] = {};
          websiteValue.publisher["id"] = this.currentUser.id;
          websiteValue.publisher["type"] = this.currentUser.type;
          websiteValue.publisher["name"] = this.currentUser.fullname;
          websiteValue["daily_traffic"] = websiteValue.monthly_traffic;
          websiteValue["status"] = SiteConstant.IN_PROCESS;
          delete websiteValue.monthly_traffic;
          //this.goToNext();
          this.adNetworkService
            .addNewSite(this.currentUser.id, websiteValue)
            .then((result: any) => {
              this.websiteForm.reset();
              console.warn(result);
              this.showMessage("success", "Site added successfully");
              this.isFormSaving = false;
            })
            .catch((err) => {
              this.showMessage("error", err.message);
              this.isFormSaving = false;
            });
        }
      } catch (error) {
        console.error(error);

        this.isFormSaving = false;
      }
    }
  }

  languageSelected(language: string) {
    if (!language) return;
    this.websiteForm.controls["category"].setValue(null);
    this.categoryService.getAll(language).subscribe((categoryList) => {
      this.categoryList = categoryList ? categoryList : [];
    });
  }

  backClicked() {
    this._location.back();
  }

  goToNext() {
    this.router.navigate(["/auth/import-contact"]);
  }
}
