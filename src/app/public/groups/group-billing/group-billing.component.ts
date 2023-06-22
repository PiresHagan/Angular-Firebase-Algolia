import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/authentication.service';

import { GroupsService } from "src/app/shared/services/group.service";
import { GroupConstant } from "src/app/shared/constants/group-constants";

interface Card {
  exp_month: number,
  exp_year: number,
  id: string,
  isDefault: boolean,
  last4: string,
  vendor: string
}
@Component({
  selector: 'app-group-billing',
  templateUrl: './group-billing.component.html',
  styleUrls: ['./group-billing.component.scss']
})
export class GroupBillingComponent implements OnInit {
  groupId: string;
  group;
  loading = false;
  paymentError = true;
  cards: Card[];
  defaultSelectedCard: Card;
  userDetails;
  defaultPaymentMethodId;
  Cards;
  constructor( private activatedRoute: ActivatedRoute,
    private groupService: GroupsService, 
    private modelService: NzModalService, 
    private translate: TranslateService,
    public authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;

      this.group = await this.authService.getLoggedInUserDetails();
      this.groupId = this.group.id;
       this.displayPaymentMethod();
  })
  }
  updateBilling() {
    this.loading = true;
    this.groupService.updateBilling(this.group).subscribe((response: any) => {
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
    this.groupService.getPaymentMethod(this.groupId).subscribe((data: Card[]) => {
      this.cards = data;
      for(let card of this.cards){
        if(card.isDefault) {
          this.defaultSelectedCard = card;
          this.paymentError = false;
          break;
        }
      }
    }, (error) => {
      this.paymentError = true;
      this.cards = [];
    })
  }

}
