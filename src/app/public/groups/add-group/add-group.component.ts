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
@Component({
  selector: "app-add-group",
  templateUrl: "./add-group.component.html",
  styleUrls: ["./add-group.component.scss"],
})
export class AddGroupComponent implements OnInit {
  addGroupForm: FormGroup;
  groupSubscribtions = GroupConstant.GroupSubscription;
  groupSizes = GroupConstant.GroupSize;
  groupTypes = EventHostConstant.GroupTypes;
  isLoggedInUser: boolean = false;
  userDetails: User;
  userList = [];
  memberList = [];
  memberIds = [];
  member: Member;
  lookingForMember: boolean = false;
  showError: boolean = false;
  errorMessage: string = "";
  coverImage;
  isCoverImageUploading = false;
  isLoading = false;
  iconImage;
  isIconUploading: boolean = false;
  isIconLoading: boolean = false;
  isSaving:boolean = false;
  event_slug: string;
  event_type: string;
  selectedPackage: any;
  subscription;//=this.translate.instant('NoSubscription')+"/"+this.translate.instant('Free');
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
    public groubService: GroupsService,
    private message: NzMessageService,
    
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      // const eventType = params.get('eventType')
      if(params.get("event_slug")!=null)
        this.event_slug = params.get("event_slug");
      if(params.get("event_type")!=null)
        this.event_type = params.get("event_type");
    });
    this.setUserDetails();
    this.createForm();
    this.subscription= this.translate.instant('NoSubscription') +"/"+this.translate.instant('Free');
  }
  upgradeGroupSubscription(selectedPackage){
    this.selectedPackage=selectedPackage;
    this.subscription="$"+this.selectedPackage.price;
  }
  // get all users of the same type user
  getGroupCandidates() {}
  submitForm() {
    const siteData = this.FillPostData();
    if(siteData!=null){
    siteData['status']='CREATED';
    siteData['subscription'] = (this.selectedPackage!=null)?this.selectedPackage.price:0;
    this.groubService.addNewGroup(siteData).then((result: any) => {
      // this.addGroupForm.reset();
      // add subscriptions
      if (this.selectedPackage!=null && this.selectedPackage.price>0) {
        this.groupService.createGroupSubscription(result.groupId, {
          external_id: this.selectedPackage.external_id,
          paymentMethodId: this.selectedPackage.paymentMethodId,
          package_type: this.selectedPackage.price
        }).subscribe((data) => {
          this.showMessage(this.translate.instant("Success"),this.translate.instant("GroupAddedSuccessfully") );
          this.isSaving = false;
          if(this.event_slug!=null)
            this.router.navigateByUrl("/event-hosting/book/"+this.event_slug);
          else
          this.router.navigateByUrl("/groups");
        }, err => {
          this.showErrorMessage('FailedSubscription');
        });
      }
      else if(this.event_slug!=null)
      this.router.navigateByUrl("/event-hosting/book/"+this.event_slug);
    else
    this.router.navigateByUrl("/groups");
      
    })
    .catch((err) => {
      this.showMessage(this.translate.instant("Error"), err.message);
      this.isSaving = false;
    });
    }
    else{
      this.isSaving=false;
      return;
    }

  }
  createForm() {
    this.addGroupForm = this.fb.group({
      group_type: ["", [Validators.required]],
      group_size: ["", [Validators.required]],
      group_name:["",[Validators.required]]
    });
  }
  // fill data posted and validate it
  FillPostData(isPublishing: boolean = true) {
    this.isSaving=true;
    if (!this.coverImage) {
      this.showErrorMessage("CoverImageRequired");
      this.isSaving=false;
      return;
    }
    if (!this.iconImage) {
      this.showErrorMessage("avatarImageRequired");
      this.isSaving=false;
      return;
    }
    if(this.memberList.length != this.addGroupForm.get('group_size').value){
      this.showErrorMessage("MemberNumberNotMatchGroupSizeOf");
      this.isSaving=false;
      return;
    }
    for (const i in this.addGroupForm.controls) {
      this.addGroupForm.controls[i].markAsDirty();
      this.addGroupForm.controls[i].updateValueAndValidity();
    }

    if (this.addGroupForm.valid) {
      let siteData = JSON.parse(JSON.stringify(this.addGroupForm.value));
      siteData["creator"] = {};
      siteData.creator["id"] = this.userDetails.id;
      siteData.creator["type"] = this.userDetails.user_type;
      // siteData.publisher['name'] = this.host.sl;

      siteData["cover"] = this.coverImage;
      siteData["group_slug"] = this.getSlug(
          this.addGroupForm.get("group_name").value.trim()
        );
      siteData["avatar"] = this.iconImage;
      siteData["Members"] = this.memberList;
      siteData["MemberIds"] = this.memberIds;
      return siteData;
    }
  }
  /**
   * Set user params
   */
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
        this.memberList.push(this.userDetails);
        this.memberIds.push(this.userDetails.id);
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    });
  }
  addMember(value) {
    this.showError = false;
    this.lookingForMember = true;
    this.member = null;
    this.groupService.getMemberByFullname(value).subscribe((member)=>{
      this.member = member[0];
      if(this.member==undefined){
        this.groupService.getMemberByEmail(value).subscribe((member) => {
          this.member = member[0];
          if (this.member == undefined) {
            this.groupService.getMemberBySkype(value).subscribe((member) => {
              this.member = member[0];
              if (this.member == undefined) {
                this.groupService.getMemberByWhatsapp(value).subscribe((member) => {
                  this.member = member[0];
                  if (this.member == undefined) {
                    // error no account exists
                    this.showError = true;
                    this.errorMessage = "NoExistingUserMessage";
                    // no user
                  } else {
                    // whatsapp account exist
                    this.addToMemberList();
                  }
                });
              } else {
                this.addToMemberList();
              }
            });
          } else {
            this.addToMemberList();
          }
          this.lookingForMember = false;
        });
      }
      else {
        this.addToMemberList();
      }
      this.lookingForMember = false;
    })
    
  }

  public trackItem(index: number, item: any) {
    return item;
  }
  addToMemberList() {
    // check if the element already existed
    const isFound = this.memberList.some((element) => {
      if (element.id === this.member.id) {
        return true;
      }

      return false;
    });
    if (isFound) {
      this.errorMessage = "AlreadyExistedMemberGroup";
      this.showError = true;
    } else {
      this.memberList.push(this.member);
      this.memberIds.push(this.member.id);
    }
  }
  deleteMember(id: string) {
    const indexOfObject = this.memberList.findIndex((object) => {
      return object.id === id;
    });
    if (indexOfObject !== -1) {
      this.memberList.splice(indexOfObject, 1);
      this.memberIds.splice(indexOfObject,1);
    }
  }

  // images handling
  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file: UploadFile, _fileList: UploadFile[]) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      this.showErrorMessage("artImageTypeErr");
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.showErrorMessage("artImageSizeErr");
      return false;
    }
    return true;
  };
  handleCoverImageChange(info: { file: UploadFile }): void {
    try {
      this.isCoverImageUploading = true;
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.saveImageOnServer(img, info.file.name).then((imageObject) => {
          this.coverImage = imageObject;
          this.isCoverImageUploading = false;
        });
      });
    } catch (error) {
      this.isCoverImageUploading = false;
      this.showErrorMessage("artImageGeneralErr");
    }
  }
  saveImageOnServer(base64, name) {
    this.isLoading = true;
    return this.groupService.addImage(base64, name);
  }
  handleAvatarChange(info: { file: UploadFile }): void {
    try {
      this.isIconLoading = true;
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.saveImageOnServer(img, info.file.name).then((imageObject) => {
          this.iconImage = imageObject;
          this.isIconLoading = false;
        });
      });
    } catch (error) {
      this.isIconLoading = false;
      this.showErrorMessage("artImageGeneralErr");
    }
  }

  showErrorMessage(message) {
    let $message = this.translate.instant(message);
    this.modal.error({
      nzTitle: $message,
    });
  }
  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }
   //#region  slugging
   getSlug(title: string) {
    return this.slugify(title) + "-" + this.makeid();
  }

  slugify(string) {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
  makeid(length = 6) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toLowerCase();
  }
  //#endregion end slugging

}
