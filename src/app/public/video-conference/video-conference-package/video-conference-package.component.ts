import { Component, OnInit} from '@angular/core';
import { VideoConferenceBillingComponent } from '../video-conference-billing/video-conference-billing.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/shared/services/authentication.service';
import {VideoConferencePackage, VideoConferenceSubscription} from 'src/app/shared/interfaces/video-conference-session.type';
import { VideoConferenceService } from 'src/app/shared/services/video-conference.service';
import { VideoConferenceConstant } from 'src/app/shared/constants/video-conference-constants';

@Component({
  selector: 'app-video-conference-package',
  templateUrl: './video-conference-package.component.html',
  styleUrls: ['./video-conference-package.component.scss']
})
export class VideoConferencePackageComponent implements OnInit {
  hostId: string;
  host;
  isLoading: boolean = true;
  selectedVideoConferencePackage: VideoConferencePackage;
  isUpgradingPlan: boolean = false;
  videoConferencePackages: VideoConferencePackage[] = [];
  currentVideoConferenceSubscription: VideoConferenceSubscription;

  constructor(private activatedRoute: ActivatedRoute,
    private VideoConferenceService: VideoConferenceService,
    private message: NzMessageService,
    private modalService: NzModalService,
    public translate: TranslateService,
    public authService: AuthService
    ) { }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;

      this.host = await this.authService.getLoggedInUser(user.uid);
      this.hostId = this.host.id;
      if (!this.hostId)
      return;
      this.loadPackages();
      this.loadSubscriptions();
    });
  }

  loadPackages() {
    this.VideoConferenceService.getPackages().subscribe((data: VideoConferencePackage[])=> {
      this.videoConferencePackages = data;
      }, err => {
    });
  }
  loadSubscriptions() {
    this.VideoConferenceService.getVideoConferenceSubscription(this.host.customerId).subscribe((data) => {
      this.isLoading = false;
      this.currentVideoConferenceSubscription = data[0];
      }, err => {
      this.isLoading = false;
    });
  }
  cancelSubscription() {
    return this.VideoConferenceService.cancelVideoConferencePackageSubscription(this.hostId, this.currentVideoConferenceSubscription.id)
  }

}
