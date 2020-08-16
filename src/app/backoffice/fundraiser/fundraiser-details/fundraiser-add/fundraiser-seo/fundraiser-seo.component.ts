import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Location } from '@angular/common';
import { BackofficeFundraiserService } from 'src/app/backoffice/shared/services/backoffice-fundraiser.service';

@Component({
  selector: 'app-fundraiser-seo',
  templateUrl: './fundraiser-seo.component.html',
  styleUrls: ['./fundraiser-seo.component.scss']
})
export class FundraiserSeoComponent implements OnInit {
  
  fundraiserId: string;
  fundraiser;
  userDetails;
  isFormSaving: boolean = false;
  title;
  keywords;
  description;

  loading: boolean = true;
  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router,
    private location: Location,
    public fundraiserService: BackofficeFundraiserService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.fundraiserId = params.get('fundraiserId');
      this.setFundraiserData();
    })
  }

  setFundraiserData() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.fundraiserId) {
        try {

          this.fundraiser = await this.fundraiserService.getFundraiserById(this.fundraiserId);
          this.title = this.fundraiser && this.fundraiser.meta && this.fundraiser.meta.title ? this.fundraiser.meta.title : '';
          this.keywords = this.fundraiser && this.fundraiser.meta && this.fundraiser.meta.keywords ? this.fundraiser.meta.keywords : '';
          this.description = this.fundraiser && this.fundraiser.meta && this.fundraiser.meta.description ? this.fundraiser.meta.description : '';

        } catch (error) {
          this.fundraiser = null;
          this.router.navigate(['/app/error'])
        }
      } else {
        console.log('Unknown entity');
        this.router.navigate(['/app/error'])
      }
      this.loading = false;
    })
  }

  saveMetaData() {
    this.isFormSaving = true;
    this.fundraiserService.updateFundraiser(this.fundraiserId, this.getMetaDetails()).then(() => {
      this.isFormSaving = false;
      this.router.navigate(['/app/fundraiser/fundraiser-details/publish', this.fundraiserId]);
    })
  }

  getMetaDetails() {
    return {
      meta: {
        title: this.title,
        keywords: this.keywords,
        description: this.description
      }
    }
  }

  goBack() {
    this.location.back();
  }

}
