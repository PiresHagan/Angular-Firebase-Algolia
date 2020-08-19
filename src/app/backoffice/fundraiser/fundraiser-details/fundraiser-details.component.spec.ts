import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserDetailsComponent } from './fundraiser-details.component';

describe('FundraiserDetailsComponent', () => {
  let component: FundraiserDetailsComponent;
  let fixture: ComponentFixture<FundraiserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
