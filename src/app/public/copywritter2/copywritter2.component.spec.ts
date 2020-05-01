import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Copywritter2Component } from './copywritter2.component';

describe('Copywritter2Component', () => {
  let component: Copywritter2Component;
  let fixture: ComponentFixture<Copywritter2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Copywritter2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Copywritter2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
