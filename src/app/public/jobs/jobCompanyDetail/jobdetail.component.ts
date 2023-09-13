import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { JobsService } from '../../../shared/services/jobs.service';
import { UserService } from '../../../shared/services/user.service';
import { Job } from '../../../shared/interfaces/job.type'; 
import { User } from '../../../shared/interfaces/user.type';

@Component({
  selector: 'app-jobDetail',
  templateUrl: './jobdetail.component.html',
  styleUrls: ['./jobdetail.component.scss']
})
export class JobDetailComponent implements OnInit {

  private jobDetailDocument = "jobdetail";
  selectedLanguage: string = "";
  job:Job;
  userDetail:User;
  


  constructor(
    public translate: TranslateService,
    private seoService: SeoService,
    private langService: LanguageService,
    private jobService: JobsService,
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.seoService.updateTagsWithData(this.jobDetailDocument);


    this.route.paramMap.subscribe(params => {
      this.selectedLanguage = this.langService.getSelectedLanguage();
      const id = params.get('id');
      this.jobService.getJobById(id).subscribe(data => {
        this.job = data[0];

        console.log("job data", this.job);
        this.userService.getMember(this.job?.owner?.id).subscribe((memberDetails) => {
          this.userDetail = memberDetails;

          console.log("user data", this.userDetail);
        })

        
      });      
    });
  }


  goBack(event: Event): void {
    event.preventDefault(); 
    this.location.back();
    this.location.back();
  }

  
}
