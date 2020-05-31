import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    isFormSaving: boolean = false;

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
                life: [null],
                business: [null],
                news: [null],
                sport: [null],
                religion: [null],
                creative: [null],
                opinion: [null],
                tech: [null],
                ent: [null],
                later: [null]

            }
        );

        this.userService.getCurrentUser().then((user) => {
            this.currentUser = user;
            this.userService.get(user.uid).subscribe((userDetails) => {
                this.setIntrestValueInForm(userDetails.interests)
            })
        })


    }

    setIntrestValueInForm(interests) {
        let intrestList = this.notificationConfigList;
        for (let index = 0; index < intrestList.length; index++) {
            const intrest = intrestList[index];
            if (interests && interests.includes(intrest.id)) {
                intrestList[index].status = true;
            }
        }

        this.notificationConfigList = intrestList;
    }

    submitForm(): void {
        this.isFormSaving = true;
        let interests = []
        for (const i in this.interestForm.controls) {
            this.interestForm.controls[i].markAsDirty();
            this.interestForm.controls[i].updateValueAndValidity();
            if (this.interestForm.controls[i].value) interests.push(i);
        }
        this.userService.update(this.currentUser.uid, { interests }).then(() => {
            this.isFormSaving = false;
            this.router.navigate(['/auth/import-contact']);
        });


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



}
