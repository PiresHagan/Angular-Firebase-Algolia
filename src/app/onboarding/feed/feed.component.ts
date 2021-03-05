import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

import { LanguageService } from 'src/app/shared/services/language.service';
import { Charity } from 'src/app/shared/interfaces/charity.type';
import { Company } from 'src/app/shared/interfaces/company.type';
import { Member } from 'src/app/shared/interfaces/member.type';
import { Category } from 'src/app/shared/interfaces/category.type';
import { CharityService } from 'src/app/shared/services/charity.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { CompanyService } from 'src/app/shared/services/company.service';
import { AuthorService } from 'src/app/shared/services/author.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { Language } from 'src/app/shared/interfaces/language.type';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  categoryList: Array<Category> = [];
  contributorList: Array<Member> = [];
  companyList: Array<Company> = [];
  charityList: Array<Charity> = [];
  languageList: Language[];
  selectedLanguage: string;
  currentUser: any;
  memberDetails;
  isLoggedInUser: boolean = false;

  constructor(
    public translate: TranslateService,
    private userService: UserService,
    private languageService: LanguageService,
    private charityService: CharityService,
    private authorService: AuthorService,
    private companyService: CompanyService,
    private categoryService: CategoryService,
    private afAuth: AngularFireAuth,
    private modalService: NzModalService,
    private authService: AuthService,
    private router: Router,
    private _location: Location
  ) { }

  switchLang(lang: string) {
    this.languageService.changeLangOnBoarding(lang);
  }

  ngOnInit(): void {
    this.languageList = this.languageService.geLanguageList();
    this.selectedLanguage = this.languageService.defaultLanguage;

    this.userService.getCurrentUser().then((user) => {
      this.userService.get(user.uid).subscribe((userDetails) => {
        this.currentUser = userDetails;
        this.isLoggedInUser = true;
      });

      this.userService.getMember(user.uid).subscribe((memberDetails) => {
        this.memberDetails = memberDetails;
      });

      this.categoryService.getOnBoardingCategories(this.selectedLanguage).then((categories: Array<Category>) => {
        this.categoryList = categories;
      });

      this.authorService.getOnBoardingContributors(this.selectedLanguage).then((contributors: Array<Member>) => {
        this.contributorList = contributors;
      });

      this.companyService.getOnBoardingCompanies(this.selectedLanguage).then((companies: Array<Company>) => {
        this.companyList = companies;
      });

      this.charityService.getOnBoardingCharities(this.selectedLanguage).then((chartities: Array<Charity>) => {
        this.charityList = chartities;
      });
    });
  }

  backClicked() {
    this._location.back();
  }

  async follow(data, type) {
    data['isUpdating'] = true;
    switch(type) {
      case 'charity': {
        this.charityService.followCharity(data.id).then(res => {
          data['isFollowing'] = true;
          data['isUpdating'] = false;
        }).catch( err => {
          data['isUpdating'] = false;
        });
        break;
      }

      case 'company': {
        this.companyService.followCompany(data.id).then(res => {
          data['isFollowing'] = true;
          data['isUpdating'] = false;
        }).catch( err => {
          data['isUpdating'] = false;
        });
        break;
      }

      case 'contributor': {
        this.authorService.follow(data.id, data.type);
        data['isFollowing'] = true;
        data['isUpdating'] = false;
        break;
      }

      case 'category': {
        this.categoryService.followCategory(this.currentUser.id, data.id).then(res => {
          data['isFollowing'] = true;
          data['isUpdating'] = false;
        }).catch( err => {
          data['isUpdating'] = false;
        });
        break;
      }
    }
  }

  unfollow(data, type) {
    data['isUpdating'] = true;
    switch(type) {
      case 'charity': {
        this.charityService.unfollowCharity(data.id).then(res => {
          data['isFollowing'] = false;
          data['isUpdating'] = false;
        }).catch( err => {
          data['isUpdating'] = false;
        });
        break;
      }

      case 'company': {
        this.companyService.unfollowCompany(data.id).then(res => {
          data['isFollowing'] = false;
          data['isUpdating'] = false;
        }).catch( err => {
          data['isUpdating'] = false;
        });
        break;
      }

      case 'contributor': {
        this.authorService.unfollow(data.id, data.type)
        data['isFollowing'] = false;
        data['isUpdating'] = false;
        break;
      }

      case 'category': {
        this.categoryService.unfollowCategory(this.currentUser.id, data.id).then(res => {
          data['isFollowing'] = false;
          data['isUpdating'] = false;
        }).catch( err => {
          data['isUpdating'] = false;
        });
        break;
      }
    }
  }

  done(): void {
    this.modalService.success({
      nzTitle: 'Congratulations',
      nzContent: 'Well done! You are all set.',
      nzOnOk: () => { 
        if(this.userService.userData?.isNewConsoleUser) {
          this.authService.redirectToConsole(`${environment.consoleURL}/settings/profile-settings`, {});
        } else {
          this.router.navigate(['/app/settings/profile-settings']);
        }
      }
    });
  }
  skeletonData = new Array(10).fill({}).map((_i, index) => {
    return 
  });
}
