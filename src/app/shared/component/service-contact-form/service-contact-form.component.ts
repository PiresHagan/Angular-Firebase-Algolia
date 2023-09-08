import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { ServiceService } from 'src/app/shared/services/service.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { GetInTouchService } from 'src/app/shared/services/getInTouch.service';
import { TranslateService } from '@ngx-translate/core';
import { LeadType } from 'src/app/shared/interfaces/lead.type';
import { Clipboard } from '@angular/cdk/clipboard';
import { error } from 'console';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-service-contact-form',
  templateUrl: './service-contact-form.component.html',
  styleUrls: ['./service-contact-form.component.scss']
})
export class ServiceContactFormComponent implements OnInit {

  @Input() serviceId!: string;
  @Input() meeting_settings: any;

  addLeadForm: FormGroup;
  addLeadMeetingForm: FormGroup;
  addLeadSuccess: boolean = false;
  isFormSaving: boolean = false;
  serviceLeadsMeetingsdata:any[];
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
  lmSession: any;
  timeZoneValue;
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
    private clipboard: Clipboard,
    public translate: TranslateService,
    private getInTouchService: GetInTouchService
  ) { }

  ngOnInit(): void {
    if(!this.serviceId)
      return;
    this.lmSession=null;
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
    this.getInTouchService.getServiceContactSessions(this.serviceId, null, null).subscribe((clmdata) => {
     if(clmdata && clmdata.sessionList && clmdata.sessionList.length>0){
       this.serviceLeadsMeetingsdata = clmdata.sessionList;
     }
   }, err => {
     this.isMeetingFormSaving = false;
   });
   const tempDate = new Date().toString();
   this.timeZoneValue = new Date().toString().slice(tempDate.lastIndexOf('GMT'), tempDate.length - 1);
  }

  submitForm() {
    this.isFormSaving = true;
    for (const i in this.addLeadForm.controls) {
      this.addLeadForm.controls[i].markAsDirty();
      this.addLeadForm.controls[i].updateValueAndValidity();
    }

    if (this.findInvalidControls().length == 0) {
      try {
        if (this.captchaToken) {
          this.invalidCaptcha = false;
          this.authService.validateCaptcha(this.captchaToken).pipe(take(1)).subscribe((success) => {
            window['grecaptcha'].reset(this.capchaObject);
            this.saveDataOnServer(this.addLeadForm.value);
          }, (error) => {
            window['grecaptcha'].reset(this.capchaObject);
            this.addLeadSuccess = false;
            this.isFormSaving = false;
          });
        } else {
          this.addLeadSuccess = false;
          this.isFormSaving = false;
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
    this.lmSession=null;
    const serviceContactData ={...formData, fullname:formData.first_name + ' ' + formData.last_name}
    let contactFoundData:LeadType = null;
    this.getInTouchService.getServiceContacts(this.serviceId).pipe(take(1)).subscribe(res=>{
      if(res && res.contactsList && res.contactsList.length>0){
        if(!contactFoundData)
          contactFoundData = res.contactsList.find(contact=> contact.email == formData.email);
      }
      else{
        contactFoundData = null;
      }
      if(contactFoundData){
        this.addLeadSuccess = true;
        this.isFormSaving = false;
        this.showModal(formData);
      }
      else{
        this.serviceService.createContact(this.serviceId, serviceContactData).then(data => {
          this.addLeadSuccess = true;
          this.isFormSaving = false;
          this.showModal(formData);
        }
        ).catch((error) => {
          this.addLeadSuccess = false;
            this.isFormSaving = false;
          });
        }
      }), error =>{
        this.addLeadSuccess = false;
        this.isFormSaving = false;
      };
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

  copyToClipboardWithParameter(elem: HTMLElement): void {
    let text: string='';
    if (elem.children){
      for (let j=0; j<elem.children.length; j++)
      {
        text += elem.children[j].textContent + '\n' || '';
      }
    }
    else{
      text = elem.textContent || '';
    }
    const successful = this.clipboard.copy(text);
  }

  renderReCaptcha() {
    if (!this.recaptchaElement || this.capchaObject)
      return;

      try{
        this.capchaObject = window['grecaptcha']?.render(this.recaptchaElement.nativeElement, {
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
      catch(err){

      }
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
    }
    this.disabledHours = () =>{
      var hours = [];
      const lsDate = new Date(this.sessionObject.date);
      let dayOflsDate = lsDate.getDay();
      let currentDate =  new Date();
      let hh=currentDate.getHours();
      if(currentDate.setHours(0,0,0,0) == lsDate.setHours(0,0,0,0)){
        for(var i =0; i < hh; i++){
            hours.push(i);
        }
      }
      else{
        hh =0;
      }
      /*for(var i=hh; i<24; i++){
        if(this.serviceLeadsMeetingsdata && this.serviceLeadsMeetingsdata.length>0){
          for(var j=0; j<this.serviceLeadsMeetingsdata.length; j++){
            let c = this.serviceLeadsMeetingsdata[j];
            const mDate = new Date(c.date);
            if(mDate.setHours(0,0,0,0) == lsDate.setHours(0,0,0,0)){
              let s1= new Date (c.start_time);
              let e1= new Date (c.end_time);
              if(i>=s1.getHours() && i<=e1.getHours() && !hours.includes(i)){
                hours.push(i);
              }
            }
          }
        }
      }*/
      if(dayOflsDate==0){
        if(this.meeting_settings.day0_startTime == null){
          for(var i=hh; i<24; i++){
            if(!hours.includes(i)){
              hours.push(i);
            }
          }
        }
        else{
          let sd1= new Date (this.meeting_settings.day0_startTime);
          let ed1= new Date (this.meeting_settings.day0_endTime);
          let sh1 = sd1.getHours();
          let sm1 = sd1.getMinutes();
          let eh1 = ed1.getHours();
          let em1 = ed1.getMinutes();
          for(var i=hh; i<24; i++){
            if((i>=sh1 && i<=eh1 && em1 != 0) || (i>=sh1 && i<eh1 && em1 == 0)){
            }
            else{
              if(!hours.includes(i)){
                hours.push(i);
              }
            }
          }
        }
      }
      else if(dayOflsDate==1){
        if(this.meeting_settings.day1_startTime == null){
          for(var i=hh; i<24; i++){
            if(!hours.includes(i)){
              hours.push(i);
            }
          }
        }
        else{
          let sd1= new Date (this.meeting_settings.day1_startTime);
          let ed1= new Date (this.meeting_settings.day1_endTime);
          let sh1 = sd1.getHours();
          let sm1 = sd1.getMinutes();
          let eh1 = ed1.getHours();
          let em1 = ed1.getMinutes();
          for(var i=hh; i<24; i++){
            if((i>=sh1 && i<=eh1 && em1 != 0) || (i>=sh1 && i<eh1 && em1 == 0)){
            }
            else{
              if(!hours.includes(i)){
                hours.push(i);
              }
            }
          }
        }
      }
      else if(dayOflsDate==2){
        if(this.meeting_settings.day2_startTime == null){
          for(var i=hh; i<24; i++){
            if(!hours.includes(i)){
              hours.push(i);
            }
          }
        }
        else{
          let sd1= new Date (this.meeting_settings.day2_startTime);
          let ed1= new Date (this.meeting_settings.day2_endTime);
          let sh1 = sd1.getHours();
          let sm1 = sd1.getMinutes();
          let eh1 = ed1.getHours();
          let em1 = ed1.getMinutes();
          for(var i=hh; i<24; i++){
            if((i>=sh1 && i<=eh1 && em1 != 0) || (i>=sh1 && i<eh1 && em1 == 0)){
            }
            else{
              if(!hours.includes(i)){
                hours.push(i);
              }
            }
          }
        }
      }
      else if(dayOflsDate==3){
        if(this.meeting_settings.day3_startTime == null){
          for(var i=hh; i<24; i++){
            if(!hours.includes(i)){
              hours.push(i);
            }
          }
        }
        else{
          let sd1= new Date (this.meeting_settings.day3_startTime);
          let ed1= new Date (this.meeting_settings.day3_endTime);
          let sh1 = sd1.getHours();
          let sm1 = sd1.getMinutes();
          let eh1 = ed1.getHours();
          let em1 = ed1.getMinutes();
          for(var i=hh; i<24; i++){
            if((i>=sh1 && i<=eh1 && em1 != 0) || (i>=sh1 && i<eh1 && em1 == 0)){
            }
            else{
              if(!hours.includes(i)){
                hours.push(i);
              }
            }
          }
        }
      }
      else if(dayOflsDate==4){
        if(this.meeting_settings.day4_startTime == null){
          for(var i=hh; i<24; i++){
            if(!hours.includes(i)){
              hours.push(i);
            }
          }
        }
        else{
          let sd1= new Date (this.meeting_settings.day4_startTime);
          let ed1= new Date (this.meeting_settings.day4_endTime);
          let sh1 = sd1.getHours();
          let sm1 = sd1.getMinutes();
          let eh1 = ed1.getHours();
          let em1 = ed1.getMinutes();
          for(var i=hh; i<24; i++){
            if((i>=sh1 && i<=eh1 && em1 != 0) || (i>=sh1 && i<eh1 && em1 == 0)){
            }
            else{
              if(!hours.includes(i)){
                hours.push(i);
              }
            }
          }
        }
      }
      else if(dayOflsDate==5){
        if(this.meeting_settings.day5_startTime == null){
          for(var i=hh; i<24; i++){
            if(!hours.includes(i)){
              hours.push(i);
            }
          }
        }
        else{
          let sd1= new Date (this.meeting_settings.day5_startTime);
          let ed1= new Date (this.meeting_settings.day5_endTime);
          let sh1 = sd1.getHours();
          let sm1 = sd1.getMinutes();
          let eh1 = ed1.getHours();
          let em1 = ed1.getMinutes();
          for(var i=hh; i<24; i++){
            if((i>=sh1 && i<=eh1 && em1 != 0) || (i>=sh1 && i<eh1 && em1 == 0)){
            }
            else{
              if(!hours.includes(i)){
                hours.push(i);
              }
            }
          }
        }
      }
      else if(dayOflsDate==6){
        if(this.meeting_settings.day6_startTime == null){
          for(var i=hh; i<24; i++){
            if(!hours.includes(i)){
              hours.push(i);
            }
          }
        }
        else{
          let sd1= new Date (this.meeting_settings.day6_startTime);
          let ed1= new Date (this.meeting_settings.day6_endTime);
          let sh1 = sd1.getHours();
          let sm1 = sd1.getMinutes();
          let eh1 = ed1.getHours();
          let em1 = ed1.getMinutes();
          for(var i=hh; i<24; i++){
            if((i>=sh1 && i<=eh1 && em1 != 0) || (i>=sh1 && i<eh1 && em1 == 0)){
            }
            else{
              if(!hours.includes(i)){
                hours.push(i);
              }
            }
          }
        }
      }
      return hours;
    }

    this.disabledMinutes = (hour) =>{
    var minutes= [];
    const lsDate = new Date(this.sessionObject.date);
    let currentDate =  new Date();
    let hh=currentDate.getHours();
    let mm = currentDate.getMinutes();
    if(currentDate.setHours(0,0,0,0) === lsDate.setHours(0,0,0,0)){
      if(hh==hour)
      {
        for(var i =0; i < mm; i++){
          minutes.push(i);
        }
      }
    }

    const lsDate_ = new Date(this.sessionObject.date);
    for(var i=hh; i<24; i++){
      if(this.serviceLeadsMeetingsdata && this.serviceLeadsMeetingsdata.length>0){
        for(var j=0; j<this.serviceLeadsMeetingsdata.length; j++){
          let c = this.serviceLeadsMeetingsdata[j];
          const mDate = new Date(c.date);
          const lsDate_1 = new Date(lsDate_);
          if(mDate.setHours(0,0,0,0) == lsDate_1.setHours(0,0,0,0)){
            let s1= new Date (c.start_time);
            let e1= new Date (c.end_time);
            if(i==s1.getHours()){
              for(var i = s1.getMinutes(); i <= e1.getMinutes(); i++){
                minutes.push(i);
              }
            }
          }
        }
      }
    }
    return minutes;
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
    let start_time_value:Date = new Date(result);
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
    this.sessionObject = {
      lead_email: data.email,
      lead_first_name: data.first_name,
      lead_last_name: data.last_name,
      email:data.email,
      date: null,
      duration: null,
      start_time: null,
      end_time: null
    };
    this.lmSession=null;
    this.getInTouchService.getServiceContactSessions(this.serviceId, null, data.email).pipe(take(1)).subscribe((clmdata) => {
      if(clmdata && clmdata.sessionList && clmdata.sessionList.length>0){
        this.lmSession = clmdata.sessionList[0];
        this.lmSession.link = 'video-conference/' + this.lmSession.id;
        this.showCreateMeetingDialog=true;
        this.isVisible = true;
      }
      else{
        this.addLeadMeetingFormInit(data);
        this.showCreateMeetingDialog=true;
        this.isVisible = true;
      }
    }, err => {
      this.showCreateMeetingDialog=true;
      this.isVisible = true;
      this.addLeadMeetingFormInit(data);
    });
  }
  handleOk(): void {
    this.isOkLoading = true;
    this.isMeetingFormSaving = true;
    this.submitAddLeadMeetingForm();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isOkLoading = false;
    this.showCreateMeetingDialog=false;
    this.isMeetingFormSaving = false;
    this.lmSession=null;
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
    this.addLeadForm.reset();
    this.addLeadForm = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      mobile_number: [null, [Validators.required]]
    });
    if(this.addLeadMeetingForm)
      this.addLeadMeetingForm.reset();
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

  saveMeetingDataOnServer(meetingData) {
    if(!this.isMeetingFormSaving) return;
    meetingData.name = this.translate.instant('ServiceLeadMeetingName') + ' ' + meetingData.lead_first_name;
    meetingData.link = location.origin + '/video-conference';
    meetingData.description = meetingData.lead_first_name + ' ' + this.translate.instant('ServiceLeadMeetingDescription');
    this.getInTouchService.addSessionForServiceContact(this.serviceId, meetingData).then(data => {
      this.addLeadMeetingSuccess = true;
      this.addLeadMeetingSuccess = false;
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
      this.getInTouchService.getServiceContactSessions(this.serviceId, null, meetingData.email).pipe(take(1)).subscribe((clmdata) => {
        if(clmdata && clmdata.sessionList && clmdata.sessionList.length>0){
          this.lmSession = clmdata.sessionList[0];
          if(!this.lmSession.link)
            this.lmSession.link = 'video-conference/' + this.lmSession.id;
          this.showCreateMeetingDialog=true;
          this.isVisible = true;
        }
        this.isMeetingFormSaving = false;
      }, err => {
        this.isMeetingFormSaving = false;
      });
    }).catch((error) => {
      this.isMeetingFormSaving = false;
    });
  }

}
