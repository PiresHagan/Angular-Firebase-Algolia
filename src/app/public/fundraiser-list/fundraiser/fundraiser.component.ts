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

@Component({
  selector: 'app-fundraiser',
  templateUrl: './fundraiser.component.html',
  styleUrls: ['./fundraiser.component.scss']
})

export class FundraiserComponent implements OnInit {
  fundraiser: Fundraiser;
  fundraiserAuthor;
  fundraiserId: string;
  isLoaded: boolean = false;
  selectedLanguage: string = "";
  donationPercentage: string = "0";
  authorFollowersCount: number = 0;
  // TEXT = TEXT;
  // AUDIO = AUDIO;
  // VIDEO = VIDEO;

  constructor(
    private route: ActivatedRoute,
    private langService: LanguageService,
    private fundraiserService: FundraiserService,
    private authorService: AuthorService,
    public translate: TranslateService,
    public userService: UserService,
    public companyService: CompanyService,
    public charityService: CharityService,
    private seoService: SeoService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');

      this.fundraiserService.getFundraiserBySlug(slug).subscribe(data => {
        this.fundraiser = data[0];

        this.fundraiserId = this.fundraiser.id;

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

