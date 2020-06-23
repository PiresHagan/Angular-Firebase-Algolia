import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSearchEngineComponent } from './campaign-search-engine.component';

describe('CampaignSearchEngineComponent', () => {
  let component: CampaignSearchEngineComponent;
  let fixture: ComponentFixture<CampaignSearchEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignSearchEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSearchEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
