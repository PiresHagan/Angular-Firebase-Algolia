import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { jobsearchbyCandidatesComponent } from './jobsearchbyCandidates.component';

describe('jobsearchbyCandidatesComponent', () => {
  let component: jobsearchbyCandidatesComponent;
  let fixture: ComponentFixture<jobsearchbyCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ jobsearchbyCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(jobsearchbyCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
