import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../shared/services/company.service';

@Component({
  selector: 'app-company-leads-package',
  templateUrl: './company-leads-package.component.html',
  styleUrls: ['./company-leads-package.component.scss']
})
export class CompanyLeadsPackageComponent implements OnInit {

  packages = [];

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.companyService.getLeadsPackage().subscribe(data => {
      this.packages = data;
    }, err => {
      console.error(err);
    })
  }

}
