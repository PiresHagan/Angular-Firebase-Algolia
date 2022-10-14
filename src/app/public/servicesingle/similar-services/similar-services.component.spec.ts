import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarServicesComponent } from './similar-services.component';

describe('SimilarServicesComponent', () => {
  let component: SimilarServicesComponent;
  let fixture: ComponentFixture<SimilarServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
