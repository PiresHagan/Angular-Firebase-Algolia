import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "src/app/shared/services/user.service";
import {VC_Participant} from '../../../../shared/interfaces/video-conference-session.type'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-session-user',
  templateUrl: './session-user.component.html',
  styleUrls: ['./session-user.component.scss']
})
export class SessionUserComponent implements OnInit, OnDestroy {
  @Input() session_participant!:VC_Participant;
  private ngUnsubscribe = new Subject<void>();
  avatarUrl: string = "";
  memberDetails;
  avatarData = null;
  user_mic_on:boolean=false;
  user_camera_on:boolean=false;
  constructor(
    private userService: UserService,) { }

  ngOnInit(): void {
    if(!this.session_participant)
      return;
    this.userService.getMember(this.session_participant.user_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((memberDetails) => {
      if(memberDetails){
        this.avatarUrl = memberDetails?.avatar?.url;
        if (memberDetails?.avatar && memberDetails?.avatar?.url)
          this.avatarData = {
            url: memberDetails?.avatar?.url,
            alt: memberDetails?.avatar?.alt,
          };
        this.memberDetails = memberDetails;
      }
    });
  }

  async ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
