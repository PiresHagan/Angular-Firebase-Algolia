import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcampaignListComponent } from './ccampaign-list.component';

describe('CcampaignListComponent', () => {
  let component: CcampaignListComponent;
  let fixture: ComponentFixture<CcampaignListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcampaignListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcampaignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
