import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeUserTypeComponent } from './subscribe-user-type.component';

describe('SubscribeUserTypeComponent', () => {
  let component: SubscribeUserTypeComponent;
  let fixture: ComponentFixture<SubscribeUserTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeUserTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeUserTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
