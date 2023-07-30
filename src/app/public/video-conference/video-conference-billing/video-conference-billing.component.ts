import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { VideoConferenceService } from 'src/app/shared/services/video-conference.service';

interface Card {
  exp_month: number,
  exp_year: number,
  id: string,
  isDefault: boolean,
  last4: string,
  vendor: string
}

@Component({
  selector: 'app-video-conference-billing',
  templateUrl: './video-conference-billing.component.html',
  styleUrls: ['./video-conference-billing.component.scss']
})
export class VideoConferenceBillingComponent implements OnInit {

  hostId: string;
  host;
  loading = false;
  paymentError = true;
  cards: Card[];
  defaultSelectedCard: Card;
  userDetails;
  defaultPaymentMethodId;
  Cards;
  constructor(
    private activatedRoute: ActivatedRoute,
    private videoConferenceService: VideoConferenceService,
    private modelService: NzModalService,
    private translate: TranslateService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
        this.authService.getAuthState().subscribe(async (user) => {
          if (!user)
            return;
          this.host = await this.authService.getLoggedInUser(user.uid);
          this.hostId = this.host.id;
          await this.displayPaymentMethod();
      });
  }
  updateBilling() {
    this.loading = true;
    this.videoConferenceService.updateBilling(this.host).subscribe((response: any) => {
      this.loading = false;

      if (response.url) {
        window && window.open(response.url, '_self')
      } else {
        this.showError();
      }
    }, (errror) => {
      this.loading = false;
      this.showError();
    })
  }

  showError() {
    const msg = this.translate.instant("CampError");
    this.modelService.warning({
      nzTitle: "<i>" + msg + "</i>",
    });
  }

  displayPaymentMethod() {
    this.videoConferenceService.getPaymentMethod(this.hostId).subscribe((data: Card[]) => {
      this.cards = data;
      console.log(data)
      for(let card of this.cards){
        if(card.isDefault) {
          this.defaultSelectedCard = card;
          this.paymentError = false;
          break;
        }
      }
    }, (error) => {
      console.log(error)
      this.paymentError = true;
      this.cards = [];
    })
  }

}
