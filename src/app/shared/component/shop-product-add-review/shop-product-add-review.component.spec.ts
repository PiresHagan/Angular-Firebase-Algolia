import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopProductAddReviewComponent } from './shop-product-add-review.component';

describe('ShopProductAddReviewComponent', () => {
  let component: ShopProductAddReviewComponent;
  let fixture: ComponentFixture<ShopProductAddReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopProductAddReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopProductAddReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
