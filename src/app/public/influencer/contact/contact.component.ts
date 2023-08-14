import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { NzModalService } from 'ng-zorro-antd';
import { InfluencerService } from 'src/app/shared/services/influencer.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-service-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class InfluencerContactComponent implements OnInit {
  isloadingAccept = false;
  isloadingReject= false;
  servicesLoading: boolean = true;
  contact: any;
  isVisible: boolean = false;
  isVisibleTime: boolean = false;
  isVisibleUpdate: boolean = false;
  modalTitle: string = "Add New Provider";
  modalTitleTime: string = "Manage Time Slot";
  radioValue = 'true';
  isConfirmLoading: boolean = false;
  isConfirmLoadingTime: boolean = false;
  deleteLoading: boolean = false;
  time_slot: any;
  provider_id: any;
  user: any;
  slug: any;
  timeStartPlaceholder: string = 'Start Time';
  timeEndPlaceholder: string = 'End Time';

  startTime: Date | null = null
  endTime: Date | null = null
  deleteTimeLoading: boolean = false;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  starRating = 0; 
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  value = 0;

  userDetails: any;
  influencerId: any;
  currentUser: any;

  constructor(
    private modalService: NzModalService,
    private influencerService: InfluencerService,
    private userService: UserService,

    private router: ActivatedRoute,
    private fb: FormBuilder,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.sleep(5000);
    this.getUser()

    
  }
   sleep = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }



  disabledMinutes(): number[] {
    return [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32, 33, 34, 36, 37, 38, 39, 41, 42, 43, 44, 46, 47, 48, 49, 51, 52, 53, 54, 56, 57, 58, 59];
  }

  showSuccess() {

    let $message = "all Done";
    this.modalService.success({
      nzTitle: "<i>" + $message + "</i>",
      nzOnOk: () => {
        window.location.reload();
      },
    });
  }

  getUser () {
    this.authService.getLoggedInUserDetails().then( (user:any) => {

      this.userDetails = user
      this.getContact()
    })
  }
  getContact(): void {
    this.servicesLoading = true;
    this.influencerService.getcontactbyUser(this.userDetails.slug).subscribe( (res: any )=>{
      this.servicesLoading = false;
      this.contact = res.serviceList;
    });
  }

  setUserDetails() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();

    });
  }

  ratingClick(influencerId,contactId,e){
    const data={
      userId : this.userDetails.id,
      rating: e
    }
    this.influencerService.rateInfluencer(influencerId,contactId,data).then();
  }





}
