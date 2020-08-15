import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserPublishComponent } from './fundraiser-publish.component';

describe('FundraiserPublishComponent', () => {
  let component: FundraiserPublishComponent;
  let fixture: ComponentFixture<FundraiserPublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserPublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
