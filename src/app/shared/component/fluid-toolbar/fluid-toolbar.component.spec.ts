import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidToolbarComponent } from './fluid-toolbar.component';

describe('FluidToolbarComponent', () => {
  let component: FluidToolbarComponent;
  let fixture: ComponentFixture<FluidToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
