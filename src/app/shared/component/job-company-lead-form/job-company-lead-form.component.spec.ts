import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCompanyLeadFormComponent } from './job-company-lead-form.component';

describe('CompanyLeadFormComponent', () => {
  let component: JobCompanyLeadFormComponent;
  let fixture: ComponentFixture<JobCompanyLeadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobCompanyLeadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCompanyLeadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
