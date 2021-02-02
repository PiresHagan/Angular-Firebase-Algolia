import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { FundraiserService } from 'src/app/shared/services/fundraiser.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/shared/services/user.service';
@Component({
  selector: 'app-fundraiser-list',
  templateUrl: './fundraiser-list.component.html',
  styleUrls: ['./fundraiser-list.component.scss']
})
export class FundraiserListComponent implements OnInit {
  fundraisers: any[];
  lastVisible: any = null;
  loading: boolean = true;
  loadingMore: boolean = false;
  selectedLanguage: string = "";
  fundraiserListLimit = 20;

  constructor(
    private fundraiserService: FundraiserService,
    private langService: LanguageService,
    private router: Router,
    public authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.langService.getSelectedLanguage();

    window.addEventListener('scroll', this.scrollEvent, true);

    this.getFirstFundraisers();
  }

  getFirstFundraisers() {
    this.fundraiserService.getFundraisersOnScroll(this.fundraiserListLimit, 'first', this.lastVisible, this.selectedLanguage).subscribe((data) => {
      this.fundraisers = data.fundraiserList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
    });
  }

  scrollEvent = (event: any): void => {
    let documentElement = event.target.documentElement ? event.target.documentElement : event.target;
    if (documentElement) {
      const top = documentElement.scrollTop
      const height = documentElement.scrollHeight
      const offset = documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.fundraiserService.getFundraisersOnScroll(this.fundraiserListLimit, 'next', this.lastVisible, this.selectedLanguage).subscribe((data) => {
          this.loadingMore = false;
          this.fundraisers = [...this.fundraisers, ...data.fundraiserList];
          this.lastVisible = data.lastVisible;
        });
      }
    }
  }

  isVisible = false;
  isOkLoading = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.router.navigate(["auth/login"]);
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  
  checkLogin(){
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user.isAnonymous) {
        if(this.userService.userData?.isNewConsoleUser) {
          this.authService.redirectToConsole(`${environment.consoleURL}/fundraiser/fundraiser-list`, {})
        } else {
          this.router.navigate(["/app/fundraiser/fundraiser-list"]);
        }
      } else {
        this.showModal()
      }
    });

  
  }
}
