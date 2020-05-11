import { Component, OnInit, NgZone } from "@angular/core";
import { ThemeConstantService } from "../../services/theme-constant.service";
import { AuthService } from "../../services/authentication.service";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";

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

  constructor(
    private themeService: ThemeConstantService,
    public authService: AuthService,
    public userService: UserService,
    private router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) { }

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
    debugger
    this.userService.getSavedUser().subscribe((data) => {
      debugger;
      if (data) {
        this.photoURL = data.photoURL;
        this.displayName = data.displayName;
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
