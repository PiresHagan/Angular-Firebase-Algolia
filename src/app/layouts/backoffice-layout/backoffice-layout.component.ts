import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable } from "rxjs";
import { distinctUntilChanged, filter, map, startWith, skip } from "rxjs/operators";
import { IBreadcrumb } from "../../shared/interfaces/breadcrumb.type";
import { ThemeConstantService } from '../../shared/services/theme-constant.service';
import { TranslateService, LangChangeEvent, DefaultLangChangeEvent } from '@ngx-translate/core';


@Component({
  selector: 'app-backoffice-layout',
  templateUrl: './backoffice-layout.component.html',
  styleUrls: ['./backoffice-layout.component.scss']
})
export class BackofficeLayoutComponent implements OnInit {

  breadcrumbs$: Observable<IBreadcrumb[]>;
  contentHeaderDisplay: string;
  isFolded: boolean = false;
  isSideNavDark: boolean;
  isExpand: boolean = true;
  selectedHeaderColor: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private themeService: ThemeConstantService, public translate: TranslateService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data && child.snapshot.data['headerDisplay']) {
            return child.snapshot.data['headerDisplay'];
          } else {
            return null;
          }
        }
        return null;
      })
    ).subscribe((data: any) => {
      this.contentHeaderDisplay = data;
    });
  }

  ngOnInit() {
    this.setBreadCrump();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setBreadCrump();
    });
    this.translate.onDefaultLangChange.subscribe((event: DefaultLangChangeEvent) => {
      this.setBreadCrump();
    });
    this.themeService.isMenuFoldedChanges.pipe(skip(1)).subscribe(isFolded => this.isFolded = isFolded);
    this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    this.themeService.selectedHeaderColor.subscribe(color => this.selectedHeaderColor = color);
    this.themeService.isExpandChanges.pipe(skip(1)).subscribe(isExpand => this.isExpand = isExpand);
  }

  setBreadCrump() {
    this.breadcrumbs$ = this.router.events.pipe(
      startWith(new NavigationEnd(0, '/', '/')),
      filter(event => event instanceof NavigationEnd), distinctUntilChanged(),
      map(data => this.buildBreadCrumb(this.activatedRoute.root))
    );
  }



  private buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {

    let label = '', path = '/', display = null;
    if (route.routeConfig) {
      if (route.routeConfig.data) {
        label = this.translate.instant(route.routeConfig.data['title']);
        path += route.routeConfig.path;
      }
    } else {
      label = this.translate.instant('dashboard');
      path += 'dashboard';
    }

    const nextUrl = path && path !== '/dashboard' ? `${url}${path}` : url;
    const breadcrumb = <IBreadcrumb>{
      label: label, url: nextUrl
    };

    const newBreadcrumbs = label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

}
