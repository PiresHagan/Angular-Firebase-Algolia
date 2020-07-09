import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBackofficeComponent } from './footer-backoffice.component';

describe('FooterBackofficeComponent', () => {
  let component: FooterBackofficeComponent;
  let fixture: ComponentFixture<FooterBackofficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterBackofficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterBackofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
