import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserContentComponent } from './fundraiser-content.component';

describe('FundraiserContentComponent', () => {
  let component: FundraiserContentComponent;
  let fixture: ComponentFixture<FundraiserContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
