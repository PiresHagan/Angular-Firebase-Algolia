import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoConferenceBillingComponent } from './video-conference-billing.component';

describe('VideoConferenceBillingComponent', () => {
  let component: VideoConferenceBillingComponent;
  let fixture: ComponentFixture<VideoConferenceBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoConferenceBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoConferenceBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
