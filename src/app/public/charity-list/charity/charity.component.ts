import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CharityService } from 'src/app/shared/services/charity.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Charity } from 'src/app/shared/interfaces/charity.type';
import { User } from 'src/app/shared/interfaces/user.type';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  charityArticles: Article[];
  lastArticleIndex;
  lastArticleIndexOfAudio;
  lastArticleIndexOfVideo;
  lastArticleIndexOfText;
  audioArticles: Article[] = [];
  videoArticles: Article[] = [];
  textArticles: Article[] = [];
  isDonateFormVisible: boolean = false;
  isShareVisible : boolean = false
  donationList: any[];
  donationPercentage: string = "0";
  public href: string = "";
  
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private langService: LanguageService,
    private charityService: CharityService,
    public translate: TranslateService,
    private seoService: SeoService,    
    private router: Router,
    private message: NzMessageService,
    private articleService: BackofficeArticleService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params && params.donation) {
        switch(params.donation) {
          case 'success': {
            const msg = this.translate.instant("Donated Successfully");
            this.showMessage('success', msg);
            break;
          }

          case 'error': {
            const msg = this.translate.instant("Something went wrong. Please connect with support team.");
            this.showMessage('error', msg);
            break;
          }
        }
      } 
    });

    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();
      const slug = params.get('slug');
      this.charityService.getCharityBySlug(slug).subscribe(data => {
        this.charity = data[0];

        if (this.charity.amount) {
          this.donationPercentage = ((this.charity.amount / 1000) * 100).toFixed(1);
        }

        this.charityId = this.charity.id;
        // Fetching charity donations
        this.charityService.getAllCharityDonation(this.charityId).subscribe(data => {
          this.donationList = data.donations;
        })
        // Fetching charity article
        this.articleService.getArticlesByUser(this.charityId,  2, null, this.lastArticleIndex).subscribe((data) => {
          this.charityArticles = data.articleList;
          this.lastArticleIndex = data.lastVisible;
        });
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

  showMessage(type: string, message: string) {
    this.message.create(type, message, {
      nzDuration: 5000
    });
  }

  loadMoreArticle() {
    const CharityId = this.charityId;
    this.articleService.getArticlesByAuthor(CharityId, 2, 'next', this.lastArticleIndex).subscribe((articleData) => {
      let mergedData: any = [...this.charityArticles, ...articleData.articleList];
      this.charityArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndex = articleData.lastVisible;
    })
  }

  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', "https://assets.mytrendingstories.com/")
        .replace('http://cdn.mytrendingstories.com/', "https://cdn.mytrendingstories.com/")
        .replace('https://abc2020new.com/', "https://assets.mytrendingstories.com/");
    }
    return latestURL;
  }

  getAudioArticles() {
    if (this.audioArticles.length != 0)
      return;
      const CharityId = this.charityId;
    this.articleService.getArticlesByUser(CharityId, 2, 'first', null, 'audio').subscribe((articleData) => {
      this.audioArticles = articleData.articleList;
      this.lastArticleIndexOfAudio = articleData.lastVisible;
    })
  }
  getVideoArticles() {
    if (this.videoArticles.length != 0)
      return;
      const CharityId = this.charityId;
    this.articleService.getArticlesByUser(CharityId, 2, 'first', null, 'video').subscribe((articleData) => {
      this.videoArticles = articleData.articleList;
      this.lastArticleIndexOfVideo = articleData.lastVisible;
    })
  }
  getTextArticles() {
    if (this.textArticles.length != 0)
      return;
      const CharityId = this.charityId;
    this.articleService.getArticlesByUser(CharityId, 2, 'first', null, 'text').subscribe((articleData) => {
      this.textArticles = articleData.articleList;
      this.lastArticleIndexOfText = articleData.lastVisible;
    })
  }
  loadMoreAudioArticles() {
    const CharityId = this.charityId;
    this.articleService.getArticlesByUser(CharityId, 2, 'next', this.lastArticleIndexOfAudio, 'audio').subscribe((articleData) => {
      let mergedData: any = [...this.audioArticles, ...articleData.articleList];
      this.audioArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndexOfAudio = articleData.lastVisible;
    })
  }

  loadMoreVideoArticles() {
    const CharityId = this.charityId;
    this.articleService.getArticlesByUser(CharityId, 2, 'next', this.lastArticleIndexOfVideo, 'video').subscribe((articleData) => {
      let mergedData: any = [...this.videoArticles, ...articleData.articleList];
      this.videoArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndexOfVideo = articleData.lastVisible;
    })
  }
  loadMoreTextArticles() {
    const CharityId = this.charityId;
    this.articleService.getArticlesByUser(CharityId, 2, 'next', this.lastArticleIndexOfText, 'text').subscribe((articleData) => {
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

  showDonateForm(): void {
    this.isDonateFormVisible = true;
  }

  hideShareModel(): void {
    this.isShareVisible = false;
  }
 
  hideDonateForm(): void {
    this.isDonateFormVisible = false;
  }

  showShareModel(): void {
    this.href = window.location.href;
    this.isShareVisible = true;
    let addthis = window["addthis"];
    let config = {
      "username": "ra-5ed48a5fc8315a5b",
      "services_exclude": "",
      "services_exclude_natural": "",
      "services_compact": "facebook,twitter,mailto,pinterest_share,whatsapp,print,gmail,linkedin,google,messenger,more"
    }
    addthis.init();
    addthis.update('share', 'url', this.href);
    addthis.url = this.href;
    addthis.toolbox('.addthis_toolbox');
    addthis.layers.refresh(
      addthis.url,
      addthis.title
      )
  }
 
  closeSharepopUp() {
    this.isShareVisible = false;
  } 
}
