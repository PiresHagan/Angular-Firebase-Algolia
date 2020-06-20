import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignManagerComponent } from './campaign-manager.component';

describe('CampaignManagerComponent', () => {
  let component: CampaignManagerComponent;
  let fixture: ComponentFixture<CampaignManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
