import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../shared/services/company.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {

  companyId: string;
  showTabIndex = 0;
  currentLeadSubscription;
  currentPublicProfileSubscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
  ) { }


  ngOnInit(): void {
    this.companyId = this.activatedRoute.snapshot.queryParams["company"];
    if(this.activatedRoute.snapshot.queryParams["indexToShow"] != undefined) {
      this.showTabIndex = this.activatedRoute.snapshot.queryParams["indexToShow"];
    }
    
    this.companyService.getCompanyLeadSubscription(this.companyId).subscribe((data) => {
      this.currentLeadSubscription = data[0];
    });

    this.companyService.getCompanyPublicProfileSubscription(this.companyId).subscribe((data) => {
      this.currentPublicProfileSubscription = data[0];
    });
  }

  changeActiveTab(index) {
    this.showTabIndex = index;
  }


}
