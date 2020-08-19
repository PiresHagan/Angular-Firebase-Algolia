import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityFundraisersComponent } from './charity-fundraisers.component';

describe('CharityFundraisersComponent', () => {
  let component: CharityFundraisersComponent;
  let fixture: ComponentFixture<CharityFundraisersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityFundraisersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityFundraisersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
