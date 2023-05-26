import { Component, Input, OnInit } from '@angular/core';
import { UserService } from "src/app/shared/services/user.service";
import {VC_Participant} from '../../../../shared/interfaces/video-conference-session.type'
@Component({
  selector: 'app-session-user',
  templateUrl: './session-user.component.html',
  styleUrls: ['./session-user.component.scss']
})
export class SessionUserComponent implements OnInit {
  @Input() session_participant!:VC_Participant;
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
    this.userService.getMember(this.session_participant.user_id).subscribe((memberDetails) => {
      this.avatarUrl = memberDetails?.avatar?.url;
      if (memberDetails?.avatar && memberDetails?.avatar?.url)
        this.avatarData = {
          url: memberDetails?.avatar?.url,
          alt: memberDetails?.avatar?.alt,
        };
      this.memberDetails = memberDetails;
    });
  }

}
