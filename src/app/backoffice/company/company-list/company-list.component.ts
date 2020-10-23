
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
  setupPaymentLoading: boolean = false;

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
    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
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

  setupConnectedAccount(companyId: string) {
    this.setupPaymentLoading = true;
    this.companyService.setupConnectedAccount(companyId).subscribe((response: any) => {
      this.setupPaymentLoading = false;

      if (response.url) {
        window && window.open(response.url, '_self')
      } else {
        this.showError("CharityAccountError");
      }
    }, (error) => {
      this.setupPaymentLoading = false;

      this.showError("CharityAccountError");
    })
  }

  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }


}
