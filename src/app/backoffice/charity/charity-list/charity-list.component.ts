
import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { CharityService } from '../../shared/services/charity.service';
import { Charity } from 'src/app/shared/interfaces/charity.type';

@Component({
  selector: 'app-charity-list',
  templateUrl: './charity-list.component.html',
  styleUrls: ['./charity-list.component.scss']
})
export class CharityListComponent implements OnInit {

  blogs = [];
  loading: boolean = true;
  loadingMore: boolean = false;
  charities: Charity[];
  lastVisible: any = null;
  userDetails;

  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    public charityService: CharityService,
    private modalService: NzModalService,
    private message: NzMessageService,
  ) { }


  ngOnInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.charityService.getAllCompanies(this.userDetails.id).subscribe((data) => {
          this.charities = data.charityList;
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
        this.charityService.getAllCompanies(this.userDetails.id, null, 'next', this.lastVisible).subscribe((data) => {
          this.loadingMore = false;
          this.charities = [...this.charities, ...data.charityList];
          this.lastVisible = data.lastVisible;
        });
      }
    }

  }

  deleteCharity(charityId: string) {
    this.modalService.confirm({
      nzTitle: "<i>" + this.translate.instant("DeleteConfMessage") + "</i>",
      nzOnOk: () => {
        this.charityService.deletCharity(charityId).subscribe(() => {
          this.modalService.success({
            nzTitle: "<i>" + this.translate.instant("DeleteSuccess") + "</i>",
          });
        }, (error) => {
          this.modalService.error({
            nzTitle: this.translate.instant("SomethingWrong"),
          });
        })
      },
    });

  }


}
