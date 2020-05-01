import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Copywriter1Component } from './copywriter1.component';

describe('Copywriter1Component', () => {
  let component: Copywriter1Component;
  let fixture: ComponentFixture<Copywriter1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Copywriter1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Copywriter1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
