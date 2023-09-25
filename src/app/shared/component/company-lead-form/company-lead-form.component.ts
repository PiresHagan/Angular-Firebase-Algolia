import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { CompanyService } from 'src/app/shared/services/company.service';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { GetInTouchService } from 'src/app/shared/services/getInTouch.service';
import { TranslateService } from '@ngx-translate/core';
import { LeadType } from 'src/app/shared/interfaces/lead.type';
import { Clipboard } from '@angular/cdk/clipboard';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-company-lead-form',
  templateUrl: './company-lead-form.component.html',
  styleUrls: ['./company-lead-form.component.scss']
})
export class CompanyLeadFormComponent implements OnInit {

  @Input() companyId: string;
  @Input() meeting_settings: any;

  addLeadForm: FormGroup;
  addLeadMeetingForm: FormGroup;
  addLeadSuccess: boolean = false;
  isFormSaving: boolean = false;
  companyLeadsMeetingsdata:any[];
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
    let disabledHours_ =this.disabledHours();
    if(disabledHours_.length==24){
      for(var i =0; i < 59; i++){
        minutes.push(i);
      }
    }
    else{
      if(hh==hour)
      {
        if(disabledHours_.find(h=>h==hour)){
          for(var i =0; i < 59; i++){
            minutes.push(i);
          }
        }
        else{
          for(var i =0; i < mm; i++){
            minutes.push(i);
          }
        }
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

  @ViewChild('recaptcha') set SetThing(e: CompanyLeadFormComponent) {
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
    public translate: TranslateService,
    private companyService: CompanyService,
    private clipboard: Clipboard,
    private getInTouchService: GetInTouchService
  ) { }

  ngOnInit(): void {
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
     this.getInTouchService.getCompanyLeadSessions(this.companyId, null, null).subscribe((clmdata) => {
      if(clmdata && clmdata.sessionList && clmdata.sessionList.length>0){
        this.companyLeadsMeetingsdata = clmdata.sessionList;
      }
    }, err => {
      this.isMeetingFormSaving = false;
    });
    const tempDate = new Date().toString();
    this.timeZoneValue = new Date().toString().slice(tempDate.lastIndexOf('GMT')-1, tempDate.length);
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
            this.saveDataOnServer(this.addLeadForm.value);
            window['grecaptcha'].reset(this.capchaObject);
          }, (error) => {
            window['grecaptcha'].reset(this.capchaObject);
            this.isFormSaving = false;
            this.invalidCaptcha = true;
          });
        } else {
          this.isFormSaving = false;
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
    let leadFoundData:LeadType = null;
    this.lmSession=null;
    if(!this.isFormSaving) return;
    this.getInTouchService.getCompanyLeads(this.companyId).pipe(take(1)).subscribe(res=>{
      if(res && res.monthlyLeadsList && res.monthlyLeadsList.length>0){
        const monthlyLeadsList_length = res.monthlyLeadsList.length;
        let counter = 0;
        res.monthlyLeadsList.forEach(monthlyLead => {
          counter++;
          if(!leadFoundData){
            this.getInTouchService.getCompanyLeadsOfMonth(this.companyId, monthlyLead.id).pipe(take(1)).subscribe((leadsData) => {
              if(leadsData && leadsData.leadsList && leadsData.leadsList.length>0){
                if(!leadFoundData)
                  leadFoundData = leadsData.leadsList.find(lead=> lead.email == formData.email);
              }
              else{
              }
              if(leadFoundData){
                this.addLeadSuccess = true;
                this.isFormSaving = false;
                this.showModal(formData);
              }
              else{
                if(counter == monthlyLeadsList_length){
                  this.companyService.createCompanyLead(this.companyId, formData).then(data => {
                    this.addLeadSuccess = true;
                    this.isFormSaving = false;
                    this.showModal(formData);
                  })
                  .catch((error) => {
                      this.addLeadSuccess = false;
                      this.isFormSaving = false;
                  });
                }
              }
            }, error => {
              this.addLeadSuccess = false;
              this.isFormSaving = false;
            });
          }
        });
      }
      else{
        this.companyService.createCompanyLead(this.companyId, formData).then(data => {
          this.addLeadSuccess = true;
          this.isFormSaving = false;
          this.showModal(formData);
        })
        .catch((error) => {
            this.addLeadSuccess = false;
            this.isFormSaving = false;
        });
      }
    }), error =>{
      console.log('res.monthlyLeadsList error: ', error)
      this.addLeadSuccess = false;
      this.isFormSaving = false;
    }
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
    catch (err){

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
      this.sessionObject.date=result;
    }

    this.disabledHours = () =>{
      var hours = [];
      const lsDate = new Date(this.sessionObject.date);
      let dayOflsDate = lsDate.getDay();
      let currentDate =  new Date();
      let hh=currentDate.getHours();
      if(!this.meeting_settings){
        for(var i =0; i < 23; i++){
          hours.push(i);
        }
        return hours;
      }
      if(currentDate.setHours(0,0,0,0) == lsDate.setHours(0,0,0,0)){
        for(var i =0; i < hh; i++){
            hours.push(i);
        }
      }
      else{
        hh =0;
      }
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
    let lsDate = new Date(this.sessionObject.date);
    let currentDate =  new Date();
    let hh=currentDate.getHours();
    let mm = currentDate.getMinutes();
    let disabledHours_ =this.disabledHours();
    if(disabledHours_.length==24){
      for(var i =0; i < 59; i++){
        minutes.push(i);
      }
      return minutes;
    }
    if(disabledHours_.find(h=>h==hour)){
      for(var i =0; i < 59; i++){
        minutes.push(i);
      }
    }
    if(currentDate.setHours(0,0,0,0) === lsDate.setHours(0,0,0,0)){
      if(hh==hour)
      {
        for(var i =0; i < mm; i++){
          minutes.push(i);
        }
      }
    }
    const lsDate_ = new Date(this.sessionObject.date);
      if(this.companyLeadsMeetingsdata && this.companyLeadsMeetingsdata.length>0){
        for(var j=0; j<this.companyLeadsMeetingsdata.length; j++){
          let c = this.companyLeadsMeetingsdata[j];
          const mDate = new Date(c.date);
          const lsDate_1 = new Date(lsDate_);
          if(mDate.setHours(0,0,0,0) == lsDate_1.setHours(0,0,0,0)){
            let s1= new Date (c.start_time);
            let e1= new Date (c.end_time);
           if(s1.getHours() == hour){
            for(var i = s1.getMinutes(); i <= e1.getMinutes(); i++){
              minutes.push(i);
            }
           }
          }
        }
      }
    return minutes;
    }
    if(this.sessionObject.start_time !=null && result != null){
      let start_time_value_:Date = new Date(this.sessionObject.start_time);
      let start_time_value_with_date:Date = new Date(result);
      if(start_time_value_.getFullYear() != start_time_value_with_date.getFullYear() ||
        start_time_value_.getMonth() != start_time_value_with_date.getMonth() ||
        start_time_value_.getDay() != start_time_value_with_date.getDay()){
          start_time_value_with_date.setHours(start_time_value_.getHours());
          start_time_value_with_date.setMinutes(start_time_value_.getMinutes());
          start_time_value_with_date.setSeconds(0);
          start_time_value_with_date.setMilliseconds(0);
          this.sessionObject.start_time=start_time_value_with_date;
          this.addLeadMeetingForm.controls['start_time'].setValue(start_time_value_with_date);
      }
    }
  }
  showError(errorMessage) {
    const msg = this.translate.instant(errorMessage);
    this.modalService.error({
      nzTitle: "<i>" + msg + "</i>",
    });
  }
  showWarningMessage(message) {
    let $message = this.translate.instant(message);
    this.modalService.warning({
      nzTitle: $message,
    });
  }
  startTimeChanged(result: Date){
    try{
      let start_time_value:Date = new Date(result);
      if(result==null || start_time_value ==null){
        this.sessionObject.end_time=null;
        this.addLeadMeetingForm.controls['end_time'].setValue(null);
        return;
      }
      if(this.sessionObject.date !=null){
        let start_time_value_:Date = new Date(start_time_value);
        let start_time_value_with_date:Date = new Date(this.sessionObject.date);
        if(start_time_value_.getFullYear() != start_time_value_with_date.getFullYear() ||
          start_time_value_.getMonth() != start_time_value_with_date.getMonth() ||
          start_time_value_.getDay() != start_time_value_with_date.getDay()){
            start_time_value_with_date.setHours(start_time_value_.getHours());
            start_time_value_with_date.setMinutes(start_time_value_.getMinutes());
            start_time_value_with_date.setSeconds(0);
            start_time_value_with_date.setMilliseconds(0);
            this.sessionObject.start_time=start_time_value_with_date;
            this.addLeadMeetingForm.controls['start_time'].setValue(start_time_value_with_date);
          }
      }
      start_time_value = this.checkStartDate(start_time_value);
      if(!start_time_value || start_time_value == null)
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
      this.sessionObject.start_time=null;
      this.addLeadMeetingForm.controls['start_time'].setValue(null);
      this.sessionObject.end_time=null;
      this.addLeadMeetingForm.controls['end_time'].setValue(null);
    }
  }

