import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from 'src/app/shared/services/authentication.service';
import { ACTIVE, DRAFT } from 'src/app/shared/constants/status-constants';
// import { AUDIO, VIDEO } from 'src/app/shared/constants/article-constants';
import { AUTHOR, MEMBER } from 'src/app/shared/constants/member-constant';
import { BackofficeFundraiserService } from 'src/app/backoffice/shared/services/backoffice-fundraiser.service';
import { Fundraiser } from 'src/app/shared/interfaces/fundraiser.type';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-fundraiser-publish',
  templateUrl: './fundraiser-publish.component.html',
  styleUrls: ['./fundraiser-publish.component.scss']
})

export class FundraiserPublishComponent implements OnInit {

  fundraiserId: string;
  loading: boolean = true;
  userDetails;
  fundraiser: Fundraiser;
  isFormSaving: boolean = false;
  // fileURL: string;
  // AUDIO = AUDIO;
  // VIDEO = VIDEO;

  constructor(
    public userService: UserService,
    public translate: TranslateService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
    private location: Location,
    private sanitizer: DomSanitizer,
    public fundraiserService: BackofficeFundraiserService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.fundraiserId = params.get('fundraiserId');
      this.setFundraiserData();
    })
  }

  setFundraiserData() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.fundraiserId) {
        try {
          this.fundraiser = await this.fundraiserService.getFundraiserById(this.fundraiserId);
          // const format = 'mp4';
          // this.fileURL = this.fundraiser.type === "video" && `https://player.cloudinary.com/embed/?cloud_name=mytrendingstories&public_id=${this.fundraiser.fundraising_file.cloudinary_id}&fluid=true&controls=true&source_types%5B0%5D=${format}`
        } catch (error) {
          this.fundraiser = null;
          this.router.navigate(['/app/error'])
        }
      } else {
        console.log('Unknown entity');
        this.router.navigate(['/app/error'])
      }
      this.loading = false;
    })
  }

  // transform(url) {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }

  savePublishStatus() {
    this.isFormSaving = true;
    this.fundraiserService.updateFundraiser(this.fundraiserId, { status: ACTIVE, published_at: new Date().toISOString() }).then(async () => {

      if (!this.userDetails.type || this.userDetails.type == MEMBER)
        await this.userService.updateMember(this.userDetails.id, { type: AUTHOR });
      this.isFormSaving = false;
      this.showSuccess();
    })
  }

  saveDraftStatus() {
    this.isFormSaving = true;
    this.fundraiserService.updateFundraiserImage(this.fundraiserId, { status: DRAFT }).then(async () => {
      this.isFormSaving = false;
      this.router.navigate(['/app/fundraiser/fundraiser-list']);
    })
  }

  showSuccess() {
    let $message = this.translate.instant("fundraiserPublishMsg");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("fundraiserPublishMsg");
    })
    this.modalService.confirm({
      nzTitle: "<i>" + $message + "</i>",
      nzOnOk: () => {
        this.router.navigate(['/app/fundraiser/fundraiser-list']);
      },
    });
  }

  goBack() {
    this.location.back();
  }

}
