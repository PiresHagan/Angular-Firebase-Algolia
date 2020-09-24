import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLeadsPackageComponent } from './company-leads-package.component';

describe('CompanyLeadsPackageComponent', () => {
  let component: CompanyLeadsPackageComponent;
  let fixture: ComponentFixture<CompanyLeadsPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyLeadsPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLeadsPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
