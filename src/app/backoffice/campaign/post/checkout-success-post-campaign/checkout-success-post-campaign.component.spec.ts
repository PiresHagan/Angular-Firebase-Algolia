import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSuccessPostCampaignComponent } from './checkout-success-post-campaign.component';

describe('CheckoutSuccessPostCampaignComponent', () => {
  let component: CheckoutSuccessPostCampaignComponent;
  let fixture: ComponentFixture<CheckoutSuccessPostCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutSuccessPostCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutSuccessPostCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
