import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEventComponent } from './booking-event.component';

describe('BookingEventComponent', () => {
  let component: BookingEventComponent;
  let fixture: ComponentFixture<BookingEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
