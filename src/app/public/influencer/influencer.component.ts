import { Component, OnInit } from '@angular/core';
import { Infleuncer } from 'src/app/shared/interfaces/infleuncer.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { InfluencerService } from 'src/app/shared/services/influencer.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormControl } from '@angular/forms';
import { CategoryService } from 'src/app/shared/services/category.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-influencer',
  templateUrl: './influencer.component.html',
  styleUrls: ['./influencer.component.scss']
})
export class InfluencerComponent implements OnInit {
  domains: any[] = ["https://mytrendingstories.com", "https://www.mytrendingstories.com"];
  influencerForm: any;
  categories:any;
  selectedCat:any;
  userDetails: any;
  infleuncerId: any;
  submitedURL: string;
  first_name:string;
  last_name:string;
  phone_number:string;
  email:string;
  note:string;
  searcher: any;
  selectedLanguage: string = "";
  influencers: Infleuncer[];
  loading: boolean = true;
  loadingMore: boolean = false;
  lastVisible: any = null;
  isLoggedInUser: boolean = false;
  isSearch: boolean;
  topicList: any;
  listcatcon: FormControl;
  currentUser: any;
  constructor(
    private languageService: LanguageService,
    private influencerService: InfluencerService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private userService: UserService,




  ) {
    this.listcatcon = new  FormControl([""]);
    this.influencerForm = this.fb.group({
      searcherCon: [''],
      listCat :this.listcatcon,
    });
   }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.selectedLanguage = this.languageService.getSelectedLanguage();
    this.categories = this.categoryService.getAll(this.selectedLanguage);
    console.log(this.categories)
    this.influencerService.getInfluencer().subscribe((data) => {

      this.influencers = data.serviceList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
      console.log(data.serviceList);

    });


    this.authService.getAuthState().subscribe(async user => {
      if (user && !user.isAnonymous) {
        this.isLoggedInUser = true;
        this.userDetails = await this.authService.getLoggedInUserDetails();
        this.userService.getMember(this.userDetails.id).subscribe((userDetails) => {
          this.currentUser = userDetails;
        })
        console.log(this.userDetails);
      } else {
        this.isLoggedInUser = false;
      }
    });
    this.translate.onLangChange.subscribe(() => {
      this.selectedLanguage = this.languageService.getSelectedLanguage()
      this.categories = this.categoryService.getAll(this.selectedLanguage)

    });
    this.categoryService.getAll(this.selectedLanguage).subscribe((data) => {
      this.categories = data;
      console.log(this.categories);
    });
  }


  private scrollEvent = (event: any): void => {

    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        if(this.categories){
          this.influencerService.getInfluencerByCat(this.categories,this.searcher, 20, 'next', this.lastVisible).subscribe((data) => {
            this.loadingMore = false;
            this.influencers = [...this.influencers, ...data.serviceList];
            this.lastVisible = data.lastVisible;
          });
        }
        if (this.isSearch) {
          this.influencerService.getInfluencerserchtitle(this.searcher, 20, 'next', this.lastVisible).subscribe((data) => {
            this.loadingMore = false;
            this.influencers = [...this.influencers, ...data.serviceList];
            this.lastVisible = data.lastVisible;
          });
        }
        
        else {


          this.influencerService.getInfluencer(20, 'next', this.lastVisible).subscribe((data) => {
            this.loadingMore = false;
            this.influencers = [...this.influencers, ...data.serviceList];
            this.lastVisible = data.lastVisible;
          });
        }
      }
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
  onChange(selected): void {
    this.selectedCat = selected;
    this.influencerService.getInfluencerByCat(this.selectedCat,this.searcher).subscribe((data) => {
      this.loadingMore = false;
      this.influencers = data.serviceList;
      this.lastVisible = data.lastVisible;
    });
  }
  resetSearch() {
    this.isSearch = false;
    this.influencerForm.reset();

    this.influencerService.getInfluencer().subscribe((data) => {
      this.influencers = data.serviceList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
      console.log(data.serviceList);

    });
  }
  getformat(number) {
    if (number == 0) {
      return 0;
    }
    else {
      // hundreds
      if (number <= 999) {
        return number;
      }
      // thousands
      else if (number >= 1000 && number <= 999999) {
        return (number / 1000) + 'K';
      }
      // millions
      else if (number >= 1000000 && number <= 999999999) {
        return (number / 1000000) + 'M';
      }
      // billions
      else if (number >= 1000000000 && number <= 999999999999) {
        return (number / 1000000000) + 'B';
      }
      else
        return number;
    }
  }

  search() {
    this.isSearch = true;
    this.loading = true;
    this.listcatcon.reset();

    console.log(this.searcher);
    this.influencerService.getInfluencerserchtitle(this.searcher).subscribe((data) => {
      this.influencers = data.serviceList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
      console.log(data.serviceList);

    });
  }
  isVisible = false;
  isVisible2 = false;

  isOkLoading = false;
  showLoginModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.router.navigate(["auth/login"]);
      this.isOkLoading = false;
    }, 2000);
  }

  handleURL() {
    this.isOkLoading = true;
    console.log(this.submitedURL)
    // if(this.first_name==null && this.last_name ==null&& this.phone_number ==null&& this.email ==null&& this.note==null){
    //   this.showError("all fields is required");
    //   this.isOkLoading = false;
    // }
    // else     {
      if (this.validateUrl(this.submitedURL) == false) {
      let errorMessage = "agenyNonMTSUrlErr";
      this.showError(errorMessage);
      this.isOkLoading = false;

    } else {
      let data = { "submiturl": this.submitedURL , 
                  "user": this.currentUser };
      this.influencerService.submitURL(this.infleuncerId, data).then(() => {
        this.isOkLoading = false;
        this.showSuccess();
        this.isVisible2 = false;

      });
    }
  // }

  }
  orderList(){
    if (this.isLoggedInUser) {
      this.router.navigate(['influencer/orders']);

    } else {
      this.showLoginModal();
    }
  }
  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modal.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }
  submitUrl(id) {
    if (this.isLoggedInUser) {
      this.infleuncerId = id;
      this.isVisible2 = true;
    } else {
      this.showLoginModal();
    }
  }
  showSuccess() {

    let $message = this.translate.instant("leadAddSuccess");

    this.modal.success({
      nzTitle: "<i>" + $message + "</i>",
      nzOnOk: () => {

        this.router.navigate(['infleuncer']);
      },
    });
  }
  validateUrl(url) {
    let matched = false;
    if (url) {
      for (let i = 0; i < this.domains.length; i++) {
        if (url.startsWith(this.domains[i])) {
          matched = true;
          break;
        }
      }
    }
    return matched;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isVisible2 = false;
  }

}
