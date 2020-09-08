import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudinaryImgComponent } from './cloudinary-img.component';

describe('CloudinaryImgComponent', () => {
  let component: CloudinaryImgComponent;
  let fixture: ComponentFixture<CloudinaryImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudinaryImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudinaryImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
