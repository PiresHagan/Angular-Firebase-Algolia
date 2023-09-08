import { HostListener, Component, OnInit,OnDestroy, ViewChild, ChangeDetectorRef,ElementRef,AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Location } from "@angular/common";
import { TranslateService } from '@ngx-translate/core';
import { VC_Message, VC_Participant, VideoConferenceSession } from 'src/app/shared/interfaces/video-conference-session.type';
import {environment} from 'src/environments/environment';
import {AuthService} from 'src/app/shared/services/authentication.service';
import { NzMessageService } from "ng-zorro-antd/message";

import { DomSanitizer } from '@angular/platform-browser';

import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import AgoraRTC, {ConnectionState, IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, ILocalAudioTrack, ILocalTrack, ILocalVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import AgoraRTM, { RtmChannel, RtmClient, RtmMessage, RtmTextMessage } from 'agora-rtm-sdk';
import { Member } from 'src/app/shared/interfaces/member.type';
import { VideoConferenceService } from 'src/app/shared/services/video-conference.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-live-session',
  templateUrl: './live-session.component.html',
  styleUrls: ['./live-session.component.scss']
})
export class LiveSessionComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  @ViewChild('messages') private messagesElement: ElementRef;
  @ViewChild('current_stream_user_container') private current_stream_user_containerElement:ElementRef;
  @ViewChild('allStreamsContainer') private streamContainerElement:ElementRef;
  innerScreenWidth: any;
  isDeviceSmall: boolean=false;
  hideParticipantsContainer: boolean=false;
  hideMessagesContainer: boolean=false;
  hideVideosContainer: boolean=false;
  session_ended_in_diff_in_secs: number=0;
  session_started_in_diff_in_secs: number=0;
  current_lsession_is_started: boolean=true;
  isLoading=true;
  is_fullSceen:boolean=false;
  userNameValue: string='';
  isMessageSended: boolean;
  added_current_user: boolean=false;
  current_user_joined_streem: boolean=false;
  lsessionid: string;
  current_lsession:VideoConferenceSession=null;
  current_vcParticipant:VC_Participant=null;
  current_vcParticipant_id:any=null;
  loggedInUser: any;
  is_current_user_owner:boolean=false;
  sessionParticipantsWaitlist: VC_Participant[] = [];
  sessionParticipants: VC_Participant[] = [];
  sessionMessages: VC_Message[] = [];
  current_lsession_is_ended:boolean=false;
  agora_APP_ID = environment.agoraConfiguration.appid;
  rtm_client: RtmClient= null;
  rtm_token : any;
  rtm_uid : string;
  stream_users: VC_Participant[] = null;
  current_stream_user: any = null;
  can_user_join_stream:boolean = false;
  local_tracks: any;
  local_screen_tracks: any;
  rtm_channel : RtmChannel;
  rtc_client: IAgoraRTCClient = null;
  mic_btn_class: string="active";
  camera_btn_class: string="active";
  sharing_screen: boolean=false;
  screen_btn_class: string ="notactive";
  camera_btn_display: string;
  show_participants: boolean;
  messagesSelected: boolean = false;
  participantsSelected: boolean = false;
  p_nzXs:number = 24;
  p_nzSm:number =24;
  p_nzMd:number =24;
  p_nzLg:number =24;
  p_nzXl:number =24;
  p_nzXXl:number =24;
  m_nzXs:number = 24;
  m_nzSm:number =24;
  m_nzMd:number =24;
  m_nzLg:number =24;
  m_nzXl:number =24;
  m_nzXXl:number =24;
  session_messagesCount:number = 0;
  session_participantsCount: number=0;
  session_waitlist_participantsCount: number=0;
  last_message_visible:any;
  last_pasrticipant_visible:any;
  last_pasrticipantWaitlist_visible:any;
  messageForm: FormGroup;
  Participants_Translate = '';
  WaitingList_Translate='';
  Messages_Translate='';
  is_recording_enabled:boolean=false;
  is_recording_started:boolean=false;
  onClickTimer:any;
  preventOneClick:boolean=true;
  audioRecordedTime;
  videoRecordedTime;
  audioBlobUrl;
  videoBlobUrl;
  audioBlob;
  videoBlob;
  audioName;
  videoName;
  isFreeSession:boolean=false;
  showSubscriptionDialog: boolean = false;
  isVisible = false;
  isOkLoading = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private authService:AuthService,
    private location: Location,
    private fb: FormBuilder,
    public translate: TranslateService,
    private message: NzMessageService,
    private videoConferenceService:VideoConferenceService,
    private router: Router,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ){ }

   async ngOnDestroy() {
    if(this.current_lsession_is_ended)
      return;
    try{
      await this.leaveStream();
    }
    catch(err){}
    try{
      await this.leaveChannel();
    }
    catch(err){}
    finally{
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        return true;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerScreenWidth = window.innerWidth;
    if(this.innerScreenWidth<1024){
      this.isDeviceSmall=true;
      if(this.participantsSelected){
        this.hideParticipantsContainer = false;
        this.hideMessagesContainer = true;
        this.hideVideosContainer = true;
      }
      else if(this.messagesSelected){
        this.hideParticipantsContainer = true;
        this.hideMessagesContainer = false;
        this.hideVideosContainer = true;
      }
      else{
        this.hideParticipantsContainer = true;
        this.hideMessagesContainer = true;
        this.hideVideosContainer = false;
      }
    }
    else{
      this.isDeviceSmall=false;
      this.hideParticipantsContainer = false;
      this.hideMessagesContainer = false;
      this.hideVideosContainer = false;
    }
  }
  ngOnInit(): void {
    this.innerScreenWidth = window.innerWidth;
    if(this.innerScreenWidth<1024){
      this.isDeviceSmall=true;
      this.hideParticipantsContainer = true;
      this.hideMessagesContainer = true;
      this.hideVideosContainer = false;
    }
    else{
      this.isDeviceSmall=false;
      this.hideParticipantsContainer = false;
      this.hideMessagesContainer = false;
      this.hideVideosContainer = false;
    }
    AgoraRTC.setLogLevel(3);
    /*
    AgoraRTC.setLogLevel(number);
    0: DEBUG. Output all API logs.
    1: INFO. Output logs of the INFO, WARNING and ERROR level.
    2: WARNING. Output logs of the WARNING and ERROR level.
    3: ERROR. Output logs of the ERROR level.
    4: NONE. Do not output any log.*
    */
    //window.addEventListener('unload', this.unloadHandler, true);
    this.Participants_Translate = this.translate.instant("Participants");
    this.WaitingList_Translate = this.translate.instant("WaitingList");
    this.Messages_Translate = this.translate.instant("Messages");
    this.activeRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.lsessionid = params.get('lsessionid');
    });
    this.messageForm = this.fb.group({
      user_message: [null, [Validators.required]]
    });
    this.setFormData();
    this.authService.getAuthState().pipe(takeUntil(this.ngUnsubscribe)).subscribe(async (user) => {
      this.isLoading=true;
      if (!user) {
        let currSessionUserLS = localStorage.getItem(this.lsessionid);
        if(currSessionUserLS){
          this.loggedInUser = JSON.parse(currSessionUserLS);
          this.JoinSessionNow();
        }
        else{
          this.isLoading=false;
          return;
        }
      }
      const cloggedInUser = await this.authService.getLoggedInUserDetails();
      if (!cloggedInUser) {
        let currSessionUserLS = localStorage.getItem(this.lsessionid);
        if(currSessionUserLS){
          this.loggedInUser = JSON.parse(currSessionUserLS);
          this.JoinSessionNow();
        }
        else{
          this.isLoading=false;
          return;
        }
      }
      else{
        this.loggedInUser = cloggedInUser;
        this.JoinSessionNow();
      }
    });
  }

  ngAfterViewChecked() {
  }
  async addCurrentUserToCurrentSession(type:string='participant'){
    if(this.current_lsession.is_started==false){
      this.showMessage(this.translate.instant('ErrorMessageTitle'), this.translate.instant('ThisSessionIsNotStarted'));
      this.isLoading=false;
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      this.current_lsession_is_ended=true;
      this.showMessage(this.translate.instant('ErrorMessageTitle'), this.translate.instant('ThisSessionHasBeenEnded'));
      this.isLoading=false;
      return;
    }
    this.added_current_user=true;
    if(type=='owner')
    {
      let isUserExistsInParticipants:boolean = false;
      if(!isUserExistsInParticipants){
        let finalObject:VC_Participant = {
          user_id : this.loggedInUser.id,
          user_name: this.loggedInUser.fullname,
          is_session_owner: true,
          asked_to_join: true,
          asked_to_join_at: new Date,
          is_approved:true,
          approved_at: new Date,
          joinded_at: new Date,
          is_joined:true,
          is_online:true,
          leaved_at:'',
          is_canceled:false,
          canceled_at:null,
          camera_on:true,
          mic_on:true,
          screen_share_on:false,
          uid:String(Math.floor(Math.random() * 10000))
          };
          try{
              this.videoConferenceService
                .addSessionParticipant(this.lsessionid, finalObject)
                .pipe(take(1))
                .subscribe(async (result: any) => {
                  if(result && result.status != 'error'){
                    let welcominging_message=this.translate.instant('hasStartedTheSession');
                    this.sendWelcomMessage(welcominging_message);
                  }
                  else{
                    await this.videoConferenceService.getSessionParticipantByID(this.lsessionid, result.participantId)
                    .pipe(take(1))
                    .subscribe(async (result_of_getting_participant: VC_Participant) => {
                      if(result_of_getting_participant){
                        result_of_getting_participant.is_online=true;
                        result_of_getting_participant.camera_on=true;
                        result_of_getting_participant.mic_on=true;
                        await this.videoConferenceService.updateSessionParticipant(this.lsessionid, result.participantId, result_of_getting_participant)
                        .pipe(take(1))
                          .subscribe((result_of_update_participant: any) => {
                            let welcominging_message=this.translate.instant('hasJoinedThisSession');
                            this.sendWelcomMessage(welcominging_message);
                          }, error=> {
                          });
                      }
                    });
                  }
                }, error=> {
                });
              }
              catch(er){
              }
      }
    }
    else{
      let isUserExistsInParticipants:boolean = false;
      if(!isUserExistsInParticipants){
        let finalObject:VC_Participant = {
          user_id : this.loggedInUser.id,
          user_name: this.loggedInUser.fullname,
          is_session_owner: false,
          asked_to_join: true,
          asked_to_join_at: new Date,
          is_approved:false,
          approved_at: null,
          joinded_at: null,
          is_joined:false,
          is_online:false,
          leaved_at:'',
          is_canceled:false,
          canceled_at:null,
          camera_on:true,
          mic_on:true,
          screen_share_on:false,
          uid:String(Math.floor(Math.random() * 10000))
          };
          try{
              this.videoConferenceService
                    .addSessionParticipant(this.lsessionid, finalObject)
                    .pipe(take(1))
                    .subscribe(async (result: any) => {
                      this.messageForm.reset();
                      this.isMessageSended = false;
                      if(result && result.status != 'error'){
                        let welcominging_message=this.translate.instant('hasAskedToJoinThisSession');
                        this.sendWelcomMessage(welcominging_message);
                      }
                      else{
                        await this.videoConferenceService.getSessionParticipantByID(this.lsessionid, result.participantId)
                        .pipe(take(1))
                        .subscribe(async (result_of_getting_participant: VC_Participant) => {
                          if(result_of_getting_participant){
                            result_of_getting_participant.is_online=true;
                            result_of_getting_participant.camera_on=true;
                            result_of_getting_participant.mic_on=true;
                            await this.videoConferenceService.updateSessionParticipant(this.lsessionid, result.participantId, result_of_getting_participant)
                            .pipe(take(1))
                              .subscribe((result_of_update_participant: any) => {
                                let welcominging_message=this.translate.instant('hasAskedToJoinThisSession');
                                this.sendWelcomMessage(welcominging_message);
                              }, error=> {
                              });
                          }
                        });
                      }
                    }, error=> {
                      this.showMessage("error", JSON.stringify(error));
                      this.isMessageSended = false;
                    });
                    this.sessionParticipantsWaitlist.push(finalObject);
                    this.session_waitlist_participantsCount++;
            }
            catch(er){
              this.showMessage("error", JSON.stringify(er));
              this.isMessageSended = false;
            }
      }
    }
    await this.getSessionOnWaitParticipants();
    await  this.getCurrentSessionParticipants();
    this.added_current_user=true;
}


  setFormData() {

  }
  scrollMessagesToBottom():void{
    try {
      this.messagesElement.nativeElement.scrollTop = this.messagesElement?.nativeElement?.scrollHeight;
    } catch(err) {}
  }
  async loadSubscriptions() {
    const cloggedInUser = await this.authService.getLoggedInUser();
    if(cloggedInUser == null || cloggedInUser.customerId == null)
    {
      this.isFreeSession=true;
    }
    else{
      this.videoConferenceService.getVideoConferenceSubscription(cloggedInUser.customerId).subscribe((data) => {
        if(data && data.length>0){
          this.isFreeSession=false;
        }
        else{
          this.isFreeSession=true;
        }
        }, err => {
          this.isFreeSession=true;
      });
    }
  }
  getCurrentSessionInfo(){
    this.videoConferenceService.getSessionById(this.lsessionid)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data)=>{
      if(data && data.length>0)
        this.current_lsession = data[0];
    });
  }
  async getCurrentSessionMessages(){
    if(this.current_lsession.is_started==false){
      this.isLoading=false;
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      this.isLoading=false;
      return;
    }
    await this.videoConferenceService.getSessionMessages(this.lsessionid, 1000, 'first', this.last_message_visible)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data)=>{
      this.sessionMessages = data.messages;
      this.last_message_visible=data.lastVisible;
      this.session_messagesCount = this.sessionMessages.length;
      setTimeout(() => {
        this.scrollMessagesToBottom();
      }, 1000);
      })
  }
  async getCurrentSessionParticipants(){
    if(this.current_lsession.is_started==false){
      this.isLoading=false;
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      this.isLoading=false;
      return;
    }
    this.videoConferenceService.getSessionParticipants(this.lsessionid, 1000, 'first', this.last_pasrticipant_visible)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        this.sessionParticipants = data.participants;
        this.last_pasrticipant_visible = data.lastVisible;
        let old_session_participantsCount = this.session_participantsCount;
        this.session_participantsCount = this.sessionParticipants.length;
        if (this.loggedInUser && this.loggedInUser != null) {
          this.sessionParticipants.map(sp => {
            if (sp.user_id == this.loggedInUser.id) {
              this.current_vcParticipant = sp;
              this.current_vcParticipant_id = sp.id;
              if (this.loggedInUser.id != this.current_lsession.owner_id) {
                if (this.current_vcParticipant.asked_to_join == true && this.current_vcParticipant.is_approved) {
                  if (this.current_lsession.is_started && !this.current_lsession.is_ended) {
                    if (!this.rtm_client || this.rtm_client == null) {
                      this.InitSession(sp.uid);
                    }
                  }
                }
              }
              else {
                if (!this.rtm_client || this.rtm_client == null) {
                  this.InitSession(sp.uid);
                }
              }
            }
          });
          if (this.rtm_client) {
            if (this.stream_users == null || this.stream_users.length == 0) {
              this.stream_users = this.sessionParticipants;
            }
            else {
              this.sessionParticipants.forEach(p => {
                let p_found_index = this.stream_users.findIndex(x => x.user_id == p.user_id);
                if (p_found_index >= 0) {
                  let p_found: VC_Participant = this.stream_users[p_found_index];
                  if (p_found) {
                    this.stream_users[p_found_index].asked_to_join = p.asked_to_join;
                    this.stream_users[p_found_index].asked_to_join_at = p.asked_to_join_at;
                    this.stream_users[p_found_index].is_approved = p.is_approved;
                    this.stream_users[p_found_index].approved_at = p.approved_at;
                    this.stream_users[p_found_index].joinded_at = p.joinded_at;
                    this.stream_users[p_found_index].is_joined = p.is_joined;
                    this.stream_users[p_found_index].is_online = p.is_online;
                    this.stream_users[p_found_index].leaved_at = p.leaved_at;
                    this.stream_users[p_found_index].is_canceled = p.is_canceled;
                    this.stream_users[p_found_index].canceled_at = p.canceled_at;
                    this.stream_users[p_found_index].camera_on = p.camera_on;
                    this.stream_users[p_found_index].mic_on = p.mic_on;
                    this.stream_users[p_found_index].screen_share_on = p.screen_share_on;
                  }
                }
                else {
                  this.stream_users.push(p);
                }
              });
            }
          }
        }
      })
  }
  async getSessionOnWaitParticipants (){
    if(this.current_lsession.is_started==false){
      this.isLoading=false;
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      this.isLoading=false;
      return;
    }
    await this.videoConferenceService.getSessionOnWaitParticipants(this.lsessionid, 1000, 'first', this.last_pasrticipantWaitlist_visible)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data)=>{
      this.sessionParticipantsWaitlist = data.participants;
      this.last_pasrticipantWaitlist_visible=data.lastVisible;
      this.session_waitlist_participantsCount = this.sessionParticipantsWaitlist.length;
    })
  }

  async InitSession(rtm_id_:string){
    console.log('InitSession')
    this.rtm_uid=rtm_id_;
    if(this.current_lsession.is_started==false){
      this.showMessage(this.translate.instant('ErrorMessageTitle'), this.translate.instant('ThisSessionIsNotStarted'));
      this.isLoading=false;
      return;
    }
    if(this.current_lsession_is_ended==true || this.current_lsession.is_ended==true){
      this.current_lsession_is_ended=true;
      this.showMessage(this.translate.instant('ErrorMessageTitle'), this.translate.instant('ThisSessionHasBeenEnded'));
      this.isLoading=false;
      return;
    }
    if(!this.streamContainerElement || !this.streamContainerElement.nativeElement){
      return;
    }
    try{
      this.stream_users=this.sessionParticipants;
        this.rtm_client = await AgoraRTM.createInstance(this.agora_APP_ID);
        await this.rtm_client.login({ uid:this.rtm_uid, token:this.rtm_token});
        await this.rtm_client.addOrUpdateLocalUserAttributes({ name: this.loggedInUser.fullname});
        this.rtm_channel = await this.rtm_client.createChannel(this.lsessionid);
        await this.rtm_channel.join();
        this.rtc_client = await AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        this.rtc_client.on('connection-state-change',async (curState : ConnectionState, revState : ConnectionState)=>{
          if (curState == "CONNECTED"){
              this.can_user_join_stream = true;
              await this.joinStream();
          }
        })

        await this.rtc_client.join(this.agora_APP_ID, this.lsessionid, null, this.rtm_uid);
        this.rtc_client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio"|"video")=>{
          await this.rtc_client?.subscribe(user, mediaType);
          if (mediaType === "video") {
            user.videoTrack?.play(`user-${user.uid}`,{fit: "contain"});
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });

        let user_lefted = async (user: IAgoraRTCRemoteUser) =>{
          this.UserLeft(user.uid);
        };
        this.rtc_client.on("user-left", user_lefted);

    }
    catch(err){
      console.log(err)
    }
  }

  async JoinInitiatedSession(rtm_id_:string){
    this.rtm_uid=rtm_id_;
    await this.joinStream();
  }

  async sendWelcomMessage(msg:string=this.translate.instant('hasJoinedThisSession')){
    const sendingDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy hh:mm:ss');
    msg= msg + ' at ' + sendingDate;
    let finalObject:VC_Message = {
      from_user_id : "-1",
      from_user_name: "boot",
      text: `${this.loggedInUser.fullname}  ${msg}`,
      sent_at: new Date(),
      type: "-1"
      };
    this.videoConferenceService
          .addSessionMessage(this.lsessionid, finalObject)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((result: any) => {
            this.messageForm.reset();
            this.isMessageSended = false;
          }, error=> {
            this.isMessageSended = false;
          });
  }

  async sendLeavingMessage(msg:string=this.translate.instant('hasLeftTheSession')){
    const sendingDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy hh:mm:ss');
    msg= msg + ' at ' + sendingDate;
    let finalObject:VC_Message = {
      from_user_id : "-1",
      from_user_name: "boot",
      text: `${this.loggedInUser.fullname}  ${msg}`,
      sent_at: new Date(),
      type: "-1"
      };
    this.videoConferenceService
          .addSessionMessage(this.lsessionid, finalObject)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((result: any) => {
            this.messageForm.reset();
            this.showMessage(this.translate.instant('success'), this.translate.instant('leavingMessageSendedSuccesfully'));
            this.isMessageSended = false;
          }, error=> {
            this.isMessageSended = false;
          });
  }
  TriggerSendMessage(event:KeyboardEvent){
     if (event.key === 'Enter') {
      if (!event.shiftKey) {
        event.preventDefault();
        this.SendMessage();
      }
    }
  }
  SendMessage(){
    if (!this.loggedInUser) {
      return;
    }
    this.submitForm();
    setTimeout(() => {
      this.scrollMessagesToBottom();
    }, 1000);
  };

  submitForm() {
    for (const i in this.messageForm.controls) {
      this.messageForm.controls[i].markAsDirty();
      this.messageForm.controls[i].updateValueAndValidity();
    }
    if (this.messageForm.valid) {
      let messageFormObject = this.messageForm.getRawValue();
      let finalObject:VC_Message = {
        from_user_id : this.loggedInUser.id,
        from_user_name: this.loggedInUser.fullname,
        text: messageFormObject.user_message,
        sent_at: new Date(),
        type: "0"
        };
      this.videoConferenceService
            .addSessionMessage(this.lsessionid, finalObject)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((result: any) => {
              this.messageForm.reset();
              this.isMessageSended = false;
            }, error=> {
              this.isMessageSended = false;
            });
    }
  }
  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }

  ShowTimeDiffrence(diff_in_secs_:number, is_elapsed:boolean=false):string{
    let res:string='';
    let diff_in_secs:number=diff_in_secs_;
    if(diff_in_secs<60){
      if(diff_in_secs ==0 || diff_in_secs==1)
        res= diff_in_secs + ' ' + this.translate.instant('Second');
      else
        res= Math.round(diff_in_secs) + ' ' + this.translate.instant('Seconds');
    }
    else {
      let diff_in_minutes:number = diff_in_secs/60;
      if(diff_in_minutes<60){
        if(diff_in_minutes ==0 || diff_in_minutes==1)
          res= diff_in_minutes + ' ' + this.translate.instant('Minute');
        else
          res= Math.floor(diff_in_minutes) + ' ' + this.translate.instant('Minutes');
        diff_in_secs = (diff_in_minutes-Math.floor(diff_in_minutes))*60;
        if(diff_in_secs !=0)
        {
          if(diff_in_secs==1)
            res += ' && ' + diff_in_secs + ' ' + this.translate.instant('Second');
          else if(Math.floor(diff_in_secs)!=0)
            res += ' && ' + Math.floor(diff_in_secs) + ' ' + this.translate.instant('Seconds');
        }
      }
      else{
        let diff_in_hours:number = diff_in_minutes/60;
        if(diff_in_hours ==0 || diff_in_hours==1)
          res= diff_in_hours + ' ' + this.translate.instant('Hour');
        else if(Math.floor(diff_in_hours)!=0)
          res= Math.floor(diff_in_hours) + ' ' + this.translate.instant('Hours');
       diff_in_minutes = (diff_in_hours-Math.floor(diff_in_hours))*60;
       if(diff_in_minutes<60){
        if(diff_in_minutes!=0){
          if(diff_in_minutes==1)
            res += ' && ' + diff_in_minutes + ' ' + this.translate.instant('Minute');
          else if(Math.floor(diff_in_minutes)!=0)
            res += ' && ' + Math.floor(diff_in_minutes) + ' ' + this.translate.instant('Minutes');
          diff_in_secs =( diff_in_minutes-Math.floor(diff_in_minutes))*60;
          if(diff_in_secs!=0){
            if(diff_in_secs==1)
              res += ' && ' + diff_in_secs + ' ' + this.translate.instant('Second');
            else
              res += ' && ' + Math.floor(diff_in_secs) + ' ' + this.translate.instant('Seconds');
          }
        }
      }
      }
    }
    if(is_elapsed){
      let current_lsession_start_time: Date= new Date(this.current_lsession?.start_time);
      let current_date_time: Date = new Date();
      this.session_started_in_diff_in_secs = Math.floor((current_lsession_start_time.getTime() - current_date_time.getTime()) / 1000);
    }
    return res;
  }

  async joinStream(){
    if(this.current_lsession.is_started==false){
      this.showMessage(this.translate.instant('ErrorMessageTitle'), this.translate.instant('ThisSessionIsNotStarted'));
      this.isLoading=false;
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      this.current_lsession_is_ended=true;
      this.showMessage(this.translate.instant('ErrorMessageTitle'), this.translate.instant('ThisSessionHasBeenEnded'));
      this.isLoading=false;
      return;
    }
    if(!this.streamContainerElement || !this.streamContainerElement.nativeElement){
      return;
    }
    if(this.current_user_joined_streem) return;
    try{
      this.current_user_joined_streem=true;
      this.local_tracks=[];
      this.local_tracks[0] = await AgoraRTC.createMicrophoneAudioTrack({}).catch((err)=>{
      })
      this.local_tracks[1] = await AgoraRTC.createCameraVideoTrack(
        {
          encoderConfig: "720p_6",
          optimizationMode: "motion"
        }
      ).catch((err)=>{
      });
      this.local_tracks[1].play(`user-${this.rtm_uid}`,{fit: "contain"});
      await this.rtc_client?.publish([this.local_tracks[0], this.local_tracks[1]]);
    }
    catch(err){
      this.current_user_joined_streem=false;
    }
  };

  getTrack(i:any){
    let track;
    if (i == this.current_vcParticipant?.uid){
      track = this.local_tracks[1];
      if (this.local_screen_tracks){
        track = this.local_screen_tracks;
      }
    }
    else{
      let o = this.rtc_client?.remoteUsers.find(ru => ru.uid == i);
      track = o?.videoTrack;
    }
    return track;
  }

  FullSceenToggle(u:any){
    this.preventOneClick = true;
    clearTimeout(this.onClickTimer);
    const elem = this.current_stream_user_containerElement.nativeElement;
    if(!this.is_fullSceen)
    {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
      this.is_fullSceen=true;
    }
    else{
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this.is_fullSceen=false;
    }
  }

  minimizeScreen(u:any){
    this.onClickTimer = 0;
    this.preventOneClick = false;
    let delay = 250;
    this.onClickTimer = setTimeout(() => {
      if(!this.preventOneClick){
        let isUserExistsInStream_users:VC_Participant = this.stream_users?this.stream_users.find(obj=>obj.uid == u.uid):null;
        if(!isUserExistsInStream_users)
        {
          this.stream_users.push(u);
          let track_stream =  this.getTrack(u.uid);
          this.current_stream_user= null;
          this.preventOneClick = true;
          setTimeout(() => {
            track_stream.play(`user-${u.uid}`,{fit: "contain"});
          },delay)
        }
      }
    }, delay);
  };
  maximizeStreamUserScreen(u:any){
    let delay=250;
    let track_stream = this.getTrack(u.uid);
    track_stream.stop();
    let x = this.current_stream_user;
    if (x != null) {
      let track_box = this.getTrack(x.uid);
      track_box.stop();
      this.stream_users.push(x);
      setTimeout(() => {
          track_box.play(`user-${x.uid}`,{fit: "contain"});
      }, delay);
    }
    let index = this.stream_users.findIndex(o=>o.uid==u.uid);
    if (index != - 1){
      this.stream_users.splice(index,1);
    }
    this.current_stream_user = u;
    setTimeout(() => {
      track_stream.play(`user-${u.uid}`,{fit: "contain"});
    }, delay);
  };

  makeFullScreen(u:any){
    let elemId = `user-container-` + u.uid;
    let celem = document.getElementById(elemId);
    let elem= celem.querySelector('video') as HTMLVideoElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  toggleParticipants(){
    this.messagesSelected = false;
    this.participantsSelected = !this.participantsSelected;
    if(!this.messagesSelected && !this.participantsSelected){
      this.p_nzXs = 24;
      this.p_nzSm =24;
      this.p_nzMd =24;
      this.p_nzLg =24;
      this.p_nzXl =24;
      this.p_nzXXl =24;
      this.m_nzXs = 0;
      this.m_nzSm =0;
      this.m_nzMd =0;
      this.m_nzLg =0;
      this.m_nzXl =0;
      this.m_nzXXl =0;
    }
    else{
      this.p_nzXs = 24;
      this.p_nzSm =24;
      this.p_nzMd =24;
      this.p_nzLg =15;
      this.p_nzXl =15;
      this.p_nzXXl =15;
      this.m_nzXs = 24;
      this.m_nzSm =24;
      this.m_nzMd =24;
      this.m_nzLg =8;
      this.m_nzXl =8;
      this.m_nzXXl =8;
    }
    if(this.isDeviceSmall){
      if(this.participantsSelected){
        this.hideParticipantsContainer = false;
        this.hideMessagesContainer = true;
        this.hideVideosContainer = true;
      }
      else{
        this.hideParticipantsContainer = true;
        this.hideMessagesContainer = true;
        this.hideVideosContainer = false;
      }
    }
    else{
      this.hideParticipantsContainer = false;
      this.hideMessagesContainer = false;
      this.hideVideosContainer = false;
    }
  };
  toggleMessages(){
    this.participantsSelected=false;
    this.messagesSelected = !this.messagesSelected;
    if(!this.messagesSelected && !this.participantsSelected){
      this.p_nzXs = 24;
      this.p_nzSm =24;
      this.p_nzMd =24;
      this.p_nzLg =24;
      this.p_nzXl =24;
      this.p_nzXXl =24;
      this.m_nzXs = 0;
      this.m_nzSm =0;
      this.m_nzMd =0;
      this.m_nzLg =0;
      this.m_nzXl =0;
      this.m_nzXXl =0;
    }
    else{
      this.p_nzXs = 24;
      this.p_nzSm =24;
      this.p_nzMd =24;
      this.p_nzLg =15;
      this.p_nzXl =15;
      this.p_nzXXl =15;
      this.m_nzXs = 24;
      this.m_nzSm =24;
      this.m_nzMd =24;
      this.m_nzLg =8;
      this.m_nzXl =8;
      this.m_nzXXl =8;
    }
    if(this.isDeviceSmall){
      if(this.messagesSelected){
        this.hideParticipantsContainer = true;
        this.hideMessagesContainer = false;
        this.hideVideosContainer = true;
      }
      else{
        this.hideParticipantsContainer = true;
        this.hideMessagesContainer = true;
        this.hideVideosContainer = false;
      }
    }
    else{
      this.hideParticipantsContainer = false;
      this.hideMessagesContainer = false;
      this.hideVideosContainer = false;
    }
  }

  async leaveStream (){
    try{
      this.sharing_screen = false;
      if (this.current_stream_user && this.current_stream_user.uid == this.rtm_uid)
        this.current_stream_user = null;
      for (let i = 0; this.local_tracks.length > i; i++) {
        this.local_tracks[i].stop();
        this.local_tracks[i].close();
      }
      let ind = this.stream_users.findIndex(o=>o.uid== this.rtm_uid);
      if (ind != -1){
        this.stream_users.splice(ind,1);
      }
      await this.rtc_client?.unpublish([this.local_tracks[0], this.local_tracks[1]]);
      if (this.local_screen_tracks) {
        this.local_screen_tracks.stop();
        this.local_screen_tracks.close();
        await this.rtc_client?.unpublish([this.local_screen_tracks]);
      }
    }
    catch(er){
    }
    try{
      this.rtc_client.leave();
    }
    catch(er){
    }
    finally{
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
  };

  async leaveAllStream (){
    this.leaveStream();
    this.leaveChannel();
  }

  startRecording() {
    this.is_recording_started=true;
  }

  abortRecording() {
  }

  stopRecording() {
    this.is_recording_started=false;
    this.videoBlobUrl={url:'test'}
  }

  downloadRecording(){
    this._downloadFile(this.videoBlob, 'video/mp4', this.videoName);
  }

  clearRecording(){
    this.videoBlobUrl = null;
  }

  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  async leaveChannel() {
    try{
      //localStorage.removeItem(this.lsessionid);
      await this.rtc_client?.leave();
      await this.rtm_channel.leave();
      await this.rtm_client.logout();
    }
    catch(er){
    }
    this.rtm_client=null;
    this.rtc_client=null;
    this.rtm_channel=null;
    try{
      await this.sendLeavingMessage();
    }
    catch(er){
    }
    try{
      this.current_vcParticipant.camera_on=false;
        this.current_vcParticipant.mic_on=false;
        this.current_vcParticipant.screen_share_on=false;
        this.current_vcParticipant.is_online=false;
        this.current_vcParticipant.leaved_at=new Date();
        await this.videoConferenceService.updateSessionParticipant(this.current_lsession.id, this.current_vcParticipant.id, this.current_vcParticipant)
        .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((result: any) => {
            this.current_user_joined_streem=false;
          }, error=> {
          });
    }
    catch(er){
    }
  };

  async toggleMic(){
    if (this.local_tracks[0].muted) {
      await this.local_tracks[0].setMuted(false);
      this.mic_btn_class="active";
      if(this.current_vcParticipant !=null)
      {
        this.current_vcParticipant.mic_on=true;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .pipe(take(1))
            .subscribe((result: any) => {
            }, error=> {
            });
          }
          catch(er){
          }
      }
    } else {
      await this.local_tracks[0].setMuted(true);
      this.mic_btn_class="notactive";
      if(this.current_vcParticipant !=null)
      {
        this.current_vcParticipant.mic_on=false;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .pipe(take(1))
            .subscribe((result: any) => {
            }, error=> {
            });
          }
          catch(er){
          }
      }
    }
  };

  async toggleCamera(){
    if (this.local_tracks[1].muted) {
      await this.local_tracks[1].setMuted(false);
      this.camera_btn_class="active";
      if(this.current_vcParticipant !=null)
      {
        this.current_vcParticipant.camera_on=true;
        this.current_vcParticipant.screen_share_on=false;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .pipe(take(1))
            .subscribe((result: any) => {
            }, error=> {
            });
          }
          catch(er){
          }
      }
    } else {
      await this.local_tracks[1].setMuted(true);
      this.camera_btn_class="notactive";
      if(this.current_vcParticipant !=null)
      {
        this.current_vcParticipant.camera_on=false;
        this.current_vcParticipant.screen_share_on=false;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .pipe(take(1))
            .subscribe((result: any) => {
            }, error=> {
            });
          }
          catch(er){
          }
      }
    }
  };
  async toggleScreen(){
    if (this.sharing_screen == false) {
      try{
        this.local_screen_tracks = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: "720p_3",
            optimizationMode: "detail"
          }
        );
        this.local_screen_tracks.on('track-ended', async () => {
          this.sharing_screen =true;
          await this.toggleScreen();
        });
        if(this.local_screen_tracks){
          this.sharing_screen = true;
          this.screen_btn_class="active";
          this.camera_btn_class="notactive";
          this.camera_btn_display="none";
          this.local_tracks[1].stop();
          this.local_screen_tracks.play(`user-${this.rtm_uid}`,{fit: "contain"});
          await this.rtc_client?.unpublish(this.local_tracks[1]);
          await this.rtc_client?.publish(this.local_screen_tracks).then(()=>{
            if(this.current_vcParticipant !=null)
            {
              this.current_vcParticipant.camera_on=false;
              this.current_vcParticipant.screen_share_on=true;
              try{
                this.videoConferenceService
                  .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
                  .pipe(take(1))
                  .subscribe((result: any) => {
                  }, error=> {
                  });
                }
                catch(er){
                }
            }
          });
        }
      }
      catch(cse){
        this.sharing_screen =true;
        await this.toggleScreen();
      }
    } else {
      this.sharing_screen = false;
      this.screen_btn_class="notactive";
      this.camera_btn_class="active";
      this.camera_btn_display="block";
      this.local_screen_tracks.stop();
      this.local_screen_tracks.close();
      this.local_tracks[1].play(`user-${this.rtm_uid}`,{fit: "contain"});
      await this.rtc_client?.unpublish(this.local_screen_tracks);
      await this.rtc_client?.publish(this.local_tracks[1]).then(()=>{
        this.local_screen_tracks = null;
        if(this.current_vcParticipant !=null)
        {
          this.current_vcParticipant.camera_on=true;
          this.current_vcParticipant.screen_share_on=false;
          try{
            this.videoConferenceService
              .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
              .pipe(take(1))
              .subscribe((result: any) => {
              }, error=> {
              });
            }
            catch(er){
            }
        }
      });
    }
  }
  async EndSession(){
    if(!this.is_current_user_owner) return;
    try{
      await this.leaveStream().then(async ()=>{
        await this.leaveChannel().then(async ()=>{
          let ending_message='has Ended the session at ' + new Date().toDateString();
          this.current_lsession.ended_at=new Date();
          this.current_lsession.is_ended=true;
          await this.sendLeavingMessage(ending_message).then(async ()=>{
            await this.videoConferenceService.endVideoConferenceById(this.current_lsession.id, this.current_lsession, this.sessionParticipants, this.sessionParticipantsWaitlist)
            .then((response)=>{
              if(response.is_ended==false){
                this.current_user_joined_streem=false;
                this.current_lsession_is_ended =true;
                this.current_lsession_is_ended=true;
                this.location.back();
              }
            })
            .catch((error)=>{
            })
          });
        });
      });
    return true;
    }
    catch(err){
    }
    finally{
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
      this.justgoBack();
      return true;
    }
  }
  async LeaveSession(){
    if(!this.current_user_joined_streem) return;
    if(this.is_current_user_owner) return;
    try{
      await this.leaveStream();
      await this.leaveChannel();
    }
    catch(err){
    }
    finally{
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
      this.justgoBack();
      return true;
    }
  }

  async UserLeft(uid:any){
    let p_found_index = this.stream_users.findIndex(x => x.uid == uid);
    if (p_found_index > 0) {
      let p_found: VC_Participant = this.stream_users[p_found_index];
      if (p_found) {
        try{
          p_found.camera_on=false;
          p_found.mic_on=false;
          p_found.screen_share_on=false;
          p_found.is_online=false;
          p_found.leaved_at=new Date();
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, p_found.id, p_found)
            .pipe(take(1))
            .subscribe((result: any) => {
            }, error=> {
            });
          return true;
        }
        catch(err){
        }
      }
    }

  }
  AdmitUserFiredHandle(isWantAddmition:boolean){
    if(isWantAddmition){
    if(this.isFreeSession && this.session_participantsCount>=2){
      this.showSubscriptionDialog=true;
      this.showModal();
    }
  }
}

  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.router.navigate(["vc/subscription"]);
      this.isOkLoading = false;
    }, 30000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  async goBack(){
    try{
      await this.LeaveSession();
      this.router.navigate(["./video-conference"]);
    }
    catch(err){
    }
  }
  async justgoBack(){
    try{
      this.router.navigate(["./video-conference"]);
    }
    catch(err){
    }
  }

  getUserName(userName:any){
    this.userNameValue = userName;
  }

  isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
  }

  liveSessionsJoin(){
    if(this.isEmptyOrSpaces(this.userNameValue)){
      return;
    }
    let currSessionUserLS = localStorage.getItem(this.lsessionid);
    if(currSessionUserLS){
      this.loggedInUser = JSON.parse(currSessionUserLS)
    }
    else{
      this.loggedInUser = {
        id :String(Math.floor(Math.random() * 10000)),
        fullname: this.userNameValue,
        slug: false,
        created_at: new Date().toDateString(),
        updated_at: '',
        lang: '',
        avatar: '',
        bio: '',
        type: '',
        user_type: '',
        is_guest_post_enabled: false
      };
      localStorage.setItem(this.lsessionid, JSON.stringify(this.loggedInUser));
    }
    this.JoinSessionNow();
  }
  JoinSessionNow():void {
    this.isLoading=true;
    this.loadSubscriptions();
    if(this.current_lsession_is_ended) {
      this.showMessage(this.translate.instant("ErrorMessageTitle"), this.translate.instant("ThisSessionHasBeenEnded"));
      this.isLoading=false;
      return;
    }
    this.videoConferenceService.getSessionById(this.lsessionid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(async (data)=>{
      if (!data) return;
      if(data && data.length>0)
        this.current_lsession = data[0];
      if(this.current_lsession.is_started==false){
        this.current_lsession_is_started =false;
        this.showMessage(this.translate.instant("ErrorMessageTitle"), this.translate.instant("ThisSessionIsNotStarted"));
        this.isLoading=false;
        return;
      }
      if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
        this.current_lsession_is_ended=true;
        this.showMessage(this.translate.instant("ErrorMessageTitle"), this.translate.instant("ThisSessionHasBeenEnded"));
        this.isLoading=false;
        return;
      }
      let current_lsession_start_time: Date= new Date(this.current_lsession?.start_time);
      let current_lsession_end_time: Date= new Date(this.current_lsession?.end_time);
      let current_date_time: Date = new Date();
      if(current_lsession_start_time > current_date_time){
        this.current_lsession_is_started =false;
        this.session_started_in_diff_in_secs = Math.floor((current_lsession_start_time.getTime() - current_date_time.getTime()) / 1000);
        this.showMessage(this.translate.instant("ErrorMessageTitle"), this.translate.instant("ThisSessionWillStartAfter") + ' : ' + this.ShowTimeDiffrence(this.session_started_in_diff_in_secs));
        this.isLoading=false;
        return;
      }
      if(current_lsession_end_time <= current_date_time){
        this.current_lsession_is_started =false;
        this.session_ended_in_diff_in_secs = Math.floor((current_date_time.getTime() - current_lsession_end_time.getTime()) / 1000);
        this.showMessage(this.translate.instant("ErrorMessageTitle"), this.translate.instant("ThisSessionHasBeenEndedBefore") + ' : ' + this.ShowTimeDiffrence(this.session_ended_in_diff_in_secs));

        if(this.loggedInUser.id == this.current_lsession.owner_id){
          this.current_lsession_is_ended =true;
          this.current_lsession.is_ended=true;
          this.isLoading=false;
          this.current_lsession.ended_at=new Date();
          let ending_message=this.translate.instant("hasEndedTheSessionAt") + " : " + new Date().toDateString() + ', ' + this.translate.instant("becauseItHasBeenExpired") + ' ... ';
          await this.sendLeavingMessage(ending_message);
          await this.videoConferenceService.endVideoConferenceById(this.current_lsession.id, this.current_lsession, this.sessionParticipants, this.sessionParticipantsWaitlist).finally(()=>{
            this.current_lsession_is_ended = true;
            this.isLoading=false;
          })
        }
        this.current_lsession_is_ended = true;
        this.isLoading=false;
        return;
      }
      this.current_lsession_is_started =true;
      if(this.loggedInUser.id == this.current_lsession.owner_id){
        if(!this.added_current_user){
          this.is_current_user_owner = true;
          this.addCurrentUserToCurrentSession('owner');
        }
      }
      else{
        if(!this.added_current_user){
          this.is_current_user_owner = false;
          this.addCurrentUserToCurrentSession();
        }
      }
      await this.getCurrentSessionMessages();
      await this.getSessionOnWaitParticipants();
      await this.getCurrentSessionParticipants();
      this.isLoading = false;
    });
  }
}

