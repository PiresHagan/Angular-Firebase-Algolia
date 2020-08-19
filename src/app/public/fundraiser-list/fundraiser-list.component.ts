import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/shared/services/language.service';
import { FundraiserService } from 'src/app/shared/services/fundraiser.service';

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
    private langService: LanguageService
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
    if (event.target && event.target.documentElement) {
      const top = event.target.documentElement.scrollTop
      const height = event.target.documentElement.scrollHeight
      const offset = event.target.documentElement.offsetHeight
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

}
