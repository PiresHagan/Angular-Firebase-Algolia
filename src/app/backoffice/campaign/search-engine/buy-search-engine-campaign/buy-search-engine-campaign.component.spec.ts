import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySearchEngineCampaignComponent } from './buy-search-engine-campaign.component';

describe('BuySearchEngineCampaignComponent', () => {
  let component: BuySearchEngineCampaignComponent;
  let fixture: ComponentFixture<BuySearchEngineCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuySearchEngineCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuySearchEngineCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
