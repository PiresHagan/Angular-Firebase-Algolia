import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserDonationComponent } from './fundraiser-donation.component';

describe('FundraiserDonationComponent', () => {
  let component: FundraiserDonationComponent;
  let fixture: ComponentFixture<FundraiserDonationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserDonationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
