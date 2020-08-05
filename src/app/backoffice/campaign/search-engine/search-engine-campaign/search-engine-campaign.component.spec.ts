import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEngineCampaignComponent } from './search-engine-campaign.component';

describe('SearchEngineCampaignComponent', () => {
  let component: SearchEngineCampaignComponent;
  let fixture: ComponentFixture<SearchEngineCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEngineCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEngineCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
