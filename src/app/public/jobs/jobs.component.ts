import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { JobsService } from 'src/app/shared/services/jobs.service';
import { Job } from 'src/app/shared/interfaces/job.type'; 
import * as algoliasearch from 'algoliasearch/lite';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/authentication.service';


const searchClient = algoliasearch(
  environment.algolia.applicationId,
  environment.algolia.apiKey
);

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  config = {
    indexName: environment.algolia.index.vacancies,
    searchClient,
    routing: true
  };
  searchValue = "";
  loading: boolean = true;
  selectedLanguage: string = "";
  showResult: boolean = false;

  private jobsDocument = "jobs";
  public jobs: Job[]; 
  checkUserLogin: boolean = false;
  userDetails;
  constructor(
    public translate: TranslateService,
    private seoService: SeoService,
    private language: LanguageService,
    private jobService: JobsService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.seoService.updateTagsWithData(this.jobsDocument);

    this.selectedLanguage = this.language.getSelectedLanguage();
    this.config.indexName = this.config.indexName + this.selectedLanguage;  
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

  onSearchChange(searchValue: string): void {
    this.searchValue = searchValue;
    if (searchValue) {
      this.showResult = true;
    } else {
      this.searchValue = '';
      this.showResult = false;
    }

  }


}
