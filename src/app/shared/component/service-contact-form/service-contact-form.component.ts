import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { ServiceService } from 'src/app/shared/services/service.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { GetInTouchService } from 'src/app/shared/services/getInTouch.service';

@Component({
  selector: 'app-service-contact-form',
  templateUrl: './service-contact-form.component.html',
  styleUrls: ['./service-contact-form.component.scss']
})
export class ServiceContactFormComponent implements OnInit {

  @Input() serviceId!: string;

  addLeadForm: FormGroup;
  addLeadMeetingForm: FormGroup;
  addLeadSuccess: boolean = false;
  isFormSaving: boolean = false;

  recaptchaElement;
  isCaptchaElementReady: boolean = false;
  isCapchaScriptLoaded: boolean = false;
  captchaToken: string;
  capchaObject;
  invalidCaptcha: boolean = false;
  showCreateMeetingDialog: boolean = false;
  isVisible = false;
  isOkLoading = false;
  addLeadMeetingSuccess: boolean = false;
  isMeetingFormSaving: boolean = false;
  sessionObject:any=null;
  today =  new Date();
  defaultStartTimeOpenValue = new Date();
  disabledHours(): number[]{
    var hours = [];
    let currentDate =  new Date();
    let hh=currentDate.getHours();
    for(var i =0; i < hh; i++){
        hours.push(i);
    }
    return hours;
  }
  disabledMinutes(hour: number): number[] {
    var minutes= [];
    let currentDate =  new Date();
    let hh=currentDate.getHours();
    let mm = currentDate.getMinutes();
    if(hh==hour)
    {
      for(var i =0; i < mm; i++){
        minutes.push(i);
      }
    }
    return minutes;
  }
  disabledDate = (current: Date): boolean =>
    differenceInDays(current, this.today) < 0;
  freeSessionDurationList = [
      { text:"0 hr 15 min" ,value:15},
      { text:"0 hr 30 min" ,value:30},
      { text:"0 hr 40 min" ,value:40}
  ];

  @ViewChild('recaptcha') set SetThing(e: ServiceContactFormComponent) {
    this.isCaptchaElementReady = true;
    this.recaptchaElement = e;
    if (this.isCaptchaElementReady && this.isCapchaScriptLoaded) {
      this.renderReCaptcha();
    }
  }

  constructor(
    private modalService: NzModalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private getInTouchService: GetInTouchService
  ) { }

