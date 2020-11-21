import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {

  userDetails: any;
  token: any;

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    /* this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;

      this.userDetails = await this.authService.getLoggedInUserDetails();
    }) */

    this.authService.getIdToken().subscribe( token => {
      this.token = token;
      console.log('ID token', this.token);
    });

    
  }

}
