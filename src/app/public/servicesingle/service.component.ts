import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/shared/services/service.service';
import { Service } from 'src/app/shared/interfaces/service.type';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthorService } from 'src/app/shared/services/author.service';
import { environment } from 'src/environments/environment';
import { LanguageService } from 'src/app/shared/services/language.service';
import { NzModalService } from 'ng-zorro-antd';
import { TEXT, AUDIO, VIDEO } from 'src/app/shared/constants/article-constants';
import * as moment from 'moment';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceComponent implements OnInit, AfterViewInit {
  service: Service;
  serviceType: string;
  serviceLikes: number = 0;
  serviceVicewCount: number = 0;
  folnum: number = 0;
  authorDetails: any = {};
  followers: any = [];
  subscribers: any = [];
  slug: string;
  isLoggedInUser: boolean = false;
  isReportAbuseServiceLoading: boolean = false;
  userDetails: User;
  status: boolean;
  isFollowing: boolean = false;
  isLike: boolean = false;
  isLoaded: boolean = false;
  selectedLang: string = '';
  selectedLanguage: string = "";
  TEXT = TEXT;
  AUDIO = AUDIO;
  VIDEO = VIDEO;
  userSlug: string;
  serviceForm: any;
  isFormSaving:boolean=false;
  bookingURL: string;
  files: any[] = [];
  sharedUrl: string;
  
  recaptchaElement;
  isCaptchaElementReady: boolean = false;
  isCapchaScriptLoaded: boolean = false;
  captchaToken: string;
  capchaObject;
  invalidCaptcha: boolean = false;
  addLeadSuccess: boolean = false;

  @ViewChild('recaptcha') set SetThing(e: ServiceComponent) {
    this.isCaptchaElementReady = true;
    this.recaptchaElement = e;
    if (this.isCaptchaElementReady && this.isCapchaScriptLoaded) {
      this.renderReCaptcha();
    }
  }

  constructor(
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    public authService: AuthService,
    public authorService: AuthorService,
    public userService: UserService,
    private sanitizer: DomSanitizer,
    private langService: LanguageService,
    private modal: NzModalService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    private modalService: NzModalService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { 
    this.sharedUrl = "";
    this.serviceForm = this.formBuilder.group({
      fullname: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(70)]],
      email: ['', [Validators.required, Validators.email,]],
      phonenumber: ['', [Validators.required , Validators.pattern('[- +()0-9]+')]],
    });
    
  }

  ngOnInit(): void {
    this.bookingURL = environment.bookingURL;
    this.route.paramMap.subscribe(params => {

      this.selectedLanguage = this.langService.getSelectedLanguage();

      const slug = params.get('slug');
      this.userSlug = params.get('userSlug')
      this.authorService.getUserBySlug(this.userSlug).subscribe(author => {
        this.authorDetails = author;
        this.folnum = this.authorDetails.followers_count
        this.authorService.getFollowers_new(this.authorDetails.id, 6).subscribe((data) => {
          this.followers = data.followers;
        });
        this.setUserDetails();
        this.addRecaptchaScript();

      });

      this.serviceService.getService(slug).subscribe((service: any) => {
        this.service = service[0];
        if(service.type !== "text" && this.service.service_file) {
          this.files = [];
          if(this.service.service_file.others)
          this.service.service_file.others.forEach(file => {
            this.files.push(file);
          });

          if (this.getSharedURL()) {
            this.files = this.files.filter(file => file.url === this.getSharedURL())
            if (this.files.length) {
              this.service.service_file.name = null;
              this.service.service_file.url = null;
              this.service.service_file.cloudinary_id = null;
            } else {
              this.service.service_file.others = [];
            }
          }
        }

        if (!this.service) {
          this.modal.error({
            nzTitle: this.translate.instant('URL404'),
            nzContent: this.translate.instant('URLNotFound'),
            nzOnOk: () => this.router.navigate(['/'])
          });

          return;
        }
        const serviceId = this.service.id;

        this.serviceType = this.service.type ? this.service.type : TEXT;
        this.serviceLikes = this.service.likes_count;
        this.serviceVicewCount = this.service.view_count;
        this.setUserDetails();

        // seo fallbacks
        const elem = document.createElement('div');
        elem.innerHTML = this.service.content;

        const rawText = elem.innerText;

        if (!this.service.excerpt) {
          this.service.excerpt = rawText.substr(0, 100);
        }

        this.seoService.updateMetaTags({
          keywords: this.service.meta.keyword,
          title: this.service.title,
          tabTitle: this.service.title.substring(0, 60),
          description: rawText.substring(0, 200),
          image: { url: this.service.image.url },
          type: 'service',
          summary: this.service.summary || rawText.substring(0, 70),
        });

        this.serviceService.updateViewCount(serviceId);
      });

      this.setLanguageNotification();
      
      
    });
  }

  getSharedURL() {
    return this.activatedRoute.snapshot.queryParamMap.get('url');
  }

  onSubmit(){
    for (const i in this.serviceForm.controls) {

      this.serviceForm.controls[i].markAsDirty();
      this.serviceForm.controls[i].updateValueAndValidity();
    }
    if (this.findInvalidControls().length == 0) {
      try {
        if (this.captchaToken) {
          this.isFormSaving = true;
          this.invalidCaptcha = false;
          this.authService.validateCaptcha(this.captchaToken).subscribe((success) => {
            this.saveDataOnServer();
          }, (error) => {
            window['grecaptcha'].reset(this.capchaObject);
            this.isFormSaving = false;
            this.invalidCaptcha = true;
          });
        } else {
          this.invalidCaptcha = true;
        }
      } catch (err) {
        this.isFormSaving = false;
      }
  /*   
      this.isFormSaving = true;
      const serviceData = {
        fullname: this.serviceForm.get('fullname').value,  
        email: this.serviceForm.get('email').value,  
        phonenumber: this.serviceForm.get('phonenumber').value,     
       }
       this.serviceService.createContact(this.service.id , serviceData).then(() => {
         this.showSuccess()
        this.isFormSaving = false
        })
       .catch(() => {
        this.showError();
        this.isFormSaving = false
      })
*/
  }
}
saveDataOnServer() {
  const serviceData = {
    fullname: this.serviceForm.get('fullname').value,  
    email: this.serviceForm.get('email').value,  
    phonenumber: this.serviceForm.get('phonenumber').value,     
   }
  this.serviceService.createContact(this.service.id, serviceData).then(data => {
    this.serviceForm.reset();
    this.addLeadSuccess = true;
    this.isFormSaving = false;
    setTimeout(() => {
      this.addLeadSuccess = false;
    }, 5000);
    window['grecaptcha'].reset(this.capchaObject);
  }).catch((error) => {
    this.isFormSaving = false;
  });
}

