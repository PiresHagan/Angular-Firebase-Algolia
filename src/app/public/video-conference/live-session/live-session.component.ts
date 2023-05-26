import { HostListener, Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { VC_Message, VC_Participant, VideoConferenceSession } from 'src/app/shared/interfaces/video-conference-session.type';
import {environment} from 'src/environments/environment';
import {AuthService} from 'src/app/shared/services/authentication.service';
import { NzMessageService } from "ng-zorro-antd/message";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import AgoraRTC, { ConnectionState, IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, ILocalAudioTrack, ILocalTrack, ILocalVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import AgoraRTM, { RtmChannel, RtmClient, RtmMessage, RtmTextMessage } from 'agora-rtm-sdk';
import { Member } from 'src/app/shared/interfaces/member.type';
import { VideoConferenceService } from 'src/app/shared/services/video-conference.service';

@Component({
  selector: 'app-live-session',
  templateUrl: './live-session.component.html',
  styleUrls: ['./live-session.component.scss']
})
export class LiveSessionComponent implements OnInit, OnDestroy {
  async ngOnDestroy() {
    console.log("start ... destroy");
    if(this.current_lsession_is_ended)
      return;

    try{
      await this.leaveStream();
      console.log("leaving Stream ... destroy");
      await this.leaveChannel();
      console.log("leaving channel ... destroy");
    return true;
    }
    catch(err){
      console.log('error in destroy:'  + err);
    }
}
  isMessageSended: boolean;
  added_current_user: boolean=false;
  current_user_joined_streem: boolean=false;
  @HostListener('window:beforeunload .... beforeUnloadHandler', ['$event'])
  async beforeUnloadHandler(event: Event) {
    if(this.current_lsession_is_ended)
      return;
    console.log("start ... before unload");
    try{
      await this.leaveStream();
      console.log("leaving Stream ... before unload");
      await this.leaveChannel();
      console.log("leaving channel ... before unload");
    return true;
    }
    catch(err){
      console.log('error in before unload:'  + err);
    }
  };
  @HostListener('window:unload', [ '$event' ])
  async unloadHandler(event) {
    console.log("start ... unload");
    if(this.current_lsession_is_ended)
      return;
    try{
      await this.leaveStream();
      console.log("leaving Stream ... unload");
      await this.leaveChannel();
      console.log("leaving channel ... unload");
    return true;
    }
    catch(err){
      console.log('error in unload:'  + err);
    }
  }

  lsessionid: string;
  current_lsession:VideoConferenceSession=null;
  current_vcParticipant:VC_Participant=null;
  current_vcParticipant_id:any=null;
  loggedInUser: Member;
  is_current_user_owner:boolean=false;
  sessionParticipantsWaitlist: VC_Participant[] = [];
  sessionParticipants: VC_Participant[] = [];
  sessionMessages: VC_Message[] = [];
  current_lsession_is_ended:boolean=false;
  agora_APP_ID = environment.agoraConfiguration.appid;
  rtm_client: any= null;
  rtm_token : any;
  rtm_uid : string = String(Math.floor(Math.random() * 10000));
  stream_users: any[] = [];
  current_stream_user: any = null;
  can_user_join_stream:boolean = false;
  local_tracks: any;
  local_screen_tracks: any;
  rtc_channel : any;
  rtc_client: IAgoraRTCClient|null = null;
  mic_btn_class: string="active";
  camera_btn_class: string="active";
  sharing_screen: boolean=false;
  screen_btn_class: string ="notactive";
  camera_btn_display: string;
  show_participants: boolean;
  show_messages: boolean;
  session_messagesCount:number = 0;
  session_participantsCount: number=0;
  session_waitlist_participantsCount: number=0;
  last_message_visible:any;
  last_pasrticipant_visible:any;
  last_pasrticipantWaitlist_visible:any;
  messageForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private authService:AuthService,
    private location: Location,
    private fb: FormBuilder,
    private message: NzMessageService,
    private videoConferenceService:VideoConferenceService,
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.lsessionid = params.get('lsessionid');
      console.log('lsessionid: '+ this.lsessionid);
    });
    this.messageForm = this.fb.group({
      user_message: [null, [Validators.required]]
    });
    this.setFormData();
    //const loggedInUser = this.authService.getLoginDetails();
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user) return;
      const cloggedInUser = await this.authService.getLoggedInUserDetails();
      if (!cloggedInUser) return;
      this.loggedInUser = cloggedInUser;
      //this.rtm_uid = this.loggedInUser.id;
      if(this.current_lsession_is_ended) {
        this.showMessage("error", 'This Session has been ended ');
        return;
      }
      this.videoConferenceService.getSessionById(this.lsessionid).subscribe(async (data)=>{
        if (!data) return;
        this.current_lsession = data;
        if(this.current_lsession.is_started==false){
          this.showMessage("error", 'This Session is not started ');
          return;
        }
        if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
          this.showMessage("error", 'This Session has been ended ');
          return;
        }
        let current_lsession_start_time: Date= new Date(this.current_lsession?.start_time);
        let current_lsession_end_time: Date= new Date(this.current_lsession?.end_time);
        let current_date_time: Date = new Date();
        if(current_lsession_start_time > current_date_time){
          let diff_in_secs = Math.floor((current_lsession_start_time.getTime() - current_date_time.getTime()) / 1000);
          this.showMessage("error", 'This Session Will start after: ' + this.ShowTimeDiffrence(diff_in_secs));
          return;
        }
        if(current_lsession_end_time <= current_date_time){
          let diff_in_secs = Math.floor((current_date_time.getTime() - current_lsession_end_time.getTime()) / 1000);
          this.showMessage("error", 'This Session has been ended before: ' + this.ShowTimeDiffrence(diff_in_secs));
          if(this.loggedInUser.id == this.current_lsession.owner_id){
            this.current_lsession_is_ended =true;
            this.current_lsession.is_ended=true;
            this.current_lsession.ended_at=new Date();
            let ending_message='has Ended the session at ' + new Date().toDateString() + ' ... because it has been expired!! ';
            await this.sendLeavingMessage(ending_message);
            await this.videoConferenceService.endVideoConferenceById(this.current_lsession.id, this.current_lsession, this.sessionParticipants, this.sessionParticipantsWaitlist);
          }
          return;
        }

        if(!this.rtm_client || this.rtm_client == null){
          await this.InitSession();
        }
        if(this.loggedInUser.id == this.current_lsession.owner_id){
          if(!this.added_current_user){
            this.is_current_user_owner = true;
            this.addCurrentUserToCurrentSession('owner');
            let welcominging_message='has started the session ';
            this.sendWelcomMessage(welcominging_message);
          }
        }
        else{
          if(!this.added_current_user){
            this.is_current_user_owner = false;
            this.addCurrentUserToCurrentSession();
            let welcominging_message='has asked to join this session ';
            this.sendWelcomMessage(welcominging_message);
          }
        }
        await this.getCurrentSessionMessages();
        await this.getSessionOnWaitParticipants();
        await this.getCurrentSessionParticipants();
      });
    });
  }

  async addCurrentUserToCurrentSession(type:string='participant'){
    if(this.current_lsession.is_started==false){
      this.showMessage("error", 'This Session is not started ');
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      this.showMessage("error", 'This Session has been ended ');
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
          screen_share_on:false
          };
          try{
              this.videoConferenceService
                .addSessionParticipant(this.lsessionid, finalObject)
                .subscribe((result: any) => {
                  console.log(JSON.stringify(result));
                  console.log("success", "user added succesfully");
                }, error=> {
                  console.log(JSON.stringify(JSON.stringify(error)));
                });
              }
              catch(er){
                console.log(JSON.stringify(JSON.stringify(er)));
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
          screen_share_on:false
          };
          try{
              this.videoConferenceService
                    .addSessionParticipant(this.lsessionid, finalObject)
                    .subscribe((result: any) => {
                      this.messageForm.reset();
                      this.isMessageSended = false;
                      console.log(result);
                      console.log("success", "user added succesfully");
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
    if(type=='owner'){
      if(this.can_user_join_stream && !this.current_user_joined_streem){
        this.joinStream();
        //this.current_stream_user= this.rtm_uid; //this.loggedInUser.id;
        //this.maximizeStreamUserScreen(this.current_stream_user);
      }
  }
    this.added_current_user=true;
}


  setFormData() {

  }

  async InitSessionTesting(){
    console.log('InitSessionTesting started .... ');
    this.can_user_join_stream = true;
    this.stream_users.push(this.loggedInUser.id);
  }

  async joinStreamTesting(){
    console.log("joinStreamTesting started ....");
    this.stream_users.push(this.loggedInUser.id);
    console.log("joined ...... ");
  }

  getCurrentSessionInfo(){
    console.log('getCurrentSessionInfo')
    this.videoConferenceService.getSessionById(this.lsessionid).subscribe((data)=>{
      this.current_lsession = data;
      console.log('current_lsession: ' + this.current_lsession.name);
    });
  }
  async getCurrentSessionMessages(){
    if(this.current_lsession.is_started==false){
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      return;
    }
    await this.videoConferenceService.getSessionMessages(this.lsessionid, 1000, 'first', this.last_message_visible).subscribe((data)=>{
      this.sessionMessages = data.messages;
      this.last_message_visible=data.lastVisible;
      this.session_messagesCount = this.sessionMessages.length;
    })
  }
  async getCurrentSessionParticipants(){
    if(this.current_lsession.is_started==false){
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      return;
    }
    await this.videoConferenceService.getSessionParticipants(this.lsessionid, 1000, 'first', this.last_pasrticipant_visible).subscribe((data)=>{
      this.sessionParticipants = data.participants;
      this.last_pasrticipant_visible=data.lastVisible;
      this.session_participantsCount = this.sessionParticipants.length;
      if(this.rtm_client && this.rtm_client!=null && this.loggedInUser && this.loggedInUser!=null){
        this.sessionParticipants.map(sp=>{
          if(sp.user_id==this.loggedInUser.id){
                  this.current_vcParticipant = sp;
                  this.current_vcParticipant_id = sp.id;
                  //if(this.loggedInUser.id != this.current_lsession.owner_id)
                  {
                    if(this.current_vcParticipant.asked_to_join==true && this.current_vcParticipant.is_approved){
                        if(this.can_user_join_stream && !this.current_user_joined_streem){
                          if(this.current_lsession.is_started && !this.current_lsession.is_ended){
                            this.joinStream();
                          //this.current_stream_user= this.rtm_uid; //this.loggedInUser.id;
                          //this.maximizeStreamUserScreen(this.current_stream_user);
                          }
                        }
                    }
                  }
          }
        });
      }
    })
  }
  async getSessionOnWaitParticipants (){
    if(this.current_lsession.is_started==false){
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      return;
    }
    await this.videoConferenceService.getSessionOnWaitParticipants(this.lsessionid, 1000, 'first', this.last_pasrticipantWaitlist_visible).subscribe((data)=>{
      this.sessionParticipantsWaitlist = data.participants;
      this.last_pasrticipantWaitlist_visible=data.lastVisible;
      this.session_waitlist_participantsCount = this.sessionParticipantsWaitlist.length;
    })
  }

  async InitSession(){
    if(this.current_lsession.is_started==false){
      this.showMessage("error", 'This Session is not started ');
      return;
    }
    if(this.current_lsession_is_ended==true || this.current_lsession.is_ended==true){
      this.showMessage("error", 'This Session has been ended ');
      return;
    }
    console.log('Init Session started .... ');
    try{
        this.rtm_client = await AgoraRTM.createInstance(this.agora_APP_ID);
        //await this.rtm_client.login({ rtm_uid_,rtm_token_});
        await this.rtm_client.login({ uid:this.rtm_uid, token:this.rtm_token});
        await this.rtm_client.addOrUpdateLocalUserAttributes({ name: this.loggedInUser.fullname});
        this.rtc_channel = await this.rtm_client.createChannel(this.lsessionid);
        await this.rtc_channel.join();
        this.rtc_client = await AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

        this.rtc_client.on('connection-state-change',async (curState : ConnectionState, revState : ConnectionState)=>{
          console.log("STATE: ",curState);
          if (curState == "CONNECTED"){
              this.can_user_join_stream = true;
          }
        })


        await this.rtc_client.join(this.agora_APP_ID, this.lsessionid, null, this.rtm_uid);
        console.log("rtc_client uid: ",this.rtc_client.uid);

        this.rtc_client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio"|"video")=>{
          console.log("JOIINED");
          await this.rtc_client?.subscribe(user, mediaType);
          let player = this.stream_users.indexOf(user.uid);
          console.log("joined: ",user.uid,this.rtm_uid,this.stream_users,player);
          if ((player === -1) && (this.current_stream_user != user.uid)) {
            //if(user.uid!=this.loggedInUser.id)
              this.stream_users.push(user.uid);
          }
          if (mediaType === "video") {
            user.videoTrack?.play(`user-${user.uid}`);
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });

        let user_lefted = async (user: IAgoraRTCRemoteUser) =>{
          console.log("lefting: " + user.uid);
          let ind = this.stream_users.indexOf(user.uid);
          if (ind != -1){
            this.stream_users.splice(ind,1);
          }
          else if (this.current_stream_user == user.uid){
            this.current_stream_user = null;
          }
        };
        this.rtc_client.on("user-left", user_lefted);

    }
    catch(err){
      console.log(err);
    }
    /*if(this.can_user_join_stream){
      await this.joinStream();
    }*/
  }

  async sendWelcomMessage(msg:string='has Joined The Session'){
    msg= msg + ' at ' + new Date().toDateString();
    let finalObject:VC_Message = {
      from_user_id : "-1",
      from_user_name: "boot",
      text: `${this.loggedInUser.fullname}  ${msg} ..... `,
      sent_at: new Date(),
      type: "-1"
      };
    this.videoConferenceService
          .addSessionMessage(this.lsessionid, finalObject)
          .subscribe((result: any) => {
            this.messageForm.reset();
            console.warn(result);
            console.log("success", "welcome message sended succesfully");
            this.showMessage("success", "welcome message sended succesfully");
            this.isMessageSended = false;
          }, error=> {
            this.showMessage("error", error.message);
            this.isMessageSended = false;
          });
  }

  async sendLeavingMessage(msg:string='has Left The Session'){
    let finalObject:VC_Message = {
      from_user_id : "-1",
      from_user_name: "boot",
      text: `${this.loggedInUser.fullname}  ${msg} ..... `,
      sent_at: new Date(),
      type: "-1"
      };
    this.videoConferenceService
          .addSessionMessage(this.lsessionid, finalObject)
          .subscribe((result: any) => {
            this.messageForm.reset();
            console.warn(result);
            console.log("success", "leaving message sended succesfully");
            this.showMessage("success", "leaving message sended succesfully");
            this.isMessageSended = false;
          }, error=> {
            this.showMessage("error", error.message);
            this.isMessageSended = false;
          });
  }

  SendMessage(){
    if (!this.loggedInUser) {
      console.log('log in.... ');
      return;
    }
    console.log('Sending Message.... ');
    this.submitForm();
  };

  submitForm() {
    for (const i in this.messageForm.controls) {
      this.messageForm.controls[i].markAsDirty();
      this.messageForm.controls[i].updateValueAndValidity();
    }
    /*if (this.findInvalidControls().length) {
      this.showWarning();
      return;
    }*/

    if (this.messageForm.valid) {
      let messageFormObject = this.messageForm.getRawValue();
      console.log(JSON.stringify(messageFormObject));
      let finalObject:VC_Message = {
        from_user_id : this.loggedInUser.id,
        from_user_name: this.loggedInUser.fullname,
        text: messageFormObject.user_message,
        sent_at: new Date(),
        type: "0"
        };
      this.videoConferenceService
            .addSessionMessage(this.lsessionid, finalObject)
            .subscribe((result: any) => {
              this.messageForm.reset();
              console.warn(result);
              console.log("success", "message sended succesfully");
              this.showMessage("success", "message sended succesfully");
              this.isMessageSended = false;
            }, error=> {
              this.showMessage("error", error.message);
              this.isMessageSended = false;
            });
    }
  }
  showMessage(type: string, message: string) {
    this.message.create(type, message);
  }

  ShowTimeDiffrence(diff_in_secs:number):string{
    let res:string='';
    if(diff_in_secs<60){
      if(diff_in_secs ==0 || diff_in_secs==1)
        res= diff_in_secs + ' second';
      else
      res= diff_in_secs + ' secondes';
    }
    else {
      let diff_in_minutes = diff_in_secs/60;
      if(diff_in_minutes<60){
        if(diff_in_minutes ==0 || diff_in_minutes==1)
        res= diff_in_minutes + ' minute';
        else
        res= diff_in_minutes + ' minutes';
      }
      else{
        let diff_in_hours = diff_in_minutes/60;
        if(diff_in_hours ==0 || diff_in_hours==1)
          res= diff_in_hours + 'hour';
        else
          res= diff_in_hours + ' hours';
      }
    }
    return res;
  }

  async joinStream(){
    if(this.current_lsession.is_started==false){
      this.showMessage("error", 'This Session is not started ');
      return;
    }
    if(this.current_lsession_is_ended || this.current_lsession.is_ended==true){
      this.showMessage("error", 'This Session has been ended ');
      return;
    }
    console.log("current_user_joined_streem .... ");
    if(this.current_user_joined_streem) return;
    try{
      this.current_user_joined_streem=true;
      console.log("join stream ....");
      this.stream_users.push(this.rtm_uid);
      this.local_tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        {},
        {
          encoderConfig: "720p_6",
          optimizationMode: "motion"
        }
      );
      this.local_tracks[1].play(`user-${this.rtm_uid}`);
      await this.rtc_client?.publish([this.local_tracks[0], this.local_tracks[1]]);
      console.log("joined and pubished");
    }
    catch(err){
      this.current_user_joined_streem=false;
      console.warn("error in joinStream ..." + err);
    }
  };

  getTrack(i:any){
    let track;
    if (i == this.rtm_uid){
      track = this.local_tracks[1];
      if (this.local_screen_tracks){
        track = this.local_screen_tracks;
      }
    }
    else{
      let o = this.rtc_client?.remoteUsers.find((value) => {
        return (value.uid == i);
      });
      track = o?.videoTrack;
    }
    return track;
  }

  minimizeScreen(u:any){
    let isUserExistsInStream_users:boolean = this.stream_users?this.stream_users.some((obj)=>obj == this.current_stream_user):false;
    this.current_stream_user= null;
    if(!isUserExistsInStream_users)
    {
      this.stream_users.push(u);
      let track_stream = this.local_tracks;
      track_stream = this.getTrack(u);
      setTimeout(() => {
        track_stream.play(`user-${u}`);
      })
    }
  };
  maximizeStreamUserScreen(u:any){
    let track_stream = this.local_tracks;
    let track_box = this.local_screen_tracks;
    track_stream = this.getTrack(u);
    track_stream.stop();
    let x = this.current_stream_user;
    this.current_stream_user = u;
    let index = this.stream_users.indexOf(u);
    if (index != - 1){
      this.stream_users.splice(index,1);
    }
    if (x != null) {
      track_box = this.getTrack(x);
      track_box.stop();
      this.stream_users.push(x);
    }
    setTimeout(() => {
      if (x != null)
        track_box.play(`user-${x}`);
      track_stream.play(`user-${u}`);
    })
  };

  toggleParticipants(){
    this.show_participants = !this.show_participants;
  };
  toggleMessages(){
    this.show_messages = !this.show_messages;
  }

  async leaveStream (){
    console.log("leaving stream.... started");
    if(!this.current_user_joined_streem)
      return;
    try{
      this.sharing_screen = false;
      if (this.current_stream_user == this.rtm_uid)
        this.current_stream_user = null;
      for (let i = 0; this.local_tracks.length > i; i++) {
        this.local_tracks[i].stop();
        this.local_tracks[i].close();
      }
      let ind = this.stream_users.indexOf(this.rtm_uid);
      if (ind != -1){
        this.stream_users.splice(ind,1);
      }
      await this.rtc_client?.unpublish([this.local_tracks[0], this.local_tracks[1]]);
      if (this.local_screen_tracks) {
        this.local_screen_tracks.stop();
        this.local_screen_tracks.close();
        await this.rtc_client?.unpublish([this.local_screen_tracks]);
      }
      console.log('leaving stream ... ended');
    }
    catch(er){
      console.log('error in leaving stream' + er);
      console.log(er);
    }
  };

  leaveChannel() {
    if(!this.current_user_joined_streem)
      return;
    console.log("leaving channel.... started");
    try{
      this.rtc_client?.leave();
      this.rtc_channel.leave();
      this.rtm_client.logout();
      this.rtm_client=null;
      this.rtc_client=null;
      this.rtc_channel=null;
      this.sendLeavingMessage();
      console.log("leaving channel.... ended");
      return true;
    }
    catch(er){
      console.log('error in leaving channel' + er);
      return false;
    }
  };

  async toggleMic(){
    if (this.local_tracks[0].muted) {
      await this.local_tracks[0].setMuted(false);
      this.mic_btn_class="active";
      if(this.current_vcParticipant !=null)
      {
        this.current_vcParticipant.mic_on=true;
        //this.current_vcParticipant.camera_on=false;
        //this.current_vcParticipant.screen_share_on=false;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .subscribe((result: any) => {
              console.warn(result);
              console.log("success", "user updated succesfully");
            }, error=> {
              this.showMessage("error", error);
            });
          }
          catch(er){
            this.showMessage("error", er);
          }
      }
    } else {
      await this.local_tracks[0].setMuted(true);
      this.mic_btn_class="notactive";
      if(this.current_vcParticipant !=null)
      {
        this.current_vcParticipant.mic_on=false;
        //this.current_vcParticipant.camera_on=false;
        //this.current_vcParticipant.screen_share_on=false;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .subscribe((result: any) => {
              console.warn(result);
              console.log("success", "user updated succesfully");
            }, error=> {
              this.showMessage("error", error);
            });
          }
          catch(er){
            this.showMessage("error", er);
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
        //this.current_vcParticipant.mic_on=false;
        this.current_vcParticipant.camera_on=true;
        this.current_vcParticipant.screen_share_on=false;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .subscribe((result: any) => {
              console.warn(result);
              console.log("success", "user updated succesfully");
            }, error=> {
              this.showMessage("error", error);
            });
          }
          catch(er){
            this.showMessage("error", er);
          }
      }
    } else {
      await this.local_tracks[1].setMuted(true);
      this.camera_btn_class="notactive";
      if(this.current_vcParticipant !=null)
      {
        //this.current_vcParticipant.mic_on=false;
        this.current_vcParticipant.camera_on=false;
        this.current_vcParticipant.screen_share_on=false;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .subscribe((result: any) => {
              console.warn(result);
              console.log("success", "user updated succesfully");
            }, error=> {
              this.showMessage("error", error);
            });
          }
          catch(er){
            this.showMessage("error", er);
          }
      }
    }
  };
  async toggleScreen(){
    if (this.sharing_screen == false) {
      this.sharing_screen = true;
      this.screen_btn_class="active";
      this.camera_btn_class="notactive";
      this.camera_btn_display="none";
      this.local_screen_tracks = await AgoraRTC.createScreenVideoTrack(
        {
          encoderConfig: "720p_3",
          optimizationMode: "detail"
        }
      );
      this.local_tracks[1].stop();
      this.local_screen_tracks.play(`user-${this.rtm_uid}`,{fit: "contain"});
      await this.rtc_client?.unpublish([this.local_tracks[1]]);
      await this.rtc_client?.publish([this.local_screen_tracks]);if(this.current_vcParticipant !=null)
      {
        //this.current_vcParticipant.mic_on=false;
        this.current_vcParticipant.camera_on=false;
        this.current_vcParticipant.screen_share_on=true;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .subscribe((result: any) => {
              console.warn(result);
              console.log("success", "user updated succesfully");
            }, error=> {
              this.showMessage("error", error);
            });
          }
          catch(er){
            this.showMessage("error", er);
          }
      }
    } else {
      this.sharing_screen = false;
      this.screen_btn_class="notactive";
      this.camera_btn_class="active";
      this.camera_btn_display="block";
      this.local_screen_tracks.stop();
      this.local_screen_tracks.close();
      this.local_tracks[1].play(`user-${this.rtm_uid}`);
      await this.rtc_client?.unpublish([this.local_screen_tracks]);
      await this.rtc_client?.publish([this.local_tracks[1]]);
      this.local_screen_tracks = null;if(this.current_vcParticipant !=null)
      {
        //this.current_vcParticipant.mic_on=false;
        this.current_vcParticipant.camera_on=true;
        this.current_vcParticipant.screen_share_on=false;
        try{
          this.videoConferenceService
            .updateSessionParticipant(this.lsessionid, this.current_vcParticipant.id, this.current_vcParticipant)
            .subscribe((result: any) => {
              console.warn(result);
              console.log("success", "user updated succesfully");
            }, error=> {
              this.showMessage("error", error);
            });
          }
          catch(er){
            this.showMessage("error", er);
          }
      }
    }
  }
  async EndSession(){
    if(!this.is_current_user_owner) return;
    console.log("start ... End Session");
    try{
      await this.leaveStream();
      console.log("leaving Stream ... End Session");
      await this.leaveChannel();
      console.log("leaving channel ... End Session");
      let ending_message='has Ended the session at ' + new Date().toDateString();
      this.current_user_joined_streem=false;
      this.current_lsession_is_ended =true;
      this.current_lsession.is_ended=true;
      this.current_lsession.ended_at=new Date();
      await this.sendLeavingMessage(ending_message);
      await this.videoConferenceService.endVideoConferenceById(this.current_lsession.id, this.current_lsession, this.sessionParticipants, this.sessionParticipantsWaitlist);
      console.log(" End Session ... Done ...");
      //this.location.back();
    return true;
    }
    catch(err){
      console.log('error in End Session:'  + err);
    }
  }
  async LeaveSession(){
    if(!this.current_user_joined_streem) return;
    if(this.is_current_user_owner) return;
    console.log("start ... Leave Session");
    try{
      await this.leaveStream();
      console.log("leaving Stream ... Leave Session");
      await this.leaveChannel();
      console.log("leaving channel ... Leave Session");
      let leaving_message='has Left the session at' + new Date().toDateString();
      await this.sendLeavingMessage(leaving_message);
      this.current_vcParticipant.camera_on=false;
      this.current_vcParticipant.mic_on=false;
      this.current_vcParticipant.screen_share_on=false;
      this.current_vcParticipant.is_online=false;
      this.current_vcParticipant.leaved_at=new Date();
      await this.videoConferenceService.updateSessionParticipant(this.current_lsession.id, this.current_vcParticipant.id, this.current_vcParticipant);
      this.current_user_joined_streem=false;
    return true;
    }
    catch(err){
      console.log('error in Leave Session:'  + err);
    }
  }
  async goBack(){
    console.log("back .... ");
    try{
      await this.LeaveSession();
      this.location.back();
    }
    catch(err){
      console.log(err);
    }
  }

}
