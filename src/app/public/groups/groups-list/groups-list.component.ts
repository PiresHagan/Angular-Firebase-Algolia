import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/shared/services/authentication.service";
import { GroupConstant } from "src/app/shared/constants/group-constants";
import { NzMessageService } from "ng-zorro-antd/message";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService, UploadFile } from "ng-zorro-antd";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/app/shared/services/language.service";
import { SeoService } from "src/app/shared/services/seo/seo.service";
import { AnalyticsService } from "src/app/shared/services/analytics/analytics.service";
import { UserService } from "src/app/shared/services/user.service";
import { User } from "src/app/shared/interfaces/user.type";
import { EventHostConstant } from "src/app/shared/constants/event-host-constants";
import { EventsService } from "src/app/shared/services/events.services";
import { AuthorService } from "src/app/shared/services/author.service";
import { GroupsService } from "src/app/shared/services/group.service";
import { Member } from "src/app/shared/interfaces/member.type";
import {CitiesContriesConstant} from "src/app/shared/constants/all-countries-cities-constant"
import { STRING_TYPE } from "@angular/compiler";


@Component({
  selector: "app-groups-list",
  templateUrl: "./groups-list.component.html",
  styleUrls: ["./groups-list.component.scss"],
})
export class GroupsListComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private languageService: LanguageService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    public authService: AuthService,
    public eventsService: EventsService,
    private router: Router,
    private modal: NzModalService,
    public authorService: AuthorService,
    public groupService: GroupsService,
    public fb: FormBuilder,
    private message: NzMessageService,
  ) {}

  groupList: any = [];
  query: string;
  isLoggedInUser: boolean = false;
  userDetails: User;
  loading: boolean = true;
  title: string;
  // searching 
  searchValue;
  showResult: boolean = false;
  searchres:any;
  lastVisible: any;
  cities_countries_list = CitiesContriesConstant.CITIES_BY_COUNTRY;
  country_list = Object.keys(CitiesContriesConstant.CITIES_BY_COUNTRY);
  city_list = [];
  groupTypes = EventHostConstant.GroupTypes;
  groupSizes = EventHostConstant.GroupSize;
  groupForm: FormGroup;
  isSize: boolean = false;
  isType: boolean = false;
  isName: boolean = true;
  isSubscription: boolean = false;
  isSearch:boolean=false;
  searchfield: string= "name";  
  loadingMore: boolean=false;
  groupPackages = GroupConstant.YEARLY_PACKAGES;
  ngOnInit(): void {
    window.addEventListener("scroll", this.scrollEvent, true);
    this.loadingMore = true;
          this.groupService
            .getAllGroups()
            .subscribe((data) => {
              this.loadingMore = false;
              this.groupList = data.groups;
              this.lastVisible = data.lastVisible;
              this.loading=false;
              this.getTitleBySearchField();

            });
  //  getgroupsByUser
 
 /* this.route.paramMap.subscribe(params => {

    this.query = params.get('user_id');
    if (this.query == 'undefined')
      return;

  });*/
  this.setUserDetails();
  this.createForm();
  }
  createForm() {
    this.groupForm = this.fb.group({
      group_name: ["", [Validators.maxLength(30)]],
      group_type: ["", []],
      group_size: ["", []],
      group_subscription: ["",[]]
    });
  }
 getTitleBySearchField(){
  console.log("search",this.searchValue+' '+this.searchfield);
   switch (this.searchfield){
     case "size":
       this.title= this.searchValue+"-"+this.translate.instant("Member");
       break;
      case "type":
        this.title=this.translate.instant(this.searchValue);
        break;
      case "subscription":
        this.title = this.searchValue+"/"+this.translate.instant("year")+" "+this.translate.instant('Subscription');
        break;
      default:
        this.title="";
        break;
   }
 }
 addNewGroup(){
  const userId = this.userDetails.id;
    if (this.userDetails) {
      this.isLoggedInUser = true;
      this.router.navigateByUrl("/groups/new");
    } else {
      this.userDetails = null;
      this.isLoggedInUser = false;
    }
 }
  async setUserDetails() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user) {
        this.userDetails = null;
        this.isLoggedInUser = false;

        this.modal.error({
          nzTitle: this.translate.instant("URL404"),
          nzContent: this.translate.instant("URLNotFound"),
          nzOnOk: () => this.router.navigate(["/"]),
        });
        return;
      }
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.isLoggedInUser = true;
     
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    });
  }
  getMyGroups(){
    const userId = this.userDetails.id;
    if (this.userDetails) {
      this.isLoggedInUser = true;
      this.groupService.getgroupsByUser(this.userDetails.id).subscribe((data) => {
        this.groupList = data;
        // this.groupSize = this.groupList.length
        
      });
    } else {
      this.userDetails = null;
      this.isLoggedInUser = false;
    }
  }
  public trackItem(index: number, item: any) {
    return item;
  }
   myGroups(){
    if (this.userDetails) {
      this.isLoggedInUser = true;
      this.groupService.getgroupsByUser(this.userDetails.id).subscribe((data) => {
        this.groupList = data;
        // this.groupSize = this.groupList.length
        this.loading=false;
        this.title="MyGroups";
        // this.loading = false;
      });
    } else {
      this.userDetails = null;
      this.isLoggedInUser = false;
    }
   }
  getCoverImage() {
    return "assets/images/groups/cov.jpeg";
  }
  // searching
  getsearchfield(searchfield:any){
    this.searchfield = searchfield
    if(searchfield === "size"){
      this.isSize = true;
      this.isType=false;
      this.isName=false;
      this.isSubscription = false;

    }
    else if(searchfield === "type"){
      this.isSize = false;
      this.isType=true;
      this.isName = false;
      this.isSubscription = false;
    }
    else if(searchfield === "subscription"){
      this.isSize=false;
      this.isType=false;
      this.isName=false;
      this.isSubscription = true;
    }
    else{
      this.isSize = false;
      this.isType=false;
      this.isName = true;
      this.isSubscription = false;
    }
    
  }
  
  getGroups(nav = ''){
    this.getTitleBySearchField();
    if(nav == 'next'){
      
      this.groupService.getGroupsBySearch(20 ,nav, this.lastVisible,this.searchfield,this.searchValue).subscribe((data) => {
      this.groupList = data.groupsList;
    this.lastVisible = data.lastVisible;
    this.loading = false;
      });
      
    }
    else{
      this.groupService.getGroupsBySearch(20 ,nav, this.lastVisible,this.searchfield,this.searchValue).subscribe((data) => {
      
        this.groupList = data.groupsList;
    this.lastVisible = data.lastVisible;
    this.loading = false;
      });
    }
   /* this.serviceService.getServicessearch(20, nav, this.lastVisible,this.selectedcategory,  this.selectedLanguage,this.searchres,this.searchfield).subscribe((data) => {
      this.services = data.serviceList;
      this.lastVisible = data.lastVisible;
      this.loadingMore = false;
      this.loading = false;
      this.isSearch=true
    });
    */
  
}
onTypeChange(value: any){
this.searchValue = value
}
onNameChange(event:any){
  this.searchValue=event.target.value;

}
onSizeChange(value:any){
  this.searchValue = value;
}
onSubscriptionChange(value: any){
  this.searchValue = value;
}
  resetSearch(){
    this.searchres = ""
    // this.getPageDetails()
    this.isSearch=false;
    this.searchValue="";
    this.searchfield="";
    this.getPageDetails();

  }
  getPageDetails() {

    this.groupService.getGroupsBySearch(20, '', this.lastVisible, this.searchfield,this.searchValue).subscribe((data) => {
      this.groupList = data.groupsList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
      this.getTitleBySearchField();
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
          this.groupService
            .getAllGroups(20, "next", this.lastVisible)
            .subscribe((data) => {
              this.loadingMore = false;
              this.groupList = [...this.groupList, ...data.groups];
              this.lastVisible = data.lastVisible;
            });
        }
      }
    } else {
      if (this.isSearch) {
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
            this.groupService.getGroupsBySearch(20, '', this.lastVisible, this.searchfield,this.searchValue).subscribe((data) => {
              this.groupList = data.groupsList;
              this.lastVisible = data.lastVisible;
              this.loading = false;
            });
          }
        }
    }
  };
}
 
}
