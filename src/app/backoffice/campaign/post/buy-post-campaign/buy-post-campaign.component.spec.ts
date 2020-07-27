import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPostCampaignComponent } from './buy-post-campaign.component';

describe('BuyPostCampaignComponent', () => {
  let component: BuyPostCampaignComponent;
  let fixture: ComponentFixture<BuyPostCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyPostCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPostCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
