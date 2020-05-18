import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-copywriter1',
  templateUrl: './copywriter1.component.html',
  styleUrls: ['./copywriter1.component.scss']
})
export class Copywriter1Component implements OnInit {
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

  ngOnInit(): void {
    this.themeService.selectedLang.subscribe(lang => this.switchLang(lang));
  }

}
