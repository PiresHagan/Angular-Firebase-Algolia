import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityDonationComponent } from './charity-donation.component';

describe('CharityDonationComponent', () => {
  let component: CharityDonationComponent;
  let fixture: ComponentFixture<CharityDonationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityDonationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
