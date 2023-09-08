import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService, NzScrollService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { HairSalonConstant } from 'src/app/shared/constants/hair-salon-constant';
import { HairSalonService } from 'src/app/shared/services/hair-salon.service';
import { BookingDetails, BookingRequest, HairSalonType, PublicProfileSubscription } from 'src/app/shared/interfaces/hair-salon.type';
import { AuthorService } from 'src/app/shared/services/author.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Article } from 'src/app/shared/interfaces/article.type';
import { ArticleService } from 'src/app/shared/services/article.service';
import {HAIRSALON } from 'src/app/shared/constants/member-constant';
import { differenceInDays} from 'date-fns';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-hair-salon-details',
  templateUrl: './hair-salon-details.component.html',
  styleUrls: ['./hair-salon-details.component.scss']
})
export class HairSalonDetailsComponent implements OnInit {

  hairsalon: HairSalonType;
  isLoggedInUser: boolean = false;
  likedPressed: boolean = false;
  disLikedPressed: boolean = false;
  userDetails: User;
  owner;
  isFollowing: boolean = false;
  isLike: boolean = false;
  lastVisibleFollower;
  followers=[];
  hairSalonViewCount: number = 0;
  hairSalonLikes: number = 0;
  isShareVisibleMiddle = true;
  showShare = false;
  searchOptions=[];
  similarHairSalonsList=[];
  lastHairSalonDoc;
  hairsalon_status;
  canBook : boolean=false;
  allArticles: Article[];
  lastArticleIndex;
  audioArticles: Article[] = [];
  videoArticles: Article[] = [];
  textArticles: Article[] = [];
  lastArticleIndexOfAudio;
  lastArticleIndexOfVideo;
  lastArticleIndexOfText;
  showTextArticls: boolean = false;
  showAudioArticls: boolean = false;
  showVideoArticls: boolean = false;
  hairSalonAllServicesList: Object;
  hairSalonAllServiceSelected: any;
  hairSalonAllServiceSelectedId: any;
  bookingDate = null;
  hairSalonServicesTimeSlotsList= [];
  selectedTimeSlot: any;
  isLoaded: boolean = false;
  isUpdatingFollow: boolean = false;
  selectedLanguage: string = "";
  isVisible = false;
  isOkLoading = false;
  hairSalonUserType: string= HAIRSALON;
  hairSalonServiceReceiveTypeList:any;
  hairSalonServiceSelectedReceiveTypeList: any[];
  hairSalonServiceReceiveTypeSelected: any;
  hairSalonServiceReceiveTypeAtClientAddress: any;
  hairSalonServiceClientReceiveAddressSelected: string = '';
  hairSalonServiceBookingId:string=null;
  currentPublicProfileSubscription: PublicProfileSubscription = null;
  first_nameValue: string = '';
  last_nameValue: string = '';
  emailValue: string = '';
  mobile_number: string = '';
  today = new Date();
  disabledDate = (current: Date): boolean =>
  differenceInDays(current, this.today) < 0;
  hairSalonId: string;
  viewCountChanged: boolean = false;
  isRequestMoreInfo: boolean = false;
  showSubscriptionDialog: boolean = false;
  isSubscriptionDialogVisible: boolean = false;
  isSubscriptionDialogOkLoading: boolean = false;
  hairSalonSubscriptionUrl:any;
  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private languageService: LanguageService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    public authService: AuthService,
    public hairsalonsService: HairSalonService,
    private router: Router,
    private modalService: NzModalService,
    public authorService: AuthorService,
    public articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.hairSalonServiceReceiveTypeList = HairSalonConstant.HAIR_SALON_RECEIVE_SERVICES_TYPES;
    this.hairSalonServiceReceiveTypeAtClientAddress = HairSalonConstant.ATCLIENTHOMED;

