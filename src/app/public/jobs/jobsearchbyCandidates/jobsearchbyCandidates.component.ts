import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { JobsService } from '../../../shared/services/jobs.service';
import { Job } from '../../../shared/interfaces/job.type'; 
import * as algoliasearch from 'algoliasearch/lite';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/interfaces/user.type';


const searchClient = algoliasearch(
  environment.algolia.applicationId,
  environment.algolia.apiKey
);


@Component({
  selector: 'app-jobsearchbyCandidates',
  templateUrl: './jobsearchbyCandidates.component.html',
  styleUrls: ['./jobsearchbyCandidates.component.scss']
})
export class jobsearchbyCandidatesComponent implements OnInit {

  config = {
    indexName: environment.algolia.index.vacancies,
    searchClient,
    routing: true
  };
  loading: boolean = true;
  selectedLanguage: string = "";
  private jobsearchbyCandidatesDocument = "jobs";
  public jobs: Job[]; 
  checkUserLogin: boolean = false;
  userDetails;

  private jobDetailDocument = "jobdetail";
  job:Job;
  userDetail:User;


  
  constructor(
    public translate: TranslateService,
    private seoService: SeoService,
    private language: LanguageService,
    private jobService: JobsService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.language.getSelectedLanguage();
    this.config.indexName = this.config.indexName + this.selectedLanguage;

    this.seoService.updateTagsWithData(this.jobsearchbyCandidatesDocument);
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.checkUserLogin=true;
        console.log("user details", this.userDetails);
      }
      else{
        this.checkUserLogin=false;
        console.log("user not logged in");
        
      }
    });
  }

  
}
