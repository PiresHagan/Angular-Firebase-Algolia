import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserDonateFormComponent } from './fundraiser-donate-form.component';

describe('FundraiserDonateFormComponent', () => {
  let component: FundraiserDonateFormComponent;
  let fixture: ComponentFixture<FundraiserDonateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserDonateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserDonateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
