import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBillingComponent } from './group-billing.component';

describe('GroupBillingComponent', () => {
  let component: GroupBillingComponent;
  let fixture: ComponentFixture<GroupBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
