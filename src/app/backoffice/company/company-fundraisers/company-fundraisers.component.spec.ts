import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFundraisersComponent } from './company-fundraisers.component';

describe('CompanyFundraisersComponent', () => {
  let component: CompanyFundraisersComponent;
  let fixture: ComponentFixture<CompanyFundraisersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFundraisersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFundraisersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
