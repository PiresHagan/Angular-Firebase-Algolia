import { Component, Input, OnInit } from '@angular/core';
import {VC_Message} from '../../../../shared/interfaces/video-conference-session.type';
import {AuthService} from 'src/app/shared/services/authentication.service';
import { Member } from 'src/app/shared/interfaces/member.type';
@Component({
  selector: 'app-session-message',
  templateUrl: './session-message.component.html',
  styleUrls: ['./session-message.component.scss']
})
export class SessionMessageComponent implements OnInit {
  @Input() message!:VC_Message;
  @Input() csessionid!:any;
  message_from_me: boolean=false;
  message_from_boot:boolean=false;
  loggedInUser: Member;
  constructor(
    private authService:AuthService,) { }

  ngOnInit(): void {
    if(this.message.from_user_id=="-1" && this.message.from_user_name=="boot"){
     this.message_from_boot = true;
    }
    else{
      this.authService.getAuthState().subscribe(async (user) => {
        if (!user)
          {
            let currSessionUserLS = localStorage.getItem(this.csessionid);
            if(currSessionUserLS){
              this.loggedInUser = JSON.parse(currSessionUserLS);
            }
          }
        else{
          this.loggedInUser = await this.authService.getLoggedInUserDetails();
          if(!this.loggedInUser){
            let currSessionUserLS = localStorage.getItem(this.csessionid);
            if(currSessionUserLS){
              this.loggedInUser = JSON.parse(currSessionUserLS);
            }
          }
          if(this.loggedInUser){
            if(this.message.from_user_id == this.loggedInUser.id){
              this.message_from_me =true;
            }
          }
        }
      });
    }
  }

}
