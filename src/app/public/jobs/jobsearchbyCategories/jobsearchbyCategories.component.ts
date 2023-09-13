import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { SeoService } from 'src/app/shared/services/seo/seo.service';
import { JobsService } from '../../../shared/services/jobs.service';
import { Job } from '../../../shared/interfaces/job.type'; 
import * as algoliasearch from 'algoliasearch/lite';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/authentication.service';

const searchClient = algoliasearch(
  environment.algolia.applicationId,
  environment.algolia.apiKey
);

@Component({
  selector: 'app-contact',
  templateUrl: './jobsearchbyCategories.component.html',
  styleUrls: ['./jobsearchbyCategories.component.scss']
})
export class jobsearchbyCategoriesComponent implements OnInit {
  config = {
    indexName: environment.algolia.index.vacancies,
    searchClient,
    routing: true
  };
  loading: boolean = false;
  selectedLanguage: string = "";
  private jobsearchbyCategoriesDocument = "Search jobs by Categories";
  public jobs: Job[]; 
  checkUserLogin: boolean = false;
  userDetails;
  searchQuery: string = '';
  filteredCategories: any[] = [];
  groupedVacancies: { category: string, total: number }[] = [];
  categoryList = [
    { code: 'Accounting', label: 'Accounting', total: 0 },
    { code: 'Admin ', label: 'Admin', total: 0 },
    { code: 'Architecture', label: 'Architecture', total: 0 },
    { code: 'Art', label: 'Art', total: 0 },
    { code: 'Biotechnology', label: 'Biotechnology', total: 0 },
    { code: 'Business', label: 'Business', total: 0 },
    { code: 'Customer service', label: 'Customer service', total: 0 },
    { code: 'Education', label: 'Education', total: 0 },
    { code: 'Etc', label: 'Etc', total: 0 },
    { code: 'Food', label: 'Food', total: 0 },
    { code: 'General labor', label: 'General labor', total: 0 },
    { code: 'Government', label: 'Government', total: 0 },
    { code: 'Human resources', label: 'Human resources', total: 0 },
    { code: 'Legal ', label: 'Legal ', total: 0 },
    { code: 'Manufacturing', label: 'Manufacturing', total: 0 },
    { code: 'Marketing', label: 'Marketing', total: 0 },
    { code: 'Medical', label: 'Medical', total: 0 },
    { code: 'Nonprofit sector', label: 'Nonprofit sector', total: 0 },
    { code: 'Real estate', label: 'Real estate', total: 0 },
    { code: 'Retail', label: 'Retail', total: 0 },
    { code: 'Sales', label: 'Sales', total: 0 },
    { code: 'Salon', label: 'Salon', total: 0 },
    { code: 'Security', label: 'Security', total: 0 },
    { code: 'Skilled trade', label: 'Skilled trade', total: 0 },
    { code: 'Software', label: 'Software', total: 0 },
    { code: 'Systems', label: 'Systems', total: 0 },
    { code: 'Technical support', label: 'Technical support', total: 0 },
    { code: 'Transport', label: 'Transport', total: 0 },
    { code: 'Tv', label: 'Tv', total: 0 },
    { code: 'Web', label: 'Web', total: 0 },
    { code: 'Writing', label: 'Writing', total: 0 }
  ];


  constructor(
    public translate: TranslateService,
    private seoService: SeoService,
    private language: LanguageService,
    private jobService: JobsService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.seoService.updateTagsWithData(this.jobsearchbyCategoriesDocument);
    this.selectedLanguage = this.language.getSelectedLanguage();
    this.filteredCategories = this.categoryList;

    this.config.indexName = this.config.indexName + this.selectedLanguage;
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.checkUserLogin = true;
        console.log("user details", this.userDetails);
      }
      else {
        this.checkUserLogin = false;
        console.log("user not logged in");

      }
    });
    const index = searchClient.initIndex(this.config.indexName);
    index
    .search('') 
    .then(({ hits }) => {
      this.jobs = hits; 
      const groupedVacancies = this.groupAndCountByCategory();
      console.log("groupedVacancies", groupedVacancies);

      
      this.categoryList.forEach(category => {
        if (groupedVacancies.hasOwnProperty(category.label)) {
            console.log("groupedVacancies", groupedVacancies);
          category.total = groupedVacancies[category.label];
          
        } else {
          category.total = 0; 
        }
      });

      this.loading = false;
    })
    .catch(err => {
      console.error(err);
      this.loading = false; 
    });
  }


  private groupAndCountByCategory(): { [category: string]: number } {
    const grouped = this.jobs.reduce((acc, job) => {
      const category = job.categories; 
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {});
  
    return grouped;
  }


  applySearchFilter() {
    const trimmedQuery = this.searchQuery.trim().toLowerCase();

    if (trimmedQuery === '') {
      
      this.filteredCategories = this.categoryList;
    } else {
      
      this.filteredCategories = this.categoryList.filter(category =>
        category.label.toLowerCase().includes(trimmedQuery)
      );
    }
    
  }


}
