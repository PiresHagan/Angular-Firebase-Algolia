import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { jobsearchbyCategoriesComponent } from './jobsearchbyCategories.component';

describe('jobsearchbyCategoriesComponent', () => {
  let component: jobsearchbyCategoriesComponent;
  let fixture: ComponentFixture<jobsearchbyCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ jobsearchbyCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(jobsearchbyCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
