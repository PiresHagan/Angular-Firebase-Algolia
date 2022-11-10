import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from 'src/app/shared/services/language.service';
import { LandingPageService } from 'src/app/shared/services/landing-page.service';
import { LandingPage } from 'src/app/shared/interfaces/landingpage.type';
@Component({
  selector: 'app-subscribe-user-type',
  templateUrl: './subscribe-user-type.component.html',
  styleUrls: ['./subscribe-user-type.component.scss']
})
export class SubscribeUserTypeComponent implements OnInit {
  selectedLanguage: string = '';
  landingPageData;
  lang: any;
  constructor(
    private route: ActivatedRoute,
    private langService: LanguageService,
    private LandingPageService: LandingPageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();
      const slug = params.get('user_type');
      this.route.data.subscribe(data => {
        this.lang = data.lang;
      })
      this.LandingPageService.getLandingPageData(this.lang, slug).subscribe(data => { 
        this.landingPageData = data[0];
      });
    });
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('remove-header-footer');
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

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('remove-header-footer');
  }
}
