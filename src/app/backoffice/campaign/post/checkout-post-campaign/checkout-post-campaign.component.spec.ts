import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPostCampaignComponent } from './checkout-post-campaign.component';

describe('CheckoutPostCampaignComponent', () => {
  let component: CheckoutPostCampaignComponent;
  let fixture: ComponentFixture<CheckoutPostCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutPostCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPostCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
