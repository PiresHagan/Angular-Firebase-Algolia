import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/shared/services/language.service";
import { SeoService } from "src/app/shared/services/seo/seo.service";
import { AnalyticsService } from "src/app/shared/services/analytics/analytics.service";
import { AuthService } from "src/app/shared/services/authentication.service";
import { EventsService } from "src/app/shared/services/events.services";
import { CitiesContriesConstant } from "src/app/shared/constants/all-countries-cities-constant";

@Component({
  selector: "app-events-by-type-list",
  templateUrl: "./events-by-type-list.component.html",
  styleUrls: ["./events-by-type-list.component.scss"],
})
export class EventsByTypeListComponent implements OnInit {
  eventType: string;
  events: any[];
  loading: boolean = true;
  loadingMore: boolean = false;
  lastVisible: any;
  cities_countries_list = CitiesContriesConstant.CITIES_BY_COUNTRY;
  country_list = [...new Set(Object.keys(CitiesContriesConstant.CITIES_BY_COUNTRY))];
  city_list = [];
  /// for search
  searchValue;
  showResult: boolean = false;
  searchres: any;
  searchfield: any;
  isSearch: boolean = false;
  isCountry: boolean = false;
  defaultSelectedCurrency: string;
  city: string;
  country: string;
  name: string;

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private languageService: LanguageService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    public authService: AuthService,
    public eventsService: EventsService
  ) {}

  ngOnInit(): void {
    window.addEventListener("scroll", this.scrollEvent, true);
    this.route.paramMap.subscribe((params) => {
      this.eventType = params.get("eventType");
      if (this.eventType == "undefined") return;

      // get all events of eventType
      this.getPageDetails();
    });
  }
  getsearchfield(searchfield: any) {
    this.searchfield = searchfield;
    if (searchfield === "location") {
      this.isCountry = true;
      this.searchfield = "country";
      this.name=null;
    } else {
      this.isCountry = false;
      this.searchfield = "name";
      this.city=null;
      this.country=null;

    }
  }
  onCityChange(value) {
    console.log(value);
    this.city = value;
  }

  getEvents() {
    this.isSearch = true;
    // get values
    if (this.isCountry) {
      this.eventsService
        .getEventsByTypeSearch(
          20,
          "",
          this.lastVisible,
          this.eventType,
          this.isCountry,
          this.country,
          this.city
        )
        .subscribe((data) => {
          this.events = data.articleList;
          console.log("events", this.events);
          this.lastVisible = data.lastVisible;
          this.loading = false;
        });
    } else {
      this.eventsService
        .getEventsByTypeSearch(
          20,
          "",
          this.lastVisible,
          this.eventType,
          this.isCountry,
          this.name,
          null
        )
        .subscribe((data) => {
          this.events = data.articleList;
          console.log("events", this.events);
          this.lastVisible = data.lastVisible;
          this.loading = false;
        });
    }
  }
  getMyEvents(){
   
  }
  resetSearch() {
    this.isSearch = false;
    this.getPageDetails();
  }
  onCountryChange(countryValue) {
    // get cities from country value
    this.city_list = [...new Set(this.cities_countries_list[countryValue])];
    this.country = countryValue;
    // populate cities to city form controle
    // document.getElementById('cityList').tabIndex = 0;
  }
  onNameChange(event: any) {
    this.name = event.target.value;
  }
  getPageDetails() {
    this.eventsService
      .getEventsByType(20, "", this.lastVisible, this.eventType)
      .subscribe((data) => {
        this.events = data.articleList;
        console.log("events", this.events);
        this.lastVisible = data.lastVisible;
        this.loading = false;
      });
  }
  scrollEvent = (event: any): void => {
    if (!this.isSearch) {
      let documentElement = event.target.documentElement
        ? event.target.documentElement
        : event.target;
      if (documentElement) {
        const top = documentElement.scrollTop;
        const height = documentElement.scrollHeight;
        const offset = documentElement.offsetHeight;
        if (
          top > height - offset - 1 - 100 &&
          this.lastVisible &&
          !this.loadingMore
        ) {
          this.loadingMore = true;
          this.eventsService
            .getEventsByType(20, "next", this.lastVisible, this.eventType)
            .subscribe((data) => {
              this.loadingMore = false;
              this.events = [...this.events, ...data.articleList];
              this.lastVisible = data.lastVisible;
            });
        }
      }
    } else {
      if (!this.isSearch) {
        let documentElement = event.target.documentElement
          ? event.target.documentElement
          : event.target;
        if (documentElement) {
          const top = documentElement.scrollTop;
          const height = documentElement.scrollHeight;
          const offset = documentElement.offsetHeight;
          if (
            top > height - offset - 1 - 100 &&
            this.lastVisible &&
            !this.loadingMore
          ) {
            this.loadingMore = true;
            this.eventsService
              .getEventsByTypeSearch(20, "next", this.lastVisible, this.eventType,this.isCountry,this.searchValue,this.city)
              .subscribe((data) => {
                this.loadingMore = false;
                this.events = [...this.events, ...data.articleList];
                this.lastVisible = data.lastVisible;
              });
          }
        }
    }
  };
}
}
