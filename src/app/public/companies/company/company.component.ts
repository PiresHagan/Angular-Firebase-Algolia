import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { Company } from 'src/app/shared/interfaces/company.type';
import { CompanyService } from 'src/app/shared/services/company.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { Router } from '@angular/router';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { UserService } from 'src/app/shared/services/user.service';

interface PublicProfileSubscription { 
  created_at: string,
  customer_id: string,
  external_id: string,
  id: string,
  limit: number,
  package_id: string,
  status: string,
  type: string
}

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
  companyArticles: Article[];
  lastArticleIndex;
  lastArticleIndexOfAudio;
  lastArticleIndexOfVideo;
  lastArticleIndexOfText;
  currentPublicProfileSubscription: PublicProfileSubscription;
  audioArticles: Article[] = [];
  videoArticles: Article[] = [];
  textArticles: Article[] = [];
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private langService: LanguageService,
    private companyService: CompanyService,
    private seoService: SeoService,
    private router: Router,
    private articleService: BackofficeArticleService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');

      this.companyService.getCompanyBySlug(slug).subscribe(data => {
        this.company = data[0];

        this.companyId = this.company.id;

        this.companyService.getCompanyPublicProfileSubscription(this.companyId).subscribe((data) => {
          this.currentPublicProfileSubscription = data[0];
        });
    

         // Fetching company article
        this.articleService.getArticlesByUser(this.companyId,  2, null, this.lastArticleIndex).subscribe((data) => {
          this.companyArticles = data.articleList;
          this.lastArticleIndex = data.lastVisible;
        });

        this.setUserDetails();

        this.seoService.updateMetaTags({
          title: this.company.name,
          tabTitle: this.company.name.substring(0, 69),
          description: this.company.bio.substring(0, 154),
          keywords: this.company.name,
          type: 'company',
          image: { url: this.company.logo.url }
        });
      });

      this.setUserDetails();
    });
  }
  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('http://cdn.mytrendingstories.com/', 'https://cdn.mytrendingstories.com/')
        .replace('https://abc2020new.com/', 'https://assets.mytrendingstories.com/');
    }
    return latestURL;
  }


  loadMoreArticle() {
    const CompanyId = this.companyId;
    this.articleService.getArticlesByAuthor(CompanyId, 2, 'next', this.lastArticleIndex).subscribe((articleData) => {
      let mergedData: any = [...this.companyArticles, ...articleData.articleList];
      this.companyArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndex = articleData.lastVisible;
    })
  }

  getAudioArticles() {
    if (this.audioArticles.length != 0)
      return;
    const CompanyId = this.companyId;
    this.articleService.getArticlesByUser(CompanyId, 2, 'first', null, 'audio').subscribe((articleData) => {
      this.audioArticles = articleData.articleList;
      this.lastArticleIndexOfAudio = articleData.lastVisible;
    })
  }
  getVideoArticles() {
    if (this.videoArticles.length != 0)
      return;
    const CompanyId = this.companyId;
    this.articleService.getArticlesByUser(CompanyId, 2, 'first', null, 'video').subscribe((articleData) => {
      this.videoArticles = articleData.articleList;
      this.lastArticleIndexOfVideo = articleData.lastVisible;
    })
  }
  getTextArticles() {
    if (this.textArticles.length != 0)
      return;
    const CompanyId = this.companyId;
    this.articleService.getArticlesByUser(CompanyId, 2, 'first', null, 'text').subscribe((articleData) => {
      this.textArticles = articleData.articleList;
      this.lastArticleIndexOfText = articleData.lastVisible;
    })
  }
  loadMoreAudioArticles() {
    const CompanyId = this.companyId;
    this.articleService.getArticlesByUser(CompanyId, 2, 'next', this.lastArticleIndexOfAudio, 'audio').subscribe((articleData) => {
      let mergedData: any = [...this.audioArticles, ...articleData.articleList];
      this.audioArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndexOfAudio = articleData.lastVisible;
    })
  }

  loadMoreVideoArticles() {
    const CompanyId = this.companyId;
    this.articleService.getArticlesByUser(CompanyId, 2, 'next', this.lastArticleIndexOfVideo, 'video').subscribe((articleData) => {
      let mergedData: any = [...this.videoArticles, ...articleData.articleList];
      this.videoArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndexOfVideo = articleData.lastVisible;
    })
  }
  loadMoreTextArticles() {
    const CompanyId = this.companyId;
    this.articleService.getArticlesByUser(CompanyId, 2, 'next', this.lastArticleIndexOfText, 'text').subscribe((articleData) => {
      let mergedData: any = [...this.textArticles, ...articleData.articleList];
      this.textArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndexOfText = articleData.lastVisible;
    })
  }
  getDistinctArray(data) {
    var resArr = [];
    data.filter(function (item) {
      var i = resArr.findIndex(x => x.id == item.id);
      if (i <= -1) {
        resArr.push(item);
      }
      return null;
    });
    return resArr;
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
      if (!user.email) {
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
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.companyService.followCompany(this.companyId).then(data => {
        this.setFollowOrNot();
      });
    } else {
      this.showModal()
    }
  }

  async unfollow() {
    await this.setUserDetails();
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.companyService.unfollowCompany(this.companyId).then(data => {
        this.setFollowOrNot();
      });
    } else {
      this.showModal()
    }
  }

  async openCompanySubscription() {
    await this.setUserDetails();
    if (this.isLoggedInUser) {
      if(this.userDetails?.id == this.company?.owner?.id) {
        if(this.userService.userData?.isNewConsoleUser) {
          this.authService.redirectToConsole(`${environment.consoleURL}/company/company-details`, { company: this.company.id, indexToShow: 5 });
        } else {
          this.router.navigate(["app/company/company-details"], { queryParams: { company: this.company.id, indexToShow: 5 } });
        }
      }
    } else {
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

  companyMoreInfo() {
    document.getElementById('firstName').focus();
  }
}
