import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Copywritter1Component } from './copywritter1.component';

describe('Copywritter1Component', () => {
  let component: Copywritter1Component;
  let fixture: ComponentFixture<Copywritter1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Copywritter1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Copywritter1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
