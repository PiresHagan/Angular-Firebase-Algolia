import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredContributorComponent } from './sponsored-contributor.component';

describe('SponsoredContributorComponent', () => {
  let component: SponsoredContributorComponent;
  let fixture: ComponentFixture<SponsoredContributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredContributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredContributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
