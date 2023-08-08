import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticianContactFormComponentComponent } from './politician-contact-form.component';

describe('PoliticianContactFormComponentComponent', () => {
  let component: PoliticianContactFormComponentComponent;
  let fixture: ComponentFixture<PoliticianContactFormComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliticianContactFormComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticianContactFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
