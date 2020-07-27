import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopContributorCampaignComponent } from './top-contributor-campaign.component';

describe('TopContributorCampaignComponent', () => {
  let component: TopContributorCampaignComponent;
  let fixture: ComponentFixture<TopContributorCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopContributorCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopContributorCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
