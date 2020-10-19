import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserAuthorComponent } from './fundraiser-author.component';

describe('FundraiserAuthorComponent', () => {
  let component: FundraiserAuthorComponent;
  let fixture: ComponentFixture<FundraiserAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