  durationChanged(result: number){
    try{
      this.sessionObject.duration=result;
      let start_time_value:Date = new Date(this.sessionObject.start_time);
      if(start_time_value==null){
        this.sessionObject.end_time=null;
        this.addLeadMeetingForm.controls['end_time'].setValue(null);
        return;
      }
      let duration_value =+ result;
      start_time_value = this.checkStartDate(start_time_value);
      if(!start_time_value || start_time_value == null)
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

  checkStartDate(result:Date):Date{
    let start_time_value:Date = new Date(result);
      let hh=start_time_value.getHours();
      let mm = start_time_value.getMinutes();
      let disabledHours_ = this.disabledHours();
      let disabledMinutes_= this.disabledMinutes(hh);
      if(hh<0 || hh>23 || mm<0 || mm>59 || start_time_value == null || disabledHours_.find(h=>h==hh) || disabledMinutes_.find(m=>m==mm))
      {
        this.sessionObject.start_time=null;
        this.addLeadMeetingForm.controls['start_time'].setValue(null);
        this.sessionObject.end_time=null;
        this.addLeadMeetingForm.controls['end_time'].setValue(null);
        return null;
      }
      else{
        if(mm >0 && mm <15 ){
          start_time_value.setMinutes(0);
          this.sessionObject.start_time=start_time_value;
          this.addLeadMeetingForm.controls['start_time'].setValue(start_time_value);
        }
        else if(mm >15 && mm <30 ){
          start_time_value.setMinutes(15);
          this.sessionObject.start_time=start_time_value;
          this.addLeadMeetingForm.controls['start_time'].setValue(start_time_value);
        }
        else if(mm >30 && mm <45 ){
          start_time_value.setMinutes(30);
          this.sessionObject.start_time=start_time_value;
          this.addLeadMeetingForm.controls['start_time'].setValue(start_time_value);
        }
        else if(mm >45 && mm <59 ){
          start_time_value.setMinutes(45);
          this.sessionObject.start_time=start_time_value;
          this.addLeadMeetingForm.controls['start_time'].setValue(start_time_value);
        }
        let ss = start_time_value.getSeconds();
        if(ss!=0){
          start_time_value.setSeconds(0);
          start_time_value.setMilliseconds(0);
          this.sessionObject.start_time=start_time_value;
          this.addLeadMeetingForm.controls['start_time'].setValue(start_time_value);
        }
        return start_time_value;
      }
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
    this.getInTouchService.getCompanyLeadSessions(this.companyId, null, data.email).subscribe((clmdata) => {
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
    meetingData.name = this.translate.instant('CompanyLeadMeetingName') + ' ' + meetingData.lead_first_name;
    meetingData.link = location.origin + '/video-conference';
    meetingData.description = meetingData.lead_first_name + ' ' + this.translate.instant('CompanyLeadMeetingDescription');
    this.getInTouchService.addSessionForCompanyLead(this.companyId, meetingData).then(data => {
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
      this.getInTouchService.getCompanyLeadSessions(this.companyId, null, meetingData.lead_email).pipe(take(1)).subscribe((clmdata) => {
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
