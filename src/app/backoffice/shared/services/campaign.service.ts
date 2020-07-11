import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CampaignService {


  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {


  }
  updateBilling() {
    const currentUrl = this.router.url;
    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/sessions/customer', {
      redirectUrl: currentUrl,
    })

  }
}
