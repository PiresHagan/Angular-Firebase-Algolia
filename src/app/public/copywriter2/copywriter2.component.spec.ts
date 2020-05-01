import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Copywriter2Component } from './copywriter2.component';

describe('Copywriter2Component', () => {
  let component: Copywriter2Component;
  let fixture: ComponentFixture<Copywriter2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Copywriter2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Copywriter2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
