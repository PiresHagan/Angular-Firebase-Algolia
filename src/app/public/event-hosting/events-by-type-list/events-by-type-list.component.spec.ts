import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsByTypeListComponent } from './events-by-type-list.component';

describe('EventsByTypeListComponent', () => {
  let component: EventsByTypeListComponent;
  let fixture: ComponentFixture<EventsByTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsByTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsByTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
