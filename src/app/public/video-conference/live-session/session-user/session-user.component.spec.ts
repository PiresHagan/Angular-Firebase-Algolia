import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionUserComponent } from './session-user.component';

describe('SessionUserComponent', () => {
  let component: SessionUserComponent;
  let fixture: ComponentFixture<SessionUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
