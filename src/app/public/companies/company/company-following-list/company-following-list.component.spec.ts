import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFollowingListComponent } from './company-following-list.component';

describe('CompanyFollowingListComponent', () => {
  let component: CompanyFollowingListComponent;
  let fixture: ComponentFixture<CompanyFollowingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFollowingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFollowingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
