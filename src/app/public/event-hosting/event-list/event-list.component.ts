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


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  pageHeader: string = "events";
  eventTypes = EventHostConstant.EventTypes;
  eventImages = EventHostConstant.TypesImages;

  
  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private languageService: LanguageService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    public authService: AuthService
  ) {
    
   }

  ngOnInit(): void {
  }
  replaceImage(name) {
    return 'assets/images/events/'+name+EventHostConstant.IMAGE_EXTENSION;
  }

}
