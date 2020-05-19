import { Component, EventEmitter, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeConstantService } from '../../services/theme-constant.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})

export class FooterComponent{
    
  @Output() change = new EventEmitter();
  @Input() lang: string;
  constructor(
    public translate: TranslateService,
    private themeService: ThemeConstantService
  ) {
    translate.addLangs(['en', 'nl']);
    translate.setDefaultLang('en');
  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
