import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CampaignService {


  constructor(private http: HttpClient,
    private authService: AuthService,
    private router: Router) {


  }
  updateBilling() {

    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/sessions/customer', {
      redirectUrl: window && window.location && window.location.href || '',
    })

  }
  buySponsoredPost(postData) {
    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/invoices/sponsored-post', { "articleId": postData.articleId, "dateSelected": postData.campaignDate, "amount": 1000 })
  }
  buyBrandSpot(postData) {
    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/invoices/brand-spot', { "brandName": postData.brandName, "brandUrl": postData.brandUrl, "monthSelected": postData.campaignDate, "amount": 1000 })
  }
  buyTopContributorSpot(postData) {
    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/invoices/top-contributor-spot', { "memberId": 'Uma', "dateSelected": postData.campaignDate, "amount": 1000 })
  }
  checkoutCampaign(campaignId, postData) {
    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/invoices/' + campaignId + '/charge', {})
  }
}
