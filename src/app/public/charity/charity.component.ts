import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CharityService } from 'src/app/shared/services/charity.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Charity } from 'src/app/shared/interfaces/charity.type';
import { User } from 'src/app/shared/interfaces/user.type';
import { Router } from '@angular/router';
import { SeoService } from 'src/app/shared/services/seo/seo.service';

@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.scss']
})

export class CharityComponent implements OnInit {
  charity: Charity;
  charityId: string;
  isUpdatingFollow: boolean = false;
  isFollowing: boolean = false;
  isLoaded: boolean = false;
  isLoggedInUser: boolean = false;
  selectedLanguage: string = "";
  userDetails: User;



  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private langService: LanguageService,
    private charityService: CharityService,
    public translate: TranslateService,
    private seoService: SeoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');

      this.charityService.getCharityBySlug(slug).subscribe(data => {
        this.charity = data[0];

        this.charityId = this.charity.id;

        this.setUserDetails();

        this.seoService.updateMetaTags({
          title: this.charity.name,
          tabTitle: this.charity.name.substring(0, 69),
          description: this.charity.bio.substring(0, 154),
          keywords: this.charity.name,
          type: 'charity',
          image: { url: this.charity.logo.url }
        });
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
    this.charityService.isUserFollowing(this.charityId, this.getUserDetails().id).subscribe((data) => {
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
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.charityService.followCharity(this.charityId);
    } else {
      this.showModal()
    }
  }

  async unfollow() {
    await this.setUserDetails();
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.charityService.unfollowCharity(this.charityId);
    } else {
      this.showModal()
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
}
