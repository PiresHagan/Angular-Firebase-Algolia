import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFollowerListComponent } from './company-follower-list.component';

describe('CompanyFollowerListComponent', () => {
  let component: CompanyFollowerListComponent;
  let fixture: ComponentFixture<CompanyFollowerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFollowerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFollowerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
