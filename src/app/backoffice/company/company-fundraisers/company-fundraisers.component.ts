import { Component, OnInit } from '@angular/core';
import { Fundraiser } from 'src/app/shared/interfaces/fundraiser.type';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { NzModalService } from "ng-zorro-antd";
import { BackofficeFundraiserService } from '../../shared/services/backoffice-fundraiser.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-fundraisers',
  templateUrl: './company-fundraisers.component.html',
  styleUrls: ['./company-fundraisers.component.scss']
})
export class CompanyFundraisersComponent implements OnInit {

  loading: boolean = true;
  loadingMore: boolean = false;
  fundraisers: Fundraiser[];
  lastVisible: any = null;
  userDetails;

  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    public fundraiserService: BackofficeFundraiserService,
    private modalService: NzModalService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      let authorId = this.activatedRoute.snapshot.queryParams["company"];
      if (!authorId)
        return;
      this.fundraiserService.getFundraisersByUser(authorId).subscribe((data) => {
        this.fundraisers = data.fundraiserList;
        this.lastVisible = data.lastVisible;
        this.loading = false;
      });
    })
  }

  scrollEvent = (event: any): void => {
    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        let authorId = this.activatedRoute.snapshot.queryParams["company"];
        if (!authorId)
          return;
        this.loadingMore = true;
        this.fundraiserService.getFundraisersByUser(authorId, null, 'next', this.lastVisible).subscribe((data) => {
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

}
