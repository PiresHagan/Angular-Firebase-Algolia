import { Component } from "@angular/core";
import { UploadFile } from "ng-zorro-antd";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { NzModalService } from "ng-zorro-antd";
import { NzMessageService } from "ng-zorro-antd";
import { UserService } from "src/app/shared/services/user.service";
import "firebase/storage";
import { User } from "src/app/shared/interfaces/user.type";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { CategoryService } from "src/app/shared/services/category.service";
import { LanguageService } from "src/app/shared/services/language.service";
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Store } from "src/app/shared/interfaces/ecommerce/store";
import { StoreSetting } from "src/app/backoffice/shared/services/store-setting.service";
import { AUTHOR, COMPANY, CHARITY, MEMBER, STAFF } from "src/app/shared/constants/member-constant";
import { CompanyService } from 'src/app/backoffice/shared/services/company.service';
import { CharityService } from 'src/app/backoffice/shared/services/charity.service';


@Component({
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent {

  photoURL: string;
  profileForm: FormGroup;
  currentUserEmail: string;
  isLoading: boolean = false;
  currentUser: User;
  isPhotoChangeLoading: boolean = false;
  storeDetails: Store;
  userDetails;
  languageList;
  uplodedImage
  authorList;
  loading = false;
  storeLoading = true;
  paymentError = true;
  Cards;
  notificationConfigList = [

  ];

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private message: NzMessageService,
    private userService: UserService,
    private storeService: StoreSetting,
    public translate: TranslateService,
    public categoryService: CategoryService,
    public languageService: LanguageService,
    private authService: AuthService,
    private companyService: CompanyService,
    private charityService: CharityService,
    private modelService: NzModalService
  ) { }

  ngOnInit(): void {
    this.languageList = this.languageService.geLanguageList();

    /**
     * Profile Form
     */

    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")]],
      phone: [null, [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      description: [null],
      name: [null, [Validators.required]],
      address: [null, [Validators.required]]
      // owner: [null, [Validators.required]],
    });


    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      this.setFormsData();
    })


  }
  setFormsData() {
    this.userService.getCurrentUser().then((user) => {
      this.currentUser = user;

      this.storeService.getStoreById(user.uid).subscribe((storeDetails: Store) => {
        this.storeLoading = false;
        this.storeDetails = storeDetails && storeDetails[0];
        this.getCompanyAndCharity(this.storeDetails ? this.storeDetails.owner : this.userDetails, this.storeDetails?.owner?.id);
        if (!this.storeDetails)
          return;
        this.profileForm.controls['email'].setValue(this.storeDetails.email);
        this.profileForm.controls['phone'].setValue(this.storeDetails.phone);
        this.profileForm.controls['description'].setValue(this.storeDetails.description);
        this.profileForm.controls['name'].setValue(this.storeDetails.name);
        this.profileForm.controls['address'].setValue(this.storeDetails.address);
        this.uplodedImage = this.storeDetails.image;
        this.photoURL = this.storeDetails.image ? this.storeDetails.image.url : '';



      }, error => {
        this.storeLoading = false;
      })


    })
  }


  showSuccess(): void {

    let $message = this.translate.instant("profileSaveMessage");
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      $message = this.translate.instant("confirmPassMessage");
    })
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
    });
  }



  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (!this.currentUser)
      return;
    this.isPhotoChangeLoading = true;
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.photoURL = img;
      this.storeService.addImage(img, info.file?.name).then((fileObject) => {
        this.isPhotoChangeLoading = false;
        this.uplodedImage = fileObject;
      }).catch(() => {
        this.isPhotoChangeLoading = false;
        console.log('Image not uploaded properly')
      });
    })
  }
  showWarningMessage(message) {
    let $message = this.translate.instant(message);
    this.modalService.warning({
      nzTitle: $message,
    });
  }

  async saveBasicDetails() {
    if (!this.currentUser)
      return;
    for (const i in this.profileForm.controls) {
      this.profileForm.controls[i].markAsDirty();
      this.profileForm.controls[i].updateValueAndValidity();
    }

    if (!this.uplodedImage) {
      this.showWarningMessage("LogoImageRequired");
      return
    }

    if (this.findInvalidControls().length == 0) {
      let finalObhject = this.profileForm.getRawValue();
      const loggedInUser = this.authService.getLoginDetails();
      finalObhject['image'] = this.uplodedImage;
      // finalObhject['created_by'] = {
      //   avatar: this.authorList.currentUser.avatar ? this.authorList.currentUser.avatar : '',
      //   slug: this.authorList.currentUser.slug,
      //   name: this.authorList.currentUser.fullname,
      //   id: this.authorList.currentUser.id,

      // }
      finalObhject['ownerId'] = this.authorList.currentUser.id;
      finalObhject['ownerType'] = this.authorList.currentUser.type;

      if (!loggedInUser)
        return;
      try {
        this.isLoading = true;
        if (this.storeDetails)
          this.storeService.updateStore(this.storeDetails.id, finalObhject).subscribe(() => {
            this.isLoading = false;
            this.showSuccess();
          })
        else
          this.storeService.addStore(finalObhject).subscribe(() => {
            this.isLoading = false;
            this.showSuccess();
          })

      } catch (e) {
        this.isLoading = false;
      }

    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.profileForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  getUserDetails(userDetails) {
    if (!userDetails)
      userDetails = this.userDetails;
    return {
      slug: userDetails.slug ? userDetails.slug : '',
      fullname: userDetails.fullname || userDetails.name,
      avatar: {
        url: userDetails.avatar?.url || userDetails.logo?.url,
        alt: userDetails.avatar?.alt || userDetails.logo?.alt
      },
      type: userDetails.type ? userDetails.type : AUTHOR,
      id: userDetails.id
    }
  }
  getCompanyAndCharity(articleAuthor, storeId = null) {

    this.authorList = {
      charities: [],
      companies: [],
      currentUser: null
    }
    if (this.userDetails.type == STAFF && storeId) {
      if (!articleAuthor.type || articleAuthor.type === MEMBER) {
        this.userService.getMember(articleAuthor.id).subscribe((userDetails) => {
          this.authorList.currentUser = userDetails;
          this.setAuthorDropdown();
        })
      } else if (articleAuthor.type === COMPANY) {
        this.companyService.getCompanyById(articleAuthor.id).subscribe((copanyData) => {
          this.authorList.companies.push(copanyData);
          this.setAuthorDropdown();
        })
      } else if (articleAuthor.type === CHARITY) {
        this.charityService.getCharityById(articleAuthor.id).subscribe((charityData) => {
          this.authorList.charities.push(charityData);
          this.setAuthorDropdown();
        })
      }

    } else {
      this.userService.getMember(this.userDetails.id).subscribe((userDetails) => {
        this.authorList.currentUser = userDetails;
        this.setAuthorDropdown();
      })
      this.charityService.getAllCharities(this.userDetails.id, 1000).subscribe((charityData) => {
        this.authorList.charities = charityData.charityList;
        this.setAuthorDropdown();

      })

      this.companyService.getAllCompanies(this.userDetails.id, 1000).subscribe((companyData) => {
        this.authorList.companies = companyData.companyList;
        this.setAuthorDropdown();
      })
    }




  }
  setAuthorDropdown() {
    return
    // let selectedUser = null;;
    // if (this.storeDetails && this.storeDetails.owner) {
    //   if (this.authorList.currentUser && this.authorList.currentUser.id === this.storeDetails.owner.id) {
    //     selectedUser = this.authorList.currentUser;
    //   }
    //   if (this.authorList.charities && this.authorList.charities.length) {
    //     selectedUser = this.getRecordFromId(this.authorList.charities, this.storeDetails.owner.id) || null;
    //   }
    //   if (this.authorList.companies && this.authorList.companies.length) {
    //     selectedUser = this.getRecordFromId(this.authorList.companies, this.storeDetails.owner.id) || null;
    //   }
    //   if (selectedUser)
    //     this.profileForm.controls['owner'].setValue(selectedUser);
    // }
  }
  getRecordFromId(list, id) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (element.id == id) {
        return element;
      }

    }
    return null;
  }
  updateBilling() {
    this.loading = true;
    this.storeService.updateBilling(this.storeDetails.id).subscribe((response: any) => {
      this.loading = false;

      if (response.url) {
        window && window.open(response.url, '_self')
      } else {
        this.showError();
      }
    }, (errror) => {
      this.loading = false;
      this.showError();
    })


  }
  showError() {
    const msg = this.translate.instant("CampError");
    this.modelService.warning({
      nzTitle: "<i>" + msg + "</i>",
    });
  }



}
