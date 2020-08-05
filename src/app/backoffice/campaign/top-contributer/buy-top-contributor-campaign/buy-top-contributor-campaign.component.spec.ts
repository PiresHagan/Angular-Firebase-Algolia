import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTopContributorCampaignComponent } from './buy-top-contributor-campaign.component';

describe('BuyTopContributorCampaignComponent', () => {
  let component: BuyTopContributorCampaignComponent;
  let fixture: ComponentFixture<BuyTopContributorCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyTopContributorCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyTopContributorCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
