import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityDonateFormComponent } from './charity-donate-form.component';

describe('CharityDonateFormComponent', () => {
  let component: CharityDonateFormComponent;
  let fixture: ComponentFixture<CharityDonateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityDonateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityDonateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
