import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent{
 
    @Output() langChanged: EventEmitter<string> =   new EventEmitter();
    searchVisible : boolean = false;
    quickViewVisible : boolean = false;
    isFolded : boolean;
    isExpand : boolean;
    

    

    constructor(
        private themeService: ThemeConstantService,
        public translate: TranslateService
      ) {
        translate.addLangs(['en', 'nl']);
        translate.setDefaultLang('en');
      }
      switchLang(lang: string) {
        this.langChanged.emit(lang);
        this.translate.use(lang);
      }

    ngOnInit(): void {
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
    }

    toggleFold() {
        this.isFolded = !this.isFolded;
        this.themeService.toggleFold(this.isFolded);
    }

    toggleExpand() {
        this.isFolded = false;
        this.isExpand = !this.isExpand;
        this.themeService.toggleExpand(this.isExpand);
        this.themeService.toggleFold(this.isFolded);
    }

    searchToggle(): void {
        this.searchVisible = !this.searchVisible;
    }

    quickViewToggle(): void {
        this.quickViewVisible = !this.quickViewVisible;
    }
    
    notificationList = [
        {
            title: 'You received a new message',
            time: '8 min',
            icon: 'mail',
            color: 'ant-avatar-' + 'blue'
        },
        {
            title: 'New user registered',
            time: '7 hours',
            icon: 'user-add',
            color: 'ant-avatar-' + 'cyan'
        },
        {
            title: 'System Alert',
            time: '8 hours',
            icon: 'warning',
            color: 'ant-avatar-' + 'red'
        },
        {
            title: 'You have a new update',
            time: '2 days',
            icon: 'sync',
            color: 'ant-avatar-' + 'gold'
        }
    ];
}
