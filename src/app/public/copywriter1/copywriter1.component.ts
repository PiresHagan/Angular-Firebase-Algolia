import { Component } from '@angular/core';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-copywriter1',
  templateUrl: './copywriter1.component.html',
  styleUrls: ['./copywriter1.component.scss']
})
export class Copywriter1Component {
  constructor(
    public translate: TranslateService,
    private themeService: ThemeConstantService
  ) {

  }


}
