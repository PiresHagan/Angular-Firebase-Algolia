import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffArticlesComponent } from './staff-articles.component';

describe('StaffArticlesComponent', () => {
  let component: StaffArticlesComponent;
  let fixture: ComponentFixture<StaffArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
