import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarPoliticiansComponent } from './similar-politicians.component';

describe('SimilarPoliticiansComponent', () => {
  let component: SimilarPoliticiansComponent;
  let fixture: ComponentFixture<SimilarPoliticiansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarPoliticiansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarPoliticiansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
