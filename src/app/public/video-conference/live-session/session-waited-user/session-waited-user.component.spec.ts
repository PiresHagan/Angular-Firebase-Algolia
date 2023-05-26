import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionWaitedUserComponent } from './session-waited-user.component';

describe('SessionWaitedUserComponent', () => {
  let component: SessionWaitedUserComponent;
  let fixture: ComponentFixture<SessionWaitedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionWaitedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionWaitedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