  ngOnInit(): void {
    if(!this.serviceId)
      return;
    this.addLeadForm = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      mobile_number: [null, [Validators.required]]
    });
    this.sessionObject = {
      lead_email: null,
      lead_first_name: null,
      lead_last_name: null,
      email:null,
      date: null,
      duration: null,
      start_time: null,
      end_time: null
    };
    this.addRecaptchaScript();

  }

  submitForm() {
    for (const i in this.addLeadForm.controls) {
      this.addLeadForm.controls[i].markAsDirty();
      this.addLeadForm.controls[i].updateValueAndValidity();
    }

    if (this.findInvalidControls().length == 0) {
      try {
        this.isFormSaving = true;
        this.invalidCaptcha = false;
        this.saveDataOnServer(this.addLeadForm.value);
        if (this.captchaToken) {
          this.isFormSaving = true;
          this.invalidCaptcha = false;
          this.authService.validateCaptcha(this.captchaToken).subscribe((success) => {
            this.saveDataOnServer(this.addLeadForm.value);
          }, (error) => {
            window['grecaptcha'].reset(this.capchaObject);
            this.isFormSaving = false;
            this.invalidCaptcha = true;
          });
        } else {
          this.invalidCaptcha = true;
        }
      } catch (err) {
        this.isFormSaving = false;
      }
    }
    else {
      this.isFormSaving = false;
    }
  }

  saveDataOnServer(formData) {
    const serviceContactData ={...formData, fullname:formData.first_name + ' ' + formData.last_name}
    this.serviceService.createContact(this.serviceId, serviceContactData).then(data => {
      this.addLeadForm.reset();
      this.addLeadSuccess = true;
      this.isFormSaving = false;
      this.showModal(formData);
      setTimeout(() => {
        this.addLeadSuccess = false;
      }, 5000);
      window['grecaptcha'].reset(this.capchaObject);
    }).catch((error) => {
      this.isFormSaving = false;
    });
  }

  addRecaptchaScript() {
    window['grecaptchaCallback'] = () => {
      this.isCapchaScriptLoaded = true;
      if (this.isCapchaScriptLoaded && this.isCaptchaElementReady)
        this.renderReCaptcha();
      return;
    }

    (function (d, s, id, obj) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        obj.isCapchaScriptLoaded = true;
        if (obj.isCapchaScriptLoaded && obj.isCaptchaElementReady)
          obj.renderReCaptcha(); return;
      }
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));
  }

  renderReCaptcha() {
    if (!this.recaptchaElement || this.capchaObject)
      return;

    this.capchaObject = window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey': environment.captchaKey,
      'callback': (response) => {
        this.invalidCaptcha = false;
        this.captchaToken = response;
      },
      'expired-callback': () => {
        this.captchaToken = '';
      }
    });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.addLeadForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  sheduleDateChanged(result: Date){
    let is_date_valid:boolean =differenceInMinutes(result, this.today) >= 0 ;
    if(!is_date_valid){
      let currentDate=new Date();
      let hh = currentDate.getHours();
      let mm = currentDate.getMinutes();
      if(mm>0 && mm<15)
      mm = 15;
      else if(mm>15 && mm<30)
      mm = 30;
      else if(mm>30 && mm<45)
      mm = 45;
      else if(mm>45 && mm<60)
       {
        hh = hh + 1;
        mm = 0;;
      }
      currentDate.setHours(hh);
      currentDate.setMinutes(mm);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
      this.sessionObject.date=currentDate;
      this.addLeadMeetingForm.controls['date'].setValue(currentDate);
      this.sessionObject.start_time=currentDate;
      this.addLeadMeetingForm.controls['start_time'].setValue(currentDate);
    }
    else{
      let hh = result.getHours();
      let mm = result.getMinutes();
      if(mm>0 && mm<15)
      mm = 15;
      else if(mm>15 && mm<30)
      mm = 30;
      else if(mm>30 && mm<45)
      mm = 45;
      else if(mm>45 && mm<60)
       {
        hh = hh + 1;
        mm = 0;;
      }
      result.setHours(hh);
      result.setMinutes(mm);
      result.setSeconds(0);
      result.setMilliseconds(0);
      result.setMinutes(0);
      result.setSeconds(0);
      result.setMilliseconds(0);
      this.sessionObject.date=result;
      this.sessionObject.start_time=result;
      this.addLeadMeetingForm.controls['start_time'].setValue(result);
    }
  }

  startTimeChanged(result: Date){
    try{
      let start_time_value:Date = result;
      if(!this.checkStartDate(start_time_value))
        return;
      this.sessionObject.start_time=start_time_value;
      let duration_value:number = +this.sessionObject.duration;
      if(duration_value == null || duration_value==0 || Number.isNaN(duration_value))
      {
        this.sessionObject.end_time=null;
        this.addLeadMeetingForm.controls['end_time'].setValue(null);
        return;
      }
      let end_time_value = new Date(start_time_value);
          end_time_value.setMinutes(end_time_value.getMinutes() + Number(duration_value));
          this.sessionObject.end_time=end_time_value;
          this.addLeadMeetingForm.controls['end_time'].setValue(end_time_value);
    }
    catch(err){
      this.sessionObject.end_time=null;
      this.addLeadMeetingForm.controls['end_time'].setValue(null);
    }
  }

  durationChanged(result: number){
    try{
      this.sessionObject.duration=result;
      let start_time_value:Date = this.sessionObject.start_time;
      if(start_time_value==null){
        this.sessionObject.end_time=null;
        this.addLeadMeetingForm.controls['end_time'].setValue(null);
        return;
      }
      let duration_value =+ result;

      if(!this.checkStartDate(start_time_value))
        return;
      if(duration_value!=null && !Number.isNaN(duration_value)){
        let end_time_value:Date = new Date(start_time_value);
        end_time_value.setMinutes(end_time_value.getMinutes() + duration_value);
        this.sessionObject.duration=duration_value;
        this.sessionObject.end_time=end_time_value;
        this.addLeadMeetingForm.controls['end_time'].setValue(end_time_value);
      }
      else{
        this.sessionObject.duration=null;
        this.sessionObject.end_time=null;
        this.addLeadMeetingForm.controls['end_time'].setValue(null);
      }
    }
    catch(err){
      this.sessionObject.duration=null;
      this.sessionObject.end_time=null;
      this.addLeadMeetingForm.controls['end_time'].setValue(null);
    }
  }

  checkStartDate(result:Date):boolean{
    let start_time_value:Date = result;
      let hh=start_time_value.getHours();
      let mm = start_time_value.getMinutes();
      if(hh>23 || mm>59 || start_time_value == null || this.disabledHours().find(h=>h==hh) || this.disabledMinutes(hh).find(m=>m==mm))
      {
        this.sessionObject.start_time=null;
        this.addLeadMeetingForm.controls['start_time'].setValue(null);
        this.sessionObject.end_time=null;
        this.addLeadMeetingForm.controls['end_time'].setValue(null);
        return false;
      }
      return true;
  }
  showModal(data:any): void {
    this.sessionObject.lead_email=data.email;
    this.sessionObject.lead_first_name=data.first_name;
    this.sessionObject.lead_last_name=data.last_name;
    this.sessionObject.email=data.email;
    this.showCreateMeetingDialog=true;
    this.isVisible = true;
    this.addLeadMeetingFormInit(data);
  }
  handleOk(): void {
    this.isOkLoading = true;
    this.submitAddLeadMeetingForm();
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.showCreateMeetingDialog=false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.showCreateMeetingDialog=false;
  }

  addLeadMeetingFormInit(data:any): void {
    this.addLeadMeetingForm = this.fb.group({
      lead_email: [this.sessionObject.email, [Validators.required]],
      lead_first_name: [this.sessionObject.lead_first_name, [Validators.required]],
      lead_last_name: [this.sessionObject.lead_last_name, [Validators.required]],
      date: [this.sessionObject.date, [Validators.required]],
      start_time: [this.sessionObject.start_time, [Validators.required]],
      end_time: [this.sessionObject.end_time, [Validators.required]],
      duration: [this.sessionObject.duration, [Validators.required]]
    });
  }

  public findInvalidLeadMeetingControls() {
    const invalid = [];
    const controls = this.addLeadMeetingForm.controls;

    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  submitAddLeadMeetingForm() {
    this.checkStartDate(this.sessionObject.start_time);
    for (const i in this.addLeadMeetingForm.controls) {
      this.addLeadMeetingForm.controls[i].markAsDirty();
      this.addLeadMeetingForm.controls[i].updateValueAndValidity();
    }
    if (this.findInvalidLeadMeetingControls().length == 0) {
      try {
        this.saveMeetingDataOnServer(this.addLeadMeetingForm.value);
      } catch (err) {
        this.isMeetingFormSaving = false;
      }
    }
    else {
      this.isMeetingFormSaving = false;
    }
  }

  saveMeetingDataOnServer(data) {
    this.getInTouchService.addSessionForServiceContact(this.serviceId, data).then(data => {
      this.addLeadMeetingSuccess = true;
      this.isMeetingFormSaving = false;
      setTimeout(() => {
        this.addLeadMeetingSuccess = false;
      }, 5000);
    }).catch((error) => {
      this.isMeetingFormSaving = false;
    });
  }

}
