import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserFollowerListComponent } from './fundraiser-follower-list.component';

describe('FundraiserFollowerListComponent', () => {
  let component: FundraiserFollowerListComponent;
  let fixture: ComponentFixture<FundraiserFollowerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserFollowerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserFollowerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
