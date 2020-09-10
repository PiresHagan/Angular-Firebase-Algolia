import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/shared/services/company.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  companies: any[];
  lastVisible: any = null;
  loading: boolean = true;
  loadingMore: boolean = false;
  selectedLanguage: string = "";
  companyLimit = 20;

  constructor(
    private companyService: CompanyService,
    private langService: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.langService.getSelectedLanguage();

    window.addEventListener('scroll', this.scrollEvent, true);

    this.getFirstCompanies();
  }

  getFirstCompanies() {
    this.companyService.getCompaniesOnScroll(this.companyLimit, 'first', this.lastVisible, this.selectedLanguage).subscribe((data) => {
      this.companies = data.companyList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
    });
  }

  scrollEvent = (event: any): void => {
    if (event.target && event.target.documentElement) {
      const top = event.target.documentElement.scrollTop
      const height = event.target.documentElement.scrollHeight
      const offset = event.target.documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.companyService.getCompaniesOnScroll(this.companyLimit, 'next', this.lastVisible, this.selectedLanguage).subscribe((data) => {
          this.loadingMore = false;
          this.companies = [...this.companies, ...data.companyList];
          this.lastVisible = data.lastVisible;
        });
      }
    }
  }

 
  isVisible = false;
  isOkLoading = false;
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.router.navigate(["auth/login"]);
      this.isOkLoading = false;
    }, 2000);
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  checkLogin(){
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user.isAnonymous) {
        this.router.navigate(["/app/company/company-list"]);
      } else {
        this.showModal()
      }
    });
  }

}