    this.route.paramMap.subscribe(params => {
      this.hairSalonId = params.get('hairSalonId');
      this.hairsalonsService.getHairSalonById(this.hairSalonId).subscribe(hairsalon_ => {
      this.hairsalon = hairsalon_;
      this.hairSalonViewCount = this.hairsalon.view_count;
      this.hairSalonLikes = this.hairsalon.likes_count;
      if (!this.hairsalon )
        {
            this.modalService.error({
              nzTitle: this.translate.instant('URL404'),
              nzContent: this.translate.instant('URLNotFound'),
              nzOnOk: () => this.router.navigate(['/'])
            });
            return;
      }
      this.route.queryParams.subscribe(params => {
          const bookingStatus = params['booking-status'];
          const boid = params['boid'];
          if(bookingStatus=='success' && boid){
            const bookingStatusData ={isPaid:'Yes'};
            this.hairsalonsService.updateHairSalonBookingPaymentStatus(this.hairsalon.id, boid, bookingStatusData).subscribe((bookingData: any) => {
              if(bookingData.bookingId){
                this.showWarningMessage("PAYMENTSUCCESS");
              }
              else{
                this.showError("PAYMENTFAILD");
              }
            });
          }
          else if(bookingStatus=='error'){
            this.showError("PAYMENTFAILD");
          }
          try{
            // Remove query params
            this.router.navigate([], {
              queryParams: {
                'booking-status': null,
                'boid': null,
              },
              queryParamsHandling: 'merge'
            });
          }
          catch(er){}
        });
      this.getOwnerDetails();
      this.getHairSalonAllServices();
      this.hairsalonsService.getSimilarHairSalons(10,'',this.lastHairSalonDoc, this.hairsalon.type).subscribe(({ hairSalonList, lastVisible }) => {
        this.similarHairSalonsList = hairSalonList.filter(s=>{
          if(s.id !== this.hairsalon.id)
          return s;
        })
        this.lastHairSalonDoc = lastVisible;
      });

      this.articleService.getArticlesByUser(this.hairsalon.id,  10, null, this.lastArticleIndex).subscribe((data) => {
        this.allArticles = data.articleList;
        this.lastArticleIndex = data.lastVisible;
        this.lastArticleIndexOfAudio = data.lastVisible;
        this.lastArticleIndexOfText = data.lastVisible;
        this.lastArticleIndexOfVideo = data.lastVisible;
        this.textArticles=this.allArticles.filter(a=>{
          if(a.type!=='audio' && a.type!=='video'){
            return a;
          }
        });
        this.videoArticles=this.allArticles.filter(a=>{
          if(a.type==='video'){
            return a;
          }
        });
        this.audioArticles=this.allArticles.filter(a=>{
          if(a.type==='audio'){
            return a;
          }
        });
      });
      if(!this.viewCountChanged){
        this.hairsalonsService.updateViewCount(this.hairsalon.id).then((res:any)=>{
          if(res.error && res.error==false){
            this.viewCountChanged = false;
          }
          else{
            this.viewCountChanged = true;
          }
        });
      }
      });
    });
  }
  getFollowersDetails() {
    this.authorService.getAllFollowersByAuthorType(this.hairsalon.id, this.hairSalonUserType).subscribe((data) => {
      if (data) {
        this.followers = data;
        this.isFollowing = true;
      } else {
        this.isFollowing = false;
      }
    });
  }
  getExactExternalHttpLink(url: any){
    return String(url).startsWith('http') ? url : 'http://' + url;
  }
  getExactExternalHttpsLink(url: any){
    return String(url).startsWith('http') ? url : 'https://' + url;
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
        this.first_nameValue = this.userDetails.fullname;
        this.last_nameValue = this.userDetails.fullname;
        this.emailValue = this.userDetails.email;
        this.mobile_number = this.userDetails.phone;
        this.setFollowOrNot();
        this.setLike();
        if(this.owner && this.userDetails && this.userDetails.id == this.owner.id && !(this.currentPublicProfileSubscription && this.currentPublicProfileSubscription?.status == 'active')){
          this.hairSalonSubscriptionUrl = `${environment.consoleURL}/hair-salon/hair-salon-details/${this.hairSalonId}`;
          this.showSubscriptionDialog=true;
          this.showSubscriptionDialogModal();
        }
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    })
  }

  showSubscriptionDialogModal(): void {
    this.isSubscriptionDialogVisible = true;
  }
  handleSubscriptionDialogOk(): void {
    this.isSubscriptionDialogOkLoading = true;
    setTimeout(() => {
      this.authService.redirectToConsole(this.hairSalonSubscriptionUrl, {});
      this.isSubscriptionDialogOkLoading = false;
    }, 3000);
  }

  handleSubscriptionDialogCancel(): void {
    this.isSubscriptionDialogVisible = false;
  }

  getOwnerDetails(){
    if(this.hairsalon && this.hairsalon.owner && this.hairsalon.owner.id){
      this.authorService.getAuthorById(this.hairsalon.owner.id).subscribe(owner=>{
        this.owner=owner[0];
        this.getFollowersDetails();
        this.hairsalonsService.getHairSalonPublicProfileSubscription(this.hairsalon.id).subscribe((data) => {
          this.currentPublicProfileSubscription = data[0];
          this.setUserDetails();
        });
      });
    }
  }
  getHairSalonAllServices(){
    this.hairsalonsService.getHairSalonServices(this.hairsalon.id).subscribe(res => {
      this.hairSalonAllServicesList = res;
    });
  }
  async follow() {
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.hairsalonsService.followHairSalon(this.hairsalon.id).then(data => {
        this.setFollowOrNot();
        this.isUpdatingFollow = false;
      });
    } else {
      this.showModal()
    }
  }

  async unfollow() {
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.hairsalonsService.unfollowHairSalon(this.hairsalon.id).then(data => {
        this.setFollowOrNot();
        this.isUpdatingFollow = false;
      });
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
  setFollowOrNot() {
    this.authorService.isUserFollowing(this.hairsalon.id, this.getUserDetails().id, this.hairSalonUserType).subscribe((data) => {
      if (data) {
        this.isFollowing = true;
      } else {
        this.isFollowing = false;
      }
    });
    this.isUpdatingFollow = false;
  }
  getUserDetails() {
    return {
      fullname: this.userDetails.fullname,
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      avatar: this.userDetails.avatar ? this.userDetails.avatar : '',
      id: this.userDetails.id,
    }
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
  SlideRelatedArticle: boolean = false;
  slideArticle() {
    this.SlideRelatedArticle = !this.SlideRelatedArticle;
  }
  getRelativeDate(date: string) {
    return moment(date).fromNow();
  }

  toggleTextArticls(){
    this.showTextArticls = !this.showTextArticls;
    this.showVideoArticls = false;
    this.showAudioArticls = false;
  }
  toggleVideoArticls(){
    this.showVideoArticls = !this.showVideoArticls;
    this.showTextArticls = false;
    this.showAudioArticls = false;
  }
  toggleAudioArticls(){
    this.showAudioArticls = !this.showAudioArticls;
    this.showTextArticls = false;
    this.showVideoArticls = false;
  }
  loadMoreArticle(){

  }

  selectHairSalonService(hairSalonService){
    this.bookingDate = null;
    this.selectedTimeSlot = null;
    this.hairSalonServiceReceiveTypeSelected =null;
    this.hairSalonServiceClientReceiveAddressSelected =null;
    this.hairSalonAllServiceSelected = hairSalonService;
    this.hairSalonAllServiceSelectedId = hairSalonService.id;
    if(this.hairSalonAllServiceSelected.service_deliver_type== HairSalonConstant.ATSALON)
    {
      this.hairSalonServiceSelectedReceiveTypeList = [{type:HairSalonConstant.ATSALOND, price:0}];
      this.hairSalonServiceReceiveTypeSelected = this.hairSalonServiceSelectedReceiveTypeList[0];
    }
    if(this.hairSalonAllServiceSelected.service_deliver_type== HairSalonConstant.ATCLIENTHOME)
    {
      this.hairSalonServiceSelectedReceiveTypeList = [{type:HairSalonConstant.ATCLIENTHOMED, price:0 + this.hairSalonAllServiceSelected.service_deliver_price}];
      this.hairSalonServiceReceiveTypeSelected = this.hairSalonServiceSelectedReceiveTypeList[0];
    }
    if(this.hairSalonAllServiceSelected.service_deliver_type== HairSalonConstant.ATSALONATCLIENTHOME)
    {
      this.hairSalonServiceSelectedReceiveTypeList = [{type:HairSalonConstant.ATSALOND, price:0}, {type:HairSalonConstant.ATCLIENTHOMED, price:0 + this.hairSalonAllServiceSelected.service_deliver_price}];
      this.hairSalonServiceReceiveTypeSelected = this.hairSalonServiceSelectedReceiveTypeList[0];
    }
  }
  onBookingDateChange(result: Date): void {
    this.bookingDate = result;
    this.getHairSalonServiceTimeSlot();
  }
  getHairSalonServiceTimeSlot(){
    if(!this.hairsalon ||!this.hairSalonAllServiceSelected || !this.bookingDate)
    return;
    const bookingDateData={date:this.bookingDate};
    this.hairsalonsService.getHairSalonTimeSlot(this.hairsalon.id, this.hairSalonAllServiceSelectedId, bookingDateData).subscribe(res => {
      if(res){
        const price = res['price'];
        const filteredTimeSlots = res['filteredTimeSlots'];
        this.hairSalonServicesTimeSlotsList = filteredTimeSlots;
      }
      else{
        this.hairSalonServicesTimeSlotsList = [];
      }
    });
  }
  selectHairSalonServiceTimeSlot(timeSlot:any){
    this.selectedTimeSlot = timeSlot;
  }

  isEmptyOrSpaces(str){
    if(!str || str==null || str==undefined || str=='undefined')
      return true;
    else return str === null || str.match(/^ *$/) !== null;
  }
  ContinueToServicePayment(){
    if(this.hairsalon && this.selectHairSalonService && this.bookingDate && this.selectedTimeSlot  && this.selectHairSalonServiceReceiveType){
      let deliver_service_price:number=0;
      if(this.hairSalonServiceReceiveTypeSelected.type == HairSalonConstant.ATCLIENTHOMED){
        deliver_service_price = this.hairSalonServiceReceiveTypeSelected.price;
        if(this.hairSalonServiceClientReceiveAddressSelected==null || this.isEmptyOrSpaces(this.hairSalonServiceClientReceiveAddressSelected)){
          this.showError("YouShouldEnterYourAddressError");
          return;
        }
      }
      let bookingequest :BookingRequest;
      if(this.isEmptyOrSpaces(this.first_nameValue)){
        this.showError('FirstNameValidationError');
        return;
      }
      if(this.isEmptyOrSpaces(this.last_nameValue)){
        this.showError('LastNameValidationError');
        return;
      }
      if(!this.IsValidEmail(this.emailValue)){
        this.showError('EmailValidationError');
        return;
      }
      if(this.isEmptyOrSpaces(this.mobile_number)){
        this.showError('MobileValidationError');
        return;
      }
      if(this.first_nameValue && this.last_nameValue && this.emailValue && this.IsValidEmail(this.emailValue) && this.mobile_number){
        bookingequest= {
          first_name: this.first_nameValue,
          last_name: this.last_nameValue,
          email: this.emailValue,
          mobile_number: this.mobile_number,
          notes: 'notes',
          success_url:  window && window.location && `${window.location.href}?booking-status=success` || '',
          cancel_url: window && window.location && `${window.location.href}?booking-status=error`|| '',
          service_id: this.hairSalonAllServiceSelectedId,
          booking_time: {
            start_time: this.selectedTimeSlot.startTime,
            end_time: this.selectedTimeSlot.endTime,
          },
          date: this.bookingDate,
          hair_salon_id : this.hairsalon.id,
          service_deliver_type : this.hairSalonServiceReceiveTypeSelected.type,
          client_address : this.hairSalonServiceClientReceiveAddressSelected?this.hairSalonServiceClientReceiveAddressSelected:'none',
          deliver_service_price:deliver_service_price
        }
        this.hairsalonsService.submitHairSalonBooking(this.hairsalon.id, this.hairSalonAllServiceSelectedId,bookingequest).subscribe((bookingData: any) => {
          if(bookingData.bookingId){
            this.hairSalonServiceBookingId = bookingData.bookingId;
          }
          else{
            this.showError("AccountError");
          }
          if (bookingData.redirectUrl) {
            window && window.open(bookingData.redirectUrl, '_self');
          } else {
            this.showError("AccountError");
          }
        });
      }
      else{
        this.showError('YouShouldEnterYourPersonalInfoOrSignInError');
      }
    }
  }
  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }
  showWarningMessage(message) {
    let $message = this.translate.instant(message);
    this.modalService.warning({
      nzTitle: $message,
    });
  }
  selectHairSalonServiceReceiveType(selectedValue){
    this.hairSalonServiceReceiveTypeSelected = selectedValue;
  }
  setclientReceiveAddress(addressValue){
    this.hairSalonServiceClientReceiveAddressSelected = addressValue;
  }

  onUserFNInputChange(inputValue){
    if(!this.isEmptyOrSpaces(inputValue))
      this.first_nameValue = inputValue;
    else
      this.first_nameValue = null;
  }
  onUserLNInputChange(inputValue){
    if(!this.isEmptyOrSpaces(inputValue))
      this.last_nameValue = inputValue;
    else
      this.last_nameValue = null;
  }
  onUserEmailInputChange(inputValue){
    if(this.isEmptyOrSpaces(inputValue)){
      this.emailValue = null;
      return;
    }
    if(this.IsValidEmail(inputValue))
      this.emailValue = inputValue;
    else
      this.emailValue = null;
  }
  onUserMNInputChange(inputValue){
    if(!this.isEmptyOrSpaces(inputValue))
      this.mobile_number = inputValue;
    else
      this.mobile_number = null;
  }

  like() {
    if (this.isLoggedInUser) {
      if(!this.likedPressed){
        this.likedPressed=true;
        this.hairsalonsService.like(this.hairsalon.id, {userId: this.getUserDetails().id}).then((res:any)=>{
          if(res.error && res.error==false){

          }
          else{
            this.hairSalonLikes++;
            this.isLike = true;
          }
          this.likedPressed=false;
        });
      }
    } else {
      this.showModal();
    }
  }
  disLike() {
    if (this.isLoggedInUser) {
      if(!this.disLikedPressed){
        this.disLikedPressed=true;
        this.hairsalonsService.disLike(this.hairsalon.id, {userId: this.getUserDetails().id}).then((res:any)=>{
          if(res.error && res.error==false){

          }
          else{
            this.hairSalonLikes--;
            this.isLike = false;
          }
          this.disLikedPressed=false;
        })
      }
    } else {
      this.showModal();
    }
  }
  setLike() {
    if(!this.userDetails) {
      this.isLike = false;
      return;
    }
    this.hairsalonsService.isLikedByUser(this.hairsalon.id, this.userDetails.id).subscribe((data) => {
      if (data) {
        this.isLike = true;
      } else {
        this.isLike = false;
      }
    });
  }

  hairSalonMoreInfo() {
    this.isRequestMoreInfo = !this.isRequestMoreInfo;
    if(this.isRequestMoreInfo){
      setTimeout(() => {
        document.getElementById('firstName').focus();
      }, 1000)
    }
  }

  IsValidEmail(email: string):boolean {
    const regEmail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
    if (!email || !email.match(regEmail)) {
        return false;
    }
    return true;
  }
}

