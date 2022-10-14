import { Component ,HostListener, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/shared/services/service.service';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {

  selectedLanguage: string = '';
  slugWiseData = {};
  selectedcategory: any;
  categories: any;
  services: any;
  loading: boolean = true;
  private homeDocument = 'home';
  categoryskeletonData:any;
  loadingMore: boolean = false;
  lastVisible: any = null;
  showResult: boolean = false;
  searchres:any;
  searchfield: any;
  isSearch : boolean = false;
  isCountry: boolean = false;


  constructor(
    private serviceService: ServiceService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private languageService: LanguageService,
    private seoService: SeoService,
    
  ) { }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  DefaultAvatar: string = 'assets/images/default-avatar.png';


  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.seoService.updateTagsWithData(this.homeDocument);
    
    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.route.queryParams.subscribe(() => {
      this.getPageDetails();
    });

    this.translate.onLangChange.subscribe(() => {
      this.selectedLanguage = this.languageService.getSelectedLanguage()
      this.categories = this.categoryService.getAllser(this.selectedLanguage)

    });
    this.categoryService.getAllser(this.selectedLanguage).subscribe((data) => {
      this.categories = data;

    })

    this.categoryskeletonData = new Array(20).fill({}).map((_i, index) => {
      return 
    });

  }
 
  scrollEvent = (event: any): void => {

    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {

      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        if(this.isSearch){
          this.getService('next')
        }
        else
        this.serviceService.getServices(20, 'next', this.lastVisible,this.selectedcategory, this.selectedLanguage).subscribe((data) => {
          this.loadingMore = false;
          this.services = [...this.services, ...data.serviceList];
          this.lastVisible = data.lastVisible;
        });
      }
    }
    
  }
  getsearchfield(searchfield:any){

    this.searchfield = searchfield
    if(searchfield == "country")this.isCountry = true
    else this.isCountry = false
    
  }

  getService(nav = ''){

    if(nav == 'next'){
      this.serviceService.getServicessearch(20 ,nav, this.lastVisible,this.selectedcategory,  this.selectedLanguage,this.searchres,this.searchfield).subscribe((data) => {
        this.services = [...this.services, ...data.serviceList];
        this.lastVisible = data.lastVisible;
        this.loadingMore = false;
        this.loading = false;
        this.isSearch=true
      });
    }
    else
    this.serviceService.getServicessearch(20, nav, this.lastVisible,this.selectedcategory,  this.selectedLanguage,this.searchres,this.searchfield).subscribe((data) => {
      this.services = data.serviceList;
      this.lastVisible = data.lastVisible;
      this.loadingMore = false;
      this.loading = false;
      this.isSearch=true
    });
    
  }
  
  resetSearch(){
    this.searchres = ""
    this.getPageDetails()
    this.isSearch=false
  }

  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', 'https://assets.mytrendingstories.com/')
        .replace('http://cdn.mytrendingstories.com/', 'https://cdn.mytrendingstories.com/')
        .replace('https://abc2020new.com/', 'https://assets.mytrendingstories.com/');
    }
    return latestURL;
  }
  skeletonData = new Array(5).fill({}).map((_i, index) => {
    return 
  });
  TrendingskeletonData = new Array(15).fill({}).map((_i, index) => {
    return 
  });


  getPageDetails(catslug = null) {

    this.searchfield = "title"
    this.selectedcategory=catslug
    this.serviceService.getServices(20, '', this.lastVisible,this.selectedcategory,  this.selectedLanguage).subscribe((data) => {
      this.services = data.serviceList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
    });
  }
}

