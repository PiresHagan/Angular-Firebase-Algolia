import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../shared/services/company.service';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-leads-package',
  templateUrl: './company-leads-package.component.html',
  styleUrls: ['./company-leads-package.component.scss']
})
export class CompanyLeadsPackageComponent implements OnInit {

  packages = [];

  constructor(
    private companyService: CompanyService,
    public translate: TranslateService,
    private themeService: ThemeConstantService
    ) { }

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
