import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sponsored-post',
  templateUrl: './sponsored-post.component.html',
  styleUrls: ['./sponsored-post.component.scss']
})
export class SponsoredPostComponent implements OnInit {

  userDetails;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
    });

  }

  goToStore(){
    this.authService.getIdToken().subscribe(token => {
      const url = `${environment.storeUrl}?token=${token}`;
      window.open(url, '_blank');
    });
  }


}
