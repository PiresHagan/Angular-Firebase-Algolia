import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { UserService } from '../../shared/services/user.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.css']
})
export class InterestComponent implements OnInit {

  interestForm: FormGroup;
  currentUser: any;

  notificationConfigList = [
    {
        id: "life",
        title: "Life and styles",
        desc: "Allow people found on your public.",
        icon: "user",
        color: "ant-avatar-blue",
        status: false
    },
    {
        id: "business",
        title: "Business",
        desc: "Allow any peole to contact.",
        icon: "mobile",
        color: "ant-avatar-cyan",
        status: false
    },
    {
        id: "news",
        title: "News",
        desc: "Turning on Location lets you explore what's around you.",
        icon: "environment",
        color: "ant-avatar-gold",
        status: false
    },
    {
        id: "sport",
        title: "Sport",
        desc: "Receive daily email notifications.",
        icon: "mail",
        color: "ant-avatar-purple",
        status: false
    },
    {
        id: "religion",
        title: "Religion",
        desc: "Allow all downloads from unknow source.",
        icon: "question",
        color: "ant-avatar-red",
        status: false
    },
    {
        id: "creative",
        title: "Creative",
        desc: "Allow data synchronize with cloud server",
        icon: "swap",
        color: "ant-avatar-green",
        status: false
    },
    {
        id: "opinion",
        title: "Opinion",
        desc: "Allow any groups invitation",
        icon: "usergroup-add",
        color: "ant-avatar-orange",
        status: false
    },
    {
        id: "tech",
        title: "Tech and science",
        desc: "Allow any groups invitation",
        icon: "usergroup-add",
        color: "ant-avatar-orange",
        status: false
    },
    {
        id: "ent",
        title: "Entertainement",
        desc: "Allow any groups invitation",
        icon: "usergroup-add",
        color: "ant-avatar-orange",
        status: false
    },
]

  constructor(private fb: FormBuilder, private router: Router, private modalService: NzModalService, private userService: UserService,
    ) { }

  async ngOnInit() {
    this.interestForm = this.fb.group(
        {
            life            : [ null ],
            business        : [ null ],
            news            : [ null ],
            sport           : [ null ],
            religion        : [ null ],
            creative        : [ null ],
            opinion         : [ null ],
            tech            : [ null ],
            ent             : [ null ],
            later           :  [null]

        }
    );

    await firebase.auth().onAuthStateChanged((user) => {
        console.log("currentUser", JSON.stringify(user));

        return new Promise(async resolve => {
          if (user != null) {
              this.currentUser = user;
              //console.log(this.currentUser);

              await this.userService.get(this.currentUser.uid).subscribe((data) => {
                //console.log("data", data.interests);
                if(data.interests){
                    for (var _i = 0; _i < data.interests.length; _i++) {
                        this.interestForm.controls[data.interests[_i]].setValue(data.interests[_i]);
                    }
                }
               
              });

              resolve();
            } else {
              this.router.navigate(['/login']);
            }
        });

      });
  }

  submitForm(): void {
    for (const i in this.interestForm.controls) {
        this.interestForm.controls[ i ].markAsDirty();
        this.interestForm.controls[ i ].updateValueAndValidity();
    }

    const interests = [];

    if(this.interestForm.get('life').value){
        interests.push("life");
    }
    if(this.interestForm.get('business').value){
        interests.push("business");
    }
    if(this.interestForm.get('news').value){
        interests.push("news");
    }
    if(this.interestForm.get('sport').value){
        interests.push("sport");
    }
    if(this.interestForm.get('religion').value){
        interests.push("religion");
    }
    if(this.interestForm.get('creative').value){
        interests.push("creative");
    }
    if(this.interestForm.get('tech').value){
        interests.push("tech");
    }
    if(this.interestForm.get('opinion').value){
        interests.push("opinion");
    }
    if(this.interestForm.get('tech').value){
        interests.push("ent");
    }
 
    const later = this.interestForm.get('ent').value;

    let fields: any = { 
        interests: interests, 
    };
    this.userService.update(this.currentUser.uid, fields).then(()=>{
        this.success();
    });
        //this.router.navigate(['/dashboard/default']);

}

updateConfirmValidator(): void {
    Promise.resolve().then(() => this.interestForm.controls.checkPassword.updateValueAndValidity());
}

confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
        return { required: true };
    } else if (control.value !== this.interestForm.controls.password.value) {
        return { confirm: true, error: true };
    }
}


  success(): void {
    this.modalService.success({
      nzTitle: 'Congratulations',
      nzContent: 'Well done! You are all set.',
      nzOnOk: () => this.router.navigate(['/dashboard/default'])
    });
  }
}
