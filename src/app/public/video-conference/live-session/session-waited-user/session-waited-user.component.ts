import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserService } from "src/app/shared/services/user.service";
import { VC_Message, VC_Participant, VideoConferenceSession } from 'src/app/shared/interfaces/video-conference-session.type';
import { VideoConferenceService } from 'src/app/shared/services/video-conference.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-session-waited-user',
  templateUrl: './session-waited-user.component.html',
  styleUrls: ['./session-waited-user.component.scss']
})

export class SessionWaitedUserComponent implements OnInit, OnDestroy {
  @Input() session_waited_participant!:VC_Participant;
  private ngUnsubscribe = new Subject<void>();
  @Input() lsessionid!:string;
  @Input() participantid!:string;
  @Input() isFreeSession!:boolean;
  @Input() session_participantsCount!:number;
  @Output() onAdmitUserFired = new EventEmitter<boolean>();

  avatarUrl: string = "";
  memberDetails;
  avatarData = null;
  constructor(
    private userService: UserService,
    private videoConferenceService:VideoConferenceService,
    ) { }

  ngOnInit(): void {
    if(!this.session_waited_participant)
      return;
    this.userService.getMember(this.session_waited_participant.user_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((memberDetails) => {
      this.avatarUrl = memberDetails?.avatar?.url;
      if (memberDetails?.avatar && memberDetails?.avatar?.url)
        this.avatarData = {
          url: memberDetails?.avatar?.url,
          alt: memberDetails?.avatar?.alt,
        };
      this.memberDetails = memberDetails;
    });
  }

  async ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  admitUser():void{
    if(this.isFreeSession && this.session_participantsCount>=2){
      this.onAdmitUserFired.emit(true);
      return;
    }
    let finalObject:VC_Participant = {
      ... this.session_waited_participant,
      is_approved:true,
      approved_at: new Date,
      joinded_at: new Date,
      is_joined:true,
      is_online:true,
      leaved_at:'',
      is_canceled:false,
      canceled_at:null
      };
    this.videoConferenceService
          .updateSessionParticipant(this.lsessionid, this.participantid, finalObject)
          .pipe(take(1))
          .subscribe((result: any) => {
          }, error=> {
          });
  }

  removeUser():void{
    let finalObject:VC_Participant = {
      ... this.session_waited_participant,
      is_approved:false,
      approved_at: null,
      joinded_at: null,
      is_joined:false,
      is_online:false,
      leaved_at:'',
      is_canceled:true,
      canceled_at:new Date()
      };
    this.videoConferenceService
          .updateSessionParticipant(this.lsessionid, this.participantid, finalObject)
          .pipe(take(1))
          .subscribe((result: any) => {
          }, error=> {
          });
  }

}
