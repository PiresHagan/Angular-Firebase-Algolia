import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserListComponent } from './fundraiser-list.component';

describe('FundraiserListComponent', () => {
  let component: FundraiserListComponent;
  let fixture: ComponentFixture<FundraiserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
