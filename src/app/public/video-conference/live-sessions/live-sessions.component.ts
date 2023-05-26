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
  vcLiveSessionsData: any;
  lastVisible: any = null;
  sessionLoading: boolean;
  loadingMore: boolean;;
  
  
  searchForm: FormGroup;
  searchres: any;
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
      this.vcLiveSessionsData = data.sessionList;
      this.lastVisible = data.lastVisible;
      this.sessionLoading = false;
    }); 
  }
  getsearchfield(searchfield:any){
    this.searchfield = searchfield;
  }
  getsearchres(searchres:any){
    this.searchres = searchres;
  }
  

  isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
  }

  liveSessionssearch(){
    if(this.isEmptyOrSpaces(this.searchres)){
      this.resetSearch();
      return;
    }
    this.sessionLoading = true;
    this.videoConferenceService.searchLiveSessions(10, 'first',this.lastVisible, this.searchres,this.searchfield).subscribe((data) => {
      this.vcLiveSessionsData = data.sessionList;
      this.lastVisible = data.lastVisible;
      this.sessionLoading = false;
      this.isSearch=true
    });
  }

  resetSearch(){
    this.searchForm.reset();
    this.getLiveSessions();
  }
  

  scrollEvent = (event: any): void => {
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
              this.vcLiveSessionsData = [...this.vcLiveSessionsData, ...data.sessionList];
              this.lastVisible = data.lastVisible;
              this.sessionLoading = false;
            }
        });
      }
    }

  }
}
