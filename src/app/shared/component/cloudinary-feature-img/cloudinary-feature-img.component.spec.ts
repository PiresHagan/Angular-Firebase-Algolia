import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudinaryFeatureImgComponent } from './cloudinary-feature-img.component';

describe('CloudinaryFeatureImgComponent', () => {
  let component: CloudinaryFeatureImgComponent;
  let fixture: ComponentFixture<CloudinaryFeatureImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudinaryFeatureImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudinaryFeatureImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
