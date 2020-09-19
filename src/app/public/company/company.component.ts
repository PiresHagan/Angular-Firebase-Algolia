import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { Company } from 'src/app/shared/interfaces/company.type';
import { CompanyService } from 'src/app/shared/services/company.service';
import { Title, Meta } from '@angular/platform-browser';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  company: Company;
  companyId: string;
  isFollowing: boolean = false;
  isLoaded: boolean = false;
  isLoggedInUser: boolean = false;
  isUpdatingFollow: boolean = false;
  selectedLanguage: string = "";
  userDetails: User;
  isVisible = false;
  isOkLoading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private langService: LanguageService,
    private companyService: CompanyService,
    private titleService: Title,
    private metaTagService: Meta,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');

      this.companyService.getCompanyBySlug(slug).subscribe(data => {
        this.company = data[0];

        this.companyId = this.company.id;

        this.setUserDetails();

        this.titleService.setTitle(`${this.company.name.substring(0, 69)}`);

        this.metaTagService.addTags([
          { name: "description", content: `${this.company.bio.substring(0, 154)}` },
          { name: "keywords", content: `${this.company.name}` },
          { name: "twitter:card", content: `${this.company.bio.substring(0, 154)}` },
          { name: "og:title", content: `${this.company.name}` },
          { name: "og:type", content: `company` },
          { name: "og:url", content: `${window.location.href}` },
          { name: "og:image", content: `${this.company.logo.url}` },
          { name: "og:description", content: `${this.company.bio.substring(0, 154)}` }
        ]);
      });

      this.setUserDetails();
    });
  }

  ngAfterViewChecked(): void {
    if (!this.isLoaded) {
      delete window['addthis']
      setTimeout(() => { this.loadScript(); }, 100);
      this.isLoaded = true;
    }
  }

  loadScript() {
    let node = document.createElement('script');
    node.src = environment.addThisScript;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  async setUserDetails() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user) {
        this.userDetails = null;
        this.isLoggedInUser = false;
        return;
      }

      this.userDetails = await this.authService.getLoggedInUserDetails();

      if (this.userDetails) {
        this.isLoggedInUser = true;
        this.setFollowOrNot();
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    })
  }

  setFollowOrNot() {
    this.companyService.isUserFollowing(this.company.id, this.getUserDetails().id).subscribe((data) => {
      setTimeout(() => {
        if (data) {
          this.isFollowing = true;
          this.isUpdatingFollow = false;
        } else {
          this.isFollowing = false;
          this.isUpdatingFollow = false;
        }
      }, 1500);
    });
  }

  getUserDetails() {
    return {
      fullname: this.userDetails.fullname,
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      avatar: this.userDetails.avatar ? this.userDetails.avatar : '',
      id: this.userDetails.id,
    }
  }

  async follow() {
    await this.setUserDetails();
    if(this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.companyService.followCompany(this.companyId).then(data => {
        this.setFollowOrNot();
      });
    }else{
      this.showModal()
    }
  }

  async unfollow() {
    await this.setUserDetails();
    if(this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.companyService.unfollowCompany(this.companyId).then(data => {
        this.setFollowOrNot();
      });
    }else{
      this.showModal()
    }
  }

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
}
