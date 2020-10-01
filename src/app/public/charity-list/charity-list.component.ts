import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { CharityService } from 'src/app/shared/services/charity.service';
<<<<<<< HEAD
import { AuthService } from 'src/app/shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
=======
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { User } from 'src/app/shared/interfaces/user.type';
>>>>>>> dev
@Component({
  selector: 'app-charity-list',
  templateUrl: './charity-list.component.html',
  styleUrls: ['./charity-list.component.scss']
})
export class CharityListComponent implements OnInit {

  charities: any[];
  lastVisible: any = null;
  loading: boolean = true;
  loadingMore: boolean = false;
  selectedLanguage: string = "";
  charityListLimit = 20;

  constructor(
    private charityService: CharityService,
    private langService: LanguageService,
<<<<<<< HEAD
    public authService: AuthService,
    private router: Router,
=======
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
>>>>>>> dev
  ) { }

  ngOnInit(): void {
    this.selectedLanguage = this.langService.getSelectedLanguage();

    window.addEventListener('scroll', this.scrollEvent, true);

    this.getFirstCharities();
  }

  getFirstCharities() {
    this.charityService.getCharitiesOnScroll(this.charityListLimit, 'first', this.lastVisible, this.selectedLanguage).subscribe((data) => {
      this.charities = data.charityList;
      this.lastVisible = data.lastVisible;
      this.loading = false;
    });
  }

  scrollEvent = (event: any): void => {
    if (event.target && event.target.documentElement) {
      const top = event.target.documentElement.scrollTop
      const height = event.target.documentElement.scrollHeight
      const offset = event.target.documentElement.offsetHeight
      if (top > height - offset - 1 - 100 && this.lastVisible && !this.loadingMore) {
        this.loadingMore = true;
        this.charityService.getCharitiesOnScroll(this.charityListLimit, 'next', this.lastVisible, this.selectedLanguage).subscribe((data) => {
          this.loadingMore = false;
          this.charities = [...this.charities, ...data.charityList];
          this.lastVisible = data.lastVisible;
        });
      }
    }
  }
<<<<<<< HEAD

=======
  
>>>>>>> dev
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
        this.router.navigate(["/app/charity/charity-list"]);
      } else {
        this.showModal()
      }
    });
  }
}