addRecaptchaScript() {
  window['grecaptchaCallback'] = () => {
    this.isCapchaScriptLoaded = true;
    if (this.isCapchaScriptLoaded && this.isCaptchaElementReady)
      this.renderReCaptcha();
    return;
  }

  (function (d, s, id, obj) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      obj.isCapchaScriptLoaded = true;
      if (obj.isCapchaScriptLoaded && obj.isCaptchaElementReady)
        obj.renderReCaptcha(); return;
    }
    js = d.createElement(s); js.id = id;
    js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'recaptcha-jssdk', this));
}

renderReCaptcha() {
  if (!this.recaptchaElement || this.capchaObject)
    return;

  this.capchaObject = window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
    'sitekey': environment.captchaKey,
    'callback': (response) => {
      this.invalidCaptcha = false;
      this.captchaToken = response;
    },
    'expired-callback': () => {
      this.captchaToken = '';
    }
  });
}

  findInvalidControls() {
    const invalid = [];
    const controls = this.serviceForm.controls;
    for (const name in controls) {

      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  showSuccess(): void {
    let $message = this.translate.instant("conSave");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("conSave");
    })
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
    });
  }
  showError(): void {
    this.isFormSaving = false;
    let $message = this.translate.instant("artError");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("artError");
    })
    this.modalService.error({
      nzTitle: "<i>" + $message + "</i>",
    });
  }

  ngAfterViewChecked(): void {
    if (!this.isLoaded) {
      delete window['addthis']
      setTimeout(() => { this.loadScript(); }, 100);
      this.isLoaded = true;
    }
  }

  ngAfterViewInit() { }

  /**
   * Set user params 
   */
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
        this.setLike();
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }



    })
  }

  transformHtml(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
  reportAbuseService() {
    this.isReportAbuseServiceLoading = true;
    this.serviceService.updateServiceAbuse(this.service.id).then(() => {
      this.isReportAbuseServiceLoading = false;
      this.showAbuseSuccessMessage();
    })
  }

  getUserDetails() {
    return {
      fullname: this.userDetails.fullname,
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      avatar: this.userDetails.avatar ? this.userDetails.avatar : '',
      id: this.userDetails.id,
    }
  }

  follow() {
    if (this.isLoggedInUser) {
      const userDetails = this.getUserDetails();
      if (userDetails.id == this.service.author.id) {
        this.showSameFollowerMessage();
        return;
      }
      this.authorService.follow(this.service.author.id, this.service.author.type);
      this.isFollowing = true
      this.analyticsService.logEvent("follow_author", {
        author_id: this.service.author.id,
        author_name: this.service.author.fullname,
        user_uid: userDetails.id,
        user_name: userDetails.fullname,
      });
    } else {
      this.showModal();
    }
  }
  unfollow() {
    if (this.isLoggedInUser) {
      this.authorService.unfollow(this.service.author.id, this.service.author.type);
      const userDetails = this.getUserDetails();
      this.isFollowing = false
      this.analyticsService.logEvent("unfollow_author", {
        author_id: this.service.author.id,
        author_name: this.service.author.fullname,
        user_uid: userDetails.id,
        user_name: userDetails.fullname,
      });
    } else {
      this.showModal();
    }
  }

  setFollowOrNot() {
    this.authorService.isUserFollowing(this.service.author.id, this.getUserDetails().id, this.service.author.type).subscribe((data) => {
      if (data) {
        this.isFollowing = true;
      } else {
        this.isFollowing = false;
      }
    });
  }
  like() {
    if (this.isLoggedInUser) {
      this.serviceService.like(this.service.id, this.getUserDetails());
      this.serviceLikes++
      const service = this.service;
      console.log('liked_service', {
        service_id: service.id,
        service_title: service.title,
        service_language: service.lang,
        service_author_name: service.author.fullname,
        service_author_id: service.author.id,
        service_category_title: service.category.title,
        service_category_id: service.category.id,
        liked_by_user_name: this.getUserDetails().fullname,
        liked_by_user_id: this.getUserDetails().id,
      });
    } else {
      this.showModal();
    }
  }
  disLike() {
    if (this.isLoggedInUser) {
      this.serviceLikes--
      this.serviceService.disLike(this.service.id, this.getUserDetails().id);

      const service = this.service;
      this.analyticsService.logEvent('unliked_service', {
        service_id: service.id,
        service_title: service.title,
        service_language: service.lang,
        service_author_name: service.author.fullname,
        service_author_id: service.author.id,
        service_category_title: service.category.title,
        service_category_id: service.category.id,
        unliked_by_user_name: this.getUserDetails().fullname,
        unliked_by_user_id: this.getUserDetails().id,
      });
    } else {
      this.showModal();
    }
  }
  setLike() {
    console.log("asd"+this.service.id +this.getUserDetails().id);
    this.serviceService.isLikedByUser(this.service.id, this.getUserDetails().id).subscribe((data) => {
      if (data) {
        this.isLike = true;
      } else {
        this.isLike = false;
      }
    });
  }
  loadScript() {
    let node = document.createElement('script');
    node.src = environment.addThisScript;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
  setLanguageNotification() {
    this.selectedLang = this.langService.getSelectedLanguage();
    this.translate.onLangChange.subscribe(() => {
      this.selectedLang = this.langService.getSelectedLanguage();
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

  getRelativeDate(date: string) {
    return moment(date).fromNow();
  }

  getServiceUrl(service) {
    if (service.author.type == 'charity') {
      return '/charities/';
    } else if (service.author.type == 'company') {
      return '/companies/';
    } else {
      return '/';
    }
  }
  showAbuseSuccessMessage() {

    this.modal.success({
      nzTitle: this.translate.instant('Report'),
      nzContent: this.translate.instant('ReportMessage')
    });
  }
  showSameFollowerMessage() {
    this.modal.warning({
      nzTitle: this.translate.instant('FollowNotAllowed'),
      nzContent: this.translate.instant('FollowNotAllowedMessage')
    });
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
  SlideRelatedService: boolean = false;
  slideService() {
    this.SlideRelatedService = !this.SlideRelatedService;
  }
}

