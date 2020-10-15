import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantProcessingComponent } from './merchant-processing.component';

describe('MerchantProcessingComponent', () => {
  let component: MerchantProcessingComponent;
  let fixture: ComponentFixture<MerchantProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
