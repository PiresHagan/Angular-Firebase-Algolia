import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostBillingComponent } from './host-billing.component';

describe('HostBillingComponent', () => {
  let component: HostBillingComponent;
  let fixture: ComponentFixture<HostBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
