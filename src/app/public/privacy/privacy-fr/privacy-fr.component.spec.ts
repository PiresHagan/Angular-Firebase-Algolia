import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyFrComponent } from './privacy-fr.component';

describe('PrivacyFrComponent', () => {
  let component: PrivacyFrComponent;
  let fixture: ComponentFixture<PrivacyFrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyFrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyFrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
