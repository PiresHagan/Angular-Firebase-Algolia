import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { JobsService } from '../../../shared/services/jobs.service';
import { Job } from '../../../shared/interfaces/job.type'; 
import * as algoliasearch from 'algoliasearch/lite';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { ActivatedRoute } from '@angular/router';

const searchClient = algoliasearch(
  environment.algolia.applicationId,
  environment.algolia.apiKey
);

@Component({
  selector: 'app-jobs',
  templateUrl: './jobSearchByCompany.component.html',
  styleUrls: ['./jobSearchByCompany.component.scss']
})
export class JobSearchByCompanyComponent implements OnInit {
  config = {
    indexName: environment.algolia.index.vacancies,
    searchClient,
    routing: true
  };
  loading: boolean = true;
  selectedLanguage: string = "";

  private jobsDocument = "jobs";
  public jobs: Job[]; 
  checkUserLogin: boolean = false;
  userDetails;
  jobsList;
  boostingPlans;
  jobsFromBoostingPlans;
  filteredJobs: any[] = [];
  searchQuery: string = '';
  

  constructor(
    public translate: TranslateService,
    private seoService: SeoService,
    private language: LanguageService,
    private jobService: JobsService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.seoService.updateTagsWithData(this.jobsDocument);
    this.selectedLanguage = this.language.getSelectedLanguage();

    
    this.jobService.getAllJobs().subscribe(
      (data) => {
        this.jobsList = data;
        this.loading = false;
    
        this.jobService.getAllJobPackages().subscribe(
          (packages) => {
            this.boostingPlans = packages;
    
            if (this.jobsList && this.boostingPlans) {
              
              this.jobsFromBoostingPlans = this.jobService.getBoostedJobs(this.jobsList, this.boostingPlans);
              this.filteredJobs =this.jobsFromBoostingPlans;
              
              this.route.queryParams.subscribe((params) => {
              
                this.searchQuery = params.query;
                this.applySearchFilter();
                
              });

              
              const removedJobs = this.jobsList.filter(job => !this.jobsFromBoostingPlans.find(boostedJob => boostedJob.id === job.id));
              
            }
          },
          (error) => {
            console.error("Error fetching packages:", error);
          }
        );

        
      },
      (error) => {
        console.error("Error fetching jobs:", error);
      }
    );

    this.config.indexName = this.config.indexName + this.selectedLanguage;
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.checkUserLogin=true;
        
      }
      else{
        this.checkUserLogin=false;
        
        
      }
    });
    
  }

  applySearchFilter() {
    if (!this.searchQuery) {
      this.filteredJobs = this.jobsFromBoostingPlans;
    } else {
      this.filteredJobs = this.jobsFromBoostingPlans.filter(job => {
        
        const searchTerm = this.searchQuery.toLowerCase();
        const jobTitle = job.jobTitle.toLowerCase();
        const companyName = job.companyName.toLowerCase();
        const categories = job.categories.toLowerCase();     
        return jobTitle.includes(searchTerm) || companyName.includes(searchTerm) || categories.includes(searchTerm);
      });
    }
  }

  
  
}
