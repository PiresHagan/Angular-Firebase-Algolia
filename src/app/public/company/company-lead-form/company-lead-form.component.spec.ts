import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLeadFormComponent } from './company-lead-form.component';

describe('CompanyLeadFormComponent', () => {
  let component: CompanyLeadFormComponent;
  let fixture: ComponentFixture<CompanyLeadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyLeadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLeadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
