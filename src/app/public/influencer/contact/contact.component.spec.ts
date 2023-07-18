import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerContactComponent } from './contact.component';

describe('InfluencerContactComponent', () => {
  let component: InfluencerContactComponent;
  let fixture: ComponentFixture<InfluencerContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfluencerContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluencerContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
