import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSearchByCompanyComponent } from './jobSearchByCompany.component';

describe('JobSearchByCompanyComponent', () => {
  let component: JobSearchByCompanyComponent;
  let fixture: ComponentFixture<JobSearchByCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSearchByCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSearchByCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
