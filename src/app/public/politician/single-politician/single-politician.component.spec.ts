import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePoliticianComponent } from './single-politician.component';

describe('SinglePoliticianComponent', () => {
  let component: SinglePoliticianComponent;
  let fixture: ComponentFixture<SinglePoliticianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglePoliticianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePoliticianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
