import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraiserImageComponent } from './fundraiser-image.component';

describe('FundraiserImageComponent', () => {
  let component: FundraiserImageComponent;
  let fixture: ComponentFixture<FundraiserImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraiserImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraiserImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
