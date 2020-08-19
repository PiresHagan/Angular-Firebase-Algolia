import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCharityComponent } from './add-charity.component';

describe('AddCharityComponent', () => {
  let component: AddCharityComponent;
  let fixture: ComponentFixture<AddCharityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCharityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCharityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
