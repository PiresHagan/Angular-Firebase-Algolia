import { Input, OnInit,Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/shared/interfaces/user.type';

import { CacheService } from 'src/app/shared/services/cache.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AuthorService } from "src/app/shared/services/author.service";
import { GroupsService } from "src/app/shared/services/group.service";
import { AuthService } from "src/app/shared/services/authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService, UploadFile } from "ng-zorro-antd";
import { Member } from 'src/app/shared/interfaces/member.type';


@Component({
  selector: 'app-top-contributors',
  templateUrl: './top-contributors.component.html',
  styleUrls: ['./top-contributors.component.scss']
})
export class TopContributorsComponent implements OnInit {

  @Input() memberList: Member[];
  @Input() groupSize = 5;
  showTooltip: string = '';
  query: string;
  isLoggedInUser: boolean = false;
  userDetails: User;
  constructor(
    private cacheService: CacheService,
    private languageService: LanguageService,
    public translate: TranslateService,
    private authService: AuthService,
    private groupService: GroupsService,
    private router: Router,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
  }

  replaceImage(url) {
    let latestURL = url
    if (url) {
      latestURL = latestURL.replace('https://mytrendingstories.com/', 'https://assets.mytrendingstories.com/')
        .replace('http://cdn.mytrendingstories.com/', 'https://cdn.mytrendingstories.com/')
        .replace('https://abc2020new.com/', 'https://assets.mytrendingstories.com/');
    }
    return latestURL;
  }

  skeletonData = new Array(this.groupSize).fill({}).map((_i, index) => {
    return 
  });
}
