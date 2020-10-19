import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from 'src/app/shared/services/authentication.service';
import { AuthorService } from 'src/app/shared/services/author.service';
import { Fundraiser } from 'src/app/shared/interfaces/fundraiser.type';
import { User } from 'src/app/shared/interfaces/user.type';

@Component({
  selector: 'app-fundraiser-author',
  templateUrl: './fundraiser-author.component.html',
  styleUrls: ['./fundraiser-author.component.scss']
})
export class FundraiserAuthorComponent implements OnInit {

  @Input() fundraiser: Fundraiser;
  @Input() fundraiserAuthor;
  isFollowing: boolean = false;
  isVisible = false;
  isOkLoading = false;
  isLoggedInUser: boolean = false;
  isUpdatingFollow: boolean = false;
  userDetails: User;

  constructor(
    private authService: AuthService,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {
    this.setUserDetails();
  }

  setFollowOrNot() {
    this.authorService.isUserFollowing(this.fundraiser.author.id, this.getUserDetails().id, this.fundraiser.author.type).subscribe((data) => {
      setTimeout(() => {
        if (data) {
          this.isFollowing = true;
          this.isUpdatingFollow = false;
        } else {
          this.isFollowing = false;
          this.isUpdatingFollow = false;
        }
      }, 1500);
    });
  }

  getUserDetails() {
    return {
      fullname: this.userDetails.fullname,
      slug: this.userDetails.slug ? this.userDetails.slug : '',
      avatar: this.userDetails.avatar ? this.userDetails.avatar : '',
      id: this.userDetails.id,
    }
  }

  async follow() {
    await this.setUserDetails();
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.authorService.follow(this.fundraiser.author.id, this.fundraiser.author.type);
    }else{
      this.showModal()
    }
  }

  async unfollow() {
    await this.setUserDetails();
    if (this.isLoggedInUser) {
      this.isUpdatingFollow = true;
      await this.authorService.unfollow(this.fundraiser.author.id, this.fundraiser.author.type);
    }else{
      this.showModal()
    }
  }

  async setUserDetails() {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user) {
        this.userDetails = null;
        this.isLoggedInUser = false;
        return;
      }

      this.userDetails = await this.authService.getLoggedInUserDetails();

      if (this.userDetails) {
        this.isLoggedInUser = true;
        this.setFollowOrNot();
      } else {
        this.userDetails = null;
        this.isLoggedInUser = false;
      }
    })
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isOkLoading = false;
    }, 2000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getAuthorUrl(fundraiser) {
    if (fundraiser.author.type == 'charity') {
      return '/charities/';
    } else if (fundraiser.author.type == 'company') {
      return '/companies/';
    } else {
      return '/'
    }
  }

}
