import { Component, OnInit } from '@angular/core';
import { Fundraiser } from 'src/app/shared/interfaces/fundraiser.type';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { NzModalService } from "ng-zorro-antd";
import { BackofficeFundraiserService } from '../../shared/services/backoffice-fundraiser.service';
import { BackofficeMemberService } from '../../shared/services/backoffice-member.service';

@Component({
  selector: 'app-fundraiser-list',
  templateUrl: './fundraiser-list.component.html',
  styleUrls: ['./fundraiser-list.component.scss']
})

export class FundraiserListComponent implements OnInit {

  loading: boolean = true;
  loadingMore: boolean = false;
  fundraisers: Fundraiser[];
  lastVisible: any = null;
  userDetails;
  loggedInMember;
  setupPaymentLoading: boolean = false;

  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    public memberService: BackofficeMemberService,
    public fundraiserService: BackofficeFundraiserService,
    private modalService: NzModalService
  ) { }


  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();

      if (this.userDetails) {
        this.fundraiserService.getFundraisersByUser(this.userDetails.id).subscribe((data) => {
          this.fundraisers = data.fundraiserList;
          this.lastVisible = data.lastVisible;
          this.loading = false;
        });
      }

      this.memberService.getMemberByUid(this.userDetails.id).subscribe((member) => {
        this.loggedInMember = member;
      })

    })

  }

  scrollEvent = (event: any): void => {
    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.fundraiserService.getFundraisersByUser(this.userDetails.id, null, 'next', this.lastVisible).subscribe((data) => {
          this.loadingMore = false;
          this.fundraisers = [...this.fundraisers, ...data.fundraiserList];
          this.lastVisible = data.lastVisible;
        });
      }
    }

  }

  deleteFundraiser(fundraiserId: string) {
    let fundraiserMessageConf = this.translate.instant("fundraiserDeletMsgConf");
    let fundraiserMessageSucc = this.translate.instant("fundraiserDeletMsgSuc");
    this.modalService.confirm({
      nzTitle: "<i>" + fundraiserMessageConf + "</i>",
      nzOnOk: () => {
        this.fundraiserService.deleteFundraiser(fundraiserId).subscribe(() => {
          this.modalService.success({
            nzTitle: "<i>" + fundraiserMessageSucc + "</i>",
          });
        }, error => {
          this.modalService.error({
            nzTitle: "<i>" + this.translate.instant("SomethingWrong") + "</i>",
          });
        })
      },
    });
  }

  setupConnectedAccount(memberId: string) {
    this.setupPaymentLoading = true;
    this.memberService.setupConnectedAccount(memberId).subscribe((response: any) => {
      if (response.url) {
        window && window.open(response.url, '_self')
      } else {
        this.showError("FundraiserAccountError");
      }
      this.setupPaymentLoading = false;
    }, (error) => {
      this.setupPaymentLoading = false;
      this.showError("FundraiserAccountError");
    })
  }

  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }

}
