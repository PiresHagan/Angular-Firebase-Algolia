import { Component, OnInit, NgZone } from "@angular/core";
import { ThemeConstantService } from "../../../services/theme-constant.service";
import { AuthService } from "../../../services/authentication.service";
import { UserService } from "../../../services/user.service";
import { Router } from "@angular/router";
import { LanguageService } from "../../../services/language.service";
import { TranslateService } from "@ngx-translate/core";
import { Language } from "../../../interfaces/language.type";

@Component({
  selector: "app-header-backoffice",
  templateUrl: "./header-backoffice.component.html",
  styleUrls: ["./header-backoffice.component.scss"],
})
export class HeaderBackofficeComponent implements OnInit {
  searchVisible: boolean = false;
  quickViewVisible: boolean = false;
  isFolded: boolean;
  isExpand: boolean;
  photoURL: string;
  displayName: string;
  languageList: Language[];
  selectedLanguage: string;

  constructor(
    private themeService: ThemeConstantService,
    public authService: AuthService,
    public userService: UserService,
    public translate: TranslateService,
    public languageService: LanguageService,
    private router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) {


  }

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );

    this.languageList = this.languageService.geLanguageList();
    this.selectedLanguage = this.languageService.getSelectedLanguage();

    this.userService.getCurrentUser().then((user) => {
      this.userService.getMember(user.uid).subscribe((userDetails) => {
        this.photoURL = userDetails?.avatar?.url ? userDetails?.avatar?.url.replace('http://', 'https://') : '';
        this.displayName = userDetails.fullname;
      })
    })
    this.authService.getAuthState().subscribe(user => {
      if (!user || user.isAnonymous) {
        this.navigateToUserLogin();
      }
    });


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

  langChangedHandler(lang: string) {
    this.languageService.changeLang(lang);

  }

  searchToggle(): void {
    this.searchVisible = !this.searchVisible;
  }

  quickViewToggle(): void {
    this.quickViewVisible = !this.quickViewVisible;
  }

  signOut(): void {
    this.authService.signout();
    this.navigateToUserLogin();
  }
  navigateToUserLogin() {
    this.ngZone.run(() => {
      this.router.navigate(["auth/login"]);
    });
  }

  notificationList = [
    {
      title: "You received a new message",
      time: "8 min",
      icon: "mail",
      color: "ant-avatar-" + "blue",
    },
    {
      title: "New user registered",
      time: "7 hours",
      icon: "user-add",
      color: "ant-avatar-" + "cyan",
    },
    {
      title: "System Alert",
      time: "8 hours",
      icon: "warning",
      color: "ant-avatar-" + "red",
    },
    {
      title: "You have a new update",
      time: "2 days",
      icon: "sync",
      color: "ant-avatar-" + "gold",
    },
  ];
}
