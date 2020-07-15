import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  campaignPath: string = '/campaign/';
  constructor(private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private storage: AngularFireStorage
  ) {


  }
  updateBilling() {

    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/sessions/customer', {
      redirectUrl: window && window.location && window.location.href || '',
    })

  }

  buySponsoredPost(postData) {
    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/invoices/sponsored-post', { "articleId": postData.articleId, "campaignDate": postData.campaignDate })
  }

  buyBrandSpot(postData) {
    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/invoices/brand-spot', { "brandName": postData.brandName, "brandUrl": postData.brandUrl, "campaignDate": postData.campaignDate, brandImage: postData.brandImage })
  }

  buyTopContributorSpot(postData) {
    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/invoices/top-contributor-spot', postData)
  }

  checkoutCampaign(campaignId, postData) {
    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/invoices/' + campaignId + '/charge', postData)
  }

  getCampaign() {
    return this.http.get(environment.baseAPIDomain + '/api/campaigns');
  }

  getProductPrice(product: string) {
    return this.http.get(environment.baseAPIDomain + '/api/v1/products?sku=' + product);
  }

  terminate(campaignId) {
    return this.http.post(environment.baseAPIDomain + '/api/campaigns/' + campaignId + '/terminate', {})
  }


  uploadImage(imageDetails: any) {
    const path = `${this.campaignPath}/${Date.now()}_${imageDetails.file.name}`;
    return new Promise((resolve, reject) => {
      this.storage.upload(path, imageDetails.file).then(
        snapshot => {
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            const imageUrl: string = downloadURL;
            resolve({ url: imageUrl, alt: this.removeExt(imageDetails.file.name) })
          }).catch(err => reject(err))
        }).catch((error) => {
          console.log(error);
          reject();
        });

    })
  }
  private removeExt(fileName) {
    return fileName.split('.').slice(0, -1).join('.');
  }
}
