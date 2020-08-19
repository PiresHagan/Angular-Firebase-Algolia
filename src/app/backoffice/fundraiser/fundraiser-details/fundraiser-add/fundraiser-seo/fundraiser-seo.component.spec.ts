import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserSeoComponent } from './fundraiser-seo.component';

describe('FundraiserSeoComponent', () => {
  let component: FundraiserSeoComponent;
  let fixture: ComponentFixture<FundraiserSeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserSeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
