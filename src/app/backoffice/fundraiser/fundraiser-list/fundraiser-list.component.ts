import { Component, OnInit } from '@angular/core';
import { Fundraiser } from 'src/app/shared/interfaces/fundraiser.type';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { NzModalService } from "ng-zorro-antd";
import { BackofficeFundraiserService } from '../../shared/services/backoffice-fundraiser.service';

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
  setupPaymentLoading: boolean = false;

  constructor(
    public translate: TranslateService,
    public authService: AuthService,
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

    })

  }

  scrollEvent = (event: any): void => {
    if (event.target && event.target.documentElement) {
      const top = event.target.documentElement.scrollTop
      const height = event.target.documentElement.scrollHeight
      const offset = event.target.documentElement.offsetHeight
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

  setupConnectedAccount(fundraiserId: string) {
    this.setupPaymentLoading = true;
    this.fundraiserService.setupConnectedAccount(fundraiserId).subscribe((response: any) => {
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
