import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSearchEngineCampaignComponent } from './checkout-search-engine-campaign.component';

describe('CheckoutSearchEngineCampaignComponent', () => {
  let component: CheckoutSearchEngineCampaignComponent;
  let fixture: ComponentFixture<CheckoutSearchEngineCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutSearchEngineCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutSearchEngineCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
