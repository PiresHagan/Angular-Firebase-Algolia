import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { VideoConferenceService } from 'src/app/shared/services/video-conference.service'

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-live-sessions',
  templateUrl: './live-sessions.component.html',
  styleUrls: ['./live-sessions.component.scss']
})
export class LiveSessionsComponent implements OnInit {
  vcLiveSessionsData: any[];
  lastVisible: any = null;
  sessionLoading: boolean;
  loadingMore: boolean;;


  searchForm: FormGroup;
  searchresValue: string='';
  searchfield: any = 'name';
  isSearch: boolean = false;

  constructor(
    private translate: TranslateService,
    private videoConferenceService: VideoConferenceService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true);
    this.getLiveSessions();
    this.searchForm = this.fb.group({
      liveSessionssearchform: "",
    });
  }

  getLiveSessions (){
    this.videoConferenceService.getLiveSessions().subscribe((data) => {
      const today=new Date();
      this.vcLiveSessionsData = data.sessionList.filter((item)=>{
        let end_time_ = new Date(item.end_time);
        if(this.isSearch){
          let name_:string = item.name;
          let description_:string = item.description;
          if(end_time_ >= today && (name_.includes(this.searchresValue) || description_.includes(this.searchresValue))){
            return item;
          }
        }
        else{
          if(end_time_ >= today){
            return item;
          }
        }
      });
      this.lastVisible = data.lastVisible;
      this.sessionLoading = false;
    });
  }
  getsearchfield(searchfield:any){
    this.searchfield = searchfield;
  }
  getsearchres(searchres:any){
    this.searchresValue = searchres;
  }

  isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
  }

  liveSessionssearch(){
    if(this.isEmptyOrSpaces(this.searchresValue)){
      this.resetSearch();
      return;
    }
    this.isSearch=true;
    this.getLiveSessions();
  }

  liveSessionssearchFromDb(){
    if(this.isEmptyOrSpaces(this.searchresValue)){
      this.resetSearch();
      return;
    }
    this.isSearch=false
    this.sessionLoading = true;
    this.videoConferenceService.searchLiveSessions(10, 'first',this.lastVisible, this.searchresValue,this.searchfield).subscribe((data) => {
      this.vcLiveSessionsData = data.sessionList;
      this.lastVisible = data.lastVisible;
      this.sessionLoading = false;
      this.isSearch=true
    });
  }

  resetSearch(){
    this.searchresValue='';
    this.searchForm.reset();
    this.searchForm = this.fb.group({
      liveSessionssearchform: "",
    });
    this.isSearch=false;
    this.getLiveSessions();
  }


  scrollEvent = (event: any): void => {
    const today = new Date();
    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.videoConferenceService.getLiveSessions(null, 'next', this.lastVisible).subscribe((data) => {
          if (data &&
            data.sessionList &&
            data.sessionList[0]
            && data.sessionList.length > 1)
            {
              this.loadingMore = false;
              let vcLiveSessionsDataNew = data.sessionList.filter((item)=>{
                let end_time_ = new Date(item.end_time);
                if(this.isSearch){
                  let name_:string = item.name;
                  let description_:string = item.description;
                  if(end_time_ >= today && (name_.includes(this.searchresValue) || description_.includes(this.searchresValue))){
                    return item;
                  }
                }
                else{
                  if(end_time_ >= today){
                    return item;
                  }
                }
              });
              this.vcLiveSessionsData = [...this.vcLiveSessionsData, ...vcLiveSessionsDataNew];
              this.lastVisible = data.lastVisible;
              this.sessionLoading = false;
            }
        });
      }
    }
  }
}
