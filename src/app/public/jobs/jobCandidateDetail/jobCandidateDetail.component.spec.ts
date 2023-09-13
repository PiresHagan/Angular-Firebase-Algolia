import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { jobCandidateDetailComponent } from './jobCandidateDetail.component';

describe('jobCandidateDetailComponent', () => {
  let component: jobCandidateDetailComponent;
  let fixture: ComponentFixture<jobCandidateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ jobCandidateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(jobCandidateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
