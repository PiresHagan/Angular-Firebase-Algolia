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

  buySponsoredPost(postData, campaignId) {
    const buyAPI = environment.baseAPIDomain + '/api/campaigns/sponsored-post';
    const updateAPI = environment.baseAPIDomain + '/api/campaigns/' + campaignId + '/sponsored-post';
    if (campaignId) {
      return this.http.put(updateAPI, postData)
    }
    return this.http.post(buyAPI, postData)
  }

  buyBrandSpot(postData, campaignId) {
    const buyAPI = environment.baseAPIDomain + '/api/campaigns/brand-spot';
    const updateAPI = environment.baseAPIDomain + '/api/campaigns/' + campaignId + '/brand-spot';
    if (campaignId) {
      return this.http.put(updateAPI, postData)
    }
    return this.http.post(buyAPI, postData)

  }

  buyTopContributorSpot(postData, campaignId) {
    const buyAPI = environment.baseAPIDomain + '/api/campaigns/top-contributor-spot';
    const updateAPI = environment.baseAPIDomain + '/api/campaigns/' + campaignId + '/top-contributor-spot';
    if (campaignId) {
      return this.http.put(updateAPI, postData)
    }
    return this.http.post(buyAPI, postData)
  }


  checkoutCampaign(campaignId, postData) {

    return this.http.post(environment.baseAPIDomain + '/api/v1/payment/campaigns/' + campaignId + '/charge', {})
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

  getCampaignInfo(campaignId) {
    return this.http.get(environment.baseAPIDomain + '/api/campaigns/' + campaignId);

  }
  deleteCampaign(campaignId) {
    return this.http.delete(environment.baseAPIDomain + '/api/campaigns/' + campaignId);
  }
  getPaymentMethod() {
    return this.http.get(environment.baseAPIDomain + '/api/v1/payment/methods')

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
