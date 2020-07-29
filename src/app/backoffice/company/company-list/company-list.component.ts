
import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { NzModalService, NzMessageService } from "ng-zorro-antd";
import { CompanyService } from '../../shared/services/company.service';
import { Company } from 'src/app/shared/interfaces/company.type';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  blogs = [];
  loading: boolean = true;
  loadingMore: boolean = false;
  companies: Company[];
  lastVisible: any = null;
  userDetails;

  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    public companyService: CompanyService,
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
        this.companyService.getAllCompanies(this.userDetails.id).subscribe((data) => {
          this.companies = data.companyList;
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
        this.companyService.getAllCompanies(this.userDetails.id, null, 'next', this.lastVisible).subscribe((data) => {
          this.loadingMore = false;
          this.companies = [...this.companies, ...data.companyList];
          this.lastVisible = data.lastVisible;
        });
      }
    }

  }

  deleteCompany(companyId: string) {
    this.modalService.confirm({
      nzTitle: "<i>" + this.translate.instant("DeleteConfMessage") + "</i>",
      nzOnOk: () => {
        this.companyService.deletCompany(companyId).subscribe(() => {
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
