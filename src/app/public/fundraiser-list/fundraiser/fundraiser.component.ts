import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FundraiserService } from 'src/app/shared/services/fundraiser.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { TranslateService } from "@ngx-translate/core";
import { Fundraiser } from 'src/app/shared/interfaces/fundraiser.type';
import { User } from 'src/app/shared/interfaces/user.type';
import { AuthorService } from 'src/app/shared/services/author.service';
// import { TEXT, AUDIO, VIDEO } from 'src/app/shared/constants/article-constants';
import { UserService } from 'src/app/shared/services/user.service';
import { CompanyService } from 'src/app/shared/services/company.service';
import { CharityService } from 'src/app/shared/services/charity.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Article } from 'src/app/shared/interfaces/article.type';
import { BackofficeArticleService } from 'src/app/backoffice/shared/services/backoffice-article.service';
@Component({
  selector: 'app-fundraiser',
  templateUrl: './fundraiser.component.html',
  styleUrls: ['./fundraiser.component.scss']
})

export class FundraiserComponent implements OnInit {
  fundraiser: Fundraiser;
  fundraiserAuthor;
  fundraiserId: string;
  isFollowing: boolean = false;
  isLoggedInUser: boolean = false;
  isUpdatingFollow: boolean = false;
  isLoaded: boolean = false;
  selectedLanguage: string = "";
  donationPercentage: string = "0";
  authorFollowersCount: number = 0;
  // TEXT = TEXT;
  // AUDIO = AUDIO;
  // VIDEO = VIDEO;
  Allfundraisers:any;
  fundraiserArticles: Article[];
  textArticles: Article[] = [];
  audioArticles: Article[] = [];
  videoArticles: Article[] = [];
  lastArticleIndex;
  lastArticleIndexOfAudio;
  lastArticleIndexOfVideo;
  lastArticleIndexOfText;
  userDetails: User;
  constructor(
    private route: ActivatedRoute,
    private langService: LanguageService,
    private fundraiserService: FundraiserService,
    private authorService: AuthorService,
    private authService: AuthService,
    public translate: TranslateService,
    public userService: UserService,
    public companyService: CompanyService,
    public charityService: CharityService,
    private seoService: SeoService,
    private articleService: BackofficeArticleService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');

      this.fundraiserService.getFundraiserBySlug(slug).subscribe(data => {
        this.fundraiser = data[0];
        this.Allfundraisers = data;
        
        this.fundraiserId = this.fundraiser.id;
        this.setUserDetails();
             // Fetching fundraiser article
             this.articleService.getArticlesByUser(this.fundraiserId,  2, null, this.lastArticleIndex).subscribe((data) => {
              this.fundraiserArticles = data.articleList;
              this.lastArticleIndex = data.lastVisible;
            });
    

        if (this.fundraiser.goal_amount && this.fundraiser.amount) {
          this.donationPercentage = ((this.fundraiser.amount / this.fundraiser.goal_amount) * 100).toFixed(1);
        }

        this.authorService.getAllFollowersByAuthorType(this.fundraiser.author.id, this.fundraiser.author.type).subscribe((followers) => {
          this.authorFollowersCount = followers.length;
        });

        if (this.fundraiser.author.type == 'charity') {
          this.charityService.getCharityById(this.fundraiser.author.id).subscribe(charity => {
            this.fundraiserAuthor = charity;
          });
        } else if (this.fundraiser.author.type == 'company') {
          this.companyService.getCompanyById(this.fundraiser.author.id).subscribe(company => {
            this.fundraiserAuthor = company;
          });
        } else {
          this.userService.getMember(this.fundraiser.author.id).subscribe(member => {
            this.fundraiserAuthor = member;
          });
        }

        this.seoService.updateMetaTags({
          tabTitle: this.fundraiser.title?.substring(0, 69),
          description: this.fundraiser.meta?.description?.substring(0, 154),
          title: this.fundraiser.title,
          type: 'fundraiser',
          image: { url: this.fundraiser.logo?.url },
          keywords: this.fundraiser.meta?.keyword,
        });
      });
      this.setUserDetails();
    });
    
  }

  loadMoreArticle() {
    const fundraiserId = this.fundraiser.id;
    this.articleService.getArticlesByAuthor(fundraiserId, 2, 'next', this.lastArticleIndex).subscribe((articleData) => {
      let mergedData: any = [...this.fundraiserArticles, ...articleData.articleList];
      this.fundraiserArticles = this.getDistinctArray(mergedData)
      this.lastArticleIndex = articleData.lastVisible;
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

  getTextArticles() {
    if (this.textArticles.length != 0)
      return;
    const fundraiserId = this.fundraiser.id; 
    this.articleService.getArticlesByUser(fundraiserId, 2, 'first', null, 'text').subscribe((data) => {
      this.textArticles = data.articleList;
      this.lastArticleIndexOfText = data.lastVisible;
    })
  }

  getAudioArticles() {
    if (this.audioArticles.length != 0)
      return;
    const CompanyId = this.fundraiser.id;
    this.articleService.getArticlesByUser(CompanyId, 2, 'first', null, 'audio').subscribe((articleData) => {
      this.audioArticles = articleData.articleList;
      this.lastArticleIndexOfAudio = articleData.lastVisible;
    })
  }
  getVideoArticles() {
    if (this.videoArticles.length != 0)
      return;
    const CompanyId = this.fundraiser.id;
    this.articleService.getArticlesByUser(CompanyId, 2, 'first', null, 'video').subscribe((articleData) => {
      this.videoArticles = articleData.articleList;
      this.lastArticleIndexOfVideo = articleData.lastVisible;
    })
  }

  ngAfterViewChecked(): void {
    if (!this.isLoaded) {
      delete window['addthis']
      setTimeout(() => { this.loadScript(); }, 100);
      this.isLoaded = true;
    }
  }

  getUserDetails() {
    return {
      fullname: this.userDetails.fullname,
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      avatar: this.userDetails.avatar ? this.userDetails.avatar : '',
      id: this.userDetails.id,
    }
  }

  setFollowOrNot() { debugger
    this.fundraiserService.isUserFollowing(this.fundraiser.id, this.getUserDetails().id).subscribe((data) => {
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

  async follow() { debugger
    await this.setUserDetails();
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.fundraiserService.followFundraiser(this.fundraiser.id).then(data => {
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
      await this.fundraiserService.unfollowFundraiser(this.fundraiser.id).then(data => {
        this.setFollowOrNot();
      });
    } else {
      this.showModal()
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

  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}

