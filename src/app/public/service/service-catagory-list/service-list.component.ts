import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LanguageService } from 'src/app/shared/services/language.service';
import { Category } from 'src/app/shared/interfaces/category.type';
import * as firebase from 'firebase/app';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { EventHostConstant } from 'src/app/shared/constants/event-host-constants';
import { CategoryService } from 'src/app/shared/services/category.service';


@Component({
  selector: 'app-event-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceCatagoryComponent implements OnInit {
  pageHeader: string = "Services";
  eventTypes = EventHostConstant.EventTypes;
  categories: any;
  selectedLanguage: string = '';
  eventImages = [
    "Pets", "Legal", "Beauty", "Health", "Moving", "Real Estate Sell", 'Real Estate Locations',
    'Cleaning', 'Photography', 'Car Dealership', 'Car Rental', 'Skilled Traded'
  ];

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private languageService: LanguageService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    public authService: AuthService,
    private categoryService: CategoryService,


  ) {

  }

  ngOnInit(): void {
    this.selectedLanguage = this.languageService.getSelectedLanguage();

    this.translate.onLangChange.subscribe(() => {
      this.selectedLanguage = this.languageService.getSelectedLanguage()
      this.categories = this.categoryService.getAllser(this.selectedLanguage)

    });
    this.categoryService.getAllser(this.selectedLanguage).subscribe((data) => {
      this.categories = data;
      console.log(data)

    })
  }
  replaceImage(name) {
    return 'assets/images/service_category/' + name + ".jpg";
  }

}
