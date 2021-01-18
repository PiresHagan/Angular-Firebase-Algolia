import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {

  companyId: string;
  showTabIndex = 0;
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.companyId = this.activatedRoute.snapshot.queryParams["company"];
    if(this.activatedRoute.snapshot.queryParams["indexToShow"] != undefined) {
      this.showTabIndex = this.activatedRoute.snapshot.queryParams["indexToShow"];
    }
  }

}
